import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { Express } from 'express';

/**
 * A full pass over the contract apps/web consumes. An in-memory MongoDB is
 * started, so these tests depend on no external database.
 *
 * The environment is prepared before importing the app, because config/env
 * validates process.env the moment it is loaded.
 */
let mongo: MongoMemoryServer;
let app: Express;
let connectDatabase: (uri: string) => Promise<void>;
let disconnectDatabase: () => Promise<void>;

before(async () => {
  // Generous window: on a clean machine (or in CI) the first run downloads the
  // mongod binary before it can start.
  mongo = await MongoMemoryServer.create({ instance: { launchTimeout: 180_000 } });

  process.env['NODE_ENV'] = 'test';
  process.env['MONGO_URL'] = mongo.getUri();
  process.env['SECRET_KEY'] = 'secreto-de-pruebas-suficientemente-largo-1234';
  process.env['CORS_ORIGIN'] = 'http://localhost:4200';

  const db = await import('../src/config/db.js');
  connectDatabase = db.connectDatabase;
  disconnectDatabase = db.disconnectDatabase;
  await connectDatabase(mongo.getUri());

  app = (await import('../src/app.js')).createApp();
});

after(async () => {
  await disconnectDatabase();
  await mongo.stop();
});

const owner = {
  email: 'owner@flatfinder.test',
  password: 'Contrasena1',
  firstName: 'Olivia',
  lastName: 'Owner',
  birthDate: '1990-05-02',
};

const tenant = {
  email: 'tenant@flatfinder.test',
  password: 'Contrasena2',
  firstName: 'Tomas',
  lastName: 'Tenant',
  birthDate: '1995-11-20',
};

const flatPayload = {
  city: 'Vancouver',
  streetName: 'Kingsway',
  streetNumber: 2917,
  areaSize: 40,
  hasAC: true,
  yearBuilt: 2000,
  rentPrice: 2500,
  dateAvailable: '2026-02-23',
  description: 'Cerca de la parada de autobus',
};

let ownerToken = '';
let tenantToken = '';
let flatId = '';

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('registration and authentication', () => {
  it('registers a user and returns a token without leaking the password', async () => {
    const res = await request(app).post('/api/users/register').send(owner).expect(201);

    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, owner.email);
    assert.equal(res.body.data.user.role, 'guest');
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.password, undefined);

    ownerToken = res.body.data.token;
  });

  it('does not let you grant yourself the admin role at registration', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ ...tenant, role: 'admin' })
      .expect(201);

    assert.equal(res.body.data.user.role, 'guest');
    tenantToken = res.body.data.token;
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app).post('/api/users/register').send(owner).expect(409);
    assert.equal(res.body.error.code, 'CONFLICT');
  });

  it('rejects a weak password with per-field detail', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ ...owner, email: 'otro@flatfinder.test', password: 'corta' })
      .expect(400);

    assert.ok(res.body.error.details.password.length > 0);
  });

  it('gives the same error for an unknown email as for a wrong password', async () => {
    const desconocido = await request(app)
      .post('/api/users/login')
      .send({ email: 'nadie@flatfinder.test', password: 'Contrasena1' })
      .expect(401);

    const incorrecta = await request(app)
      .post('/api/users/login')
      .send({ email: owner.email, password: 'Incorrecta9' })
      .expect(401);

    assert.equal(desconocido.body.error.message, incorrecta.body.error.message);
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: owner.email, password: owner.password })
      .expect(200);

    assert.ok(res.body.data.token);
    ownerToken = res.body.data.token;
  });
});

describe('proteccion de rutas', () => {
  it('rejects the flat listing without a token', async () => {
    const res = await request(app).get('/api/flats').expect(401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('rejects the user listing for anyone who is not an admin', async () => {
    const res = await request(app).get('/api/users').set(auth(ownerToken)).expect(403);
    assert.equal(res.body.error.code, 'FORBIDDEN');
  });

  it('does not allow reading another user record', async () => {
    const me = await request(app).get('/api/users/me').set(auth(tenantToken)).expect(200);

    await request(app).get(`/api/users/${me.body.data.id}`).set(auth(ownerToken)).expect(403);
  });
});

describe('flats', () => {
  it('creates a flat and attributes it to whoever published it', async () => {
    const me = await request(app).get('/api/users/me').set(auth(ownerToken)).expect(200);

    const res = await request(app)
      .post('/api/flats')
      .set(auth(ownerToken))
      .send(flatPayload)
      .expect(201);

    assert.equal(res.body.data.city, 'Vancouver');
    assert.equal(res.body.data.rentPrice, 2500);
    assert.equal(res.body.data.ownerId, me.body.data.id);

    flatId = res.body.data.id;
  });

  it('rejects a flat with invalid data', async () => {
    const res = await request(app)
      .post('/api/flats')
      .set(auth(ownerToken))
      .send({ ...flatPayload, areaSize: -5, yearBuilt: 1700 })
      .expect(400);

    assert.ok(res.body.error.details.areaSize);
    assert.ok(res.body.error.details.yearBuilt);
  });

  it('filters and paginates the listing', async () => {
    const res = await request(app)
      .get('/api/flats')
      .query({ city: 'vancouver', maxPrice: 3000, limit: 10 })
      .set(auth(tenantToken))
      .expect(200);

    assert.equal(res.body.data.total, 1);
    assert.equal(res.body.data.items[0].id, flatId);
  });

  it('comes back empty when nothing matches the filter', async () => {
    const res = await request(app)
      .get('/api/flats')
      .query({ maxPrice: 100 })
      .set(auth(tenantToken))
      .expect(200);

    assert.equal(res.body.data.total, 0);
  });

  it('stops another user from editing or deleting the flat', async () => {
    await request(app)
      .patch(`/api/flats/${flatId}`)
      .set(auth(tenantToken))
      .send({ rentPrice: 1 })
      .expect(403);

    await request(app).delete(`/api/flats/${flatId}`).set(auth(tenantToken)).expect(403);
  });

  it('lets the owner edit their own flat', async () => {
    const res = await request(app)
      .patch(`/api/flats/${flatId}`)
      .set(auth(ownerToken))
      .send({ rentPrice: 2400 })
      .expect(200);

    assert.equal(res.body.data.rentPrice, 2400);
  });

  it('answers 400 for a malformed identifier', async () => {
    const res = await request(app).get('/api/flats/no-es-un-id').set(auth(ownerToken)).expect(400);
    assert.equal(res.body.error.code, 'INVALID_ID');
  });
});

describe('favourites', () => {
  it('adds, does not duplicate, and removes', async () => {
    const added = await request(app)
      .put(`/api/users/me/favorites/${flatId}`)
      .set(auth(tenantToken))
      .expect(200);
    assert.equal(added.body.data.length, 1);

    const again = await request(app)
      .put(`/api/users/me/favorites/${flatId}`)
      .set(auth(tenantToken))
      .expect(200);
    assert.equal(again.body.data.length, 1);

    const removed = await request(app)
      .delete(`/api/users/me/favorites/${flatId}`)
      .set(auth(tenantToken))
      .expect(200);
    assert.equal(removed.body.data.length, 0);
  });
});

describe('messages', () => {
  it('an interested user writes to the owner', async () => {
    const res = await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(tenantToken))
      .send({ content: 'Hi, is this still available?' })
      .expect(201);

    assert.equal(res.body.data.content, 'Hi, is this still available?');
  });

  it('the owner cannot message themselves', async () => {
    await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(ownerToken))
      .send({ content: 'Hello me' })
      .expect(403);
  });

  it('rejects an empty message', async () => {
    await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(tenantToken))
      .send({ content: '   ' })
      .expect(400);
  });

  it('the owner sees the conversation for the flat', async () => {
    const res = await request(app)
      .get(`/api/flats/${flatId}/messages`)
      .set(auth(ownerToken))
      .expect(200);

    assert.equal(res.body.data.length, 1);
  });
});

describe('profile', () => {
  it('lets a user change their password and log in with the new one', async () => {
    const me = await request(app).get('/api/users/me').set(auth(ownerToken)).expect(200);

    await request(app)
      .patch(`/api/users/${me.body.data.id}`)
      .set(auth(ownerToken))
      .send({ password: 'NuevaClave9' })
      .expect(200);

    // If updateUser went back to findByIdAndUpdate, the password would be
    // stored unhashed and this login would fail.
    await request(app)
      .post('/api/users/login')
      .send({ email: owner.email, password: 'NuevaClave9' })
      .expect(200);
  });
});
