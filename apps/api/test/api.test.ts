import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { Express } from 'express';

/**
 * Recorrido completo del contrato que consume apps/web. Se levanta una Mongo
 * en memoria, de modo que los tests no dependen de ninguna base externa.
 *
 * El entorno se prepara antes de importar la app, porque config/env valida
 * process.env en el momento de cargarse.
 */
let mongo: MongoMemoryServer;
let app: Express;
let connectDatabase: (uri: string) => Promise<void>;
let disconnectDatabase: () => Promise<void>;

before(async () => {
  // Margen amplio: la primera ejecucion en una maquina limpia (o en CI)
  // descarga el binario de mongod antes de poder arrancar.
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

describe('registro y autenticacion', () => {
  it('registra un usuario y devuelve token sin filtrar la contrasena', async () => {
    const res = await request(app).post('/api/users/register').send(owner).expect(201);

    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, owner.email);
    assert.equal(res.body.data.user.role, 'guest');
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.password, undefined);

    ownerToken = res.body.data.token;
  });

  it('no permite autoasignarse el rol de admin al registrarse', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ ...tenant, role: 'admin' })
      .expect(201);

    assert.equal(res.body.data.user.role, 'guest');
    tenantToken = res.body.data.token;
  });

  it('rechaza un email repetido', async () => {
    const res = await request(app).post('/api/users/register').send(owner).expect(409);
    assert.equal(res.body.error.code, 'CONFLICT');
  });

  it('rechaza una contrasena debil con detalle por campo', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ ...owner, email: 'otro@flatfinder.test', password: 'corta' })
      .expect(400);

    assert.ok(res.body.error.details.password.length > 0);
  });

  it('da el mismo error con email inexistente que con contrasena incorrecta', async () => {
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

  it('inicia sesion con credenciales validas', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: owner.email, password: owner.password })
      .expect(200);

    assert.ok(res.body.data.token);
    ownerToken = res.body.data.token;
  });
});

describe('proteccion de rutas', () => {
  it('rechaza el listado de pisos sin token', async () => {
    const res = await request(app).get('/api/flats').expect(401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  it('rechaza el listado de usuarios a quien no es admin', async () => {
    const res = await request(app).get('/api/users').set(auth(ownerToken)).expect(403);
    assert.equal(res.body.error.code, 'FORBIDDEN');
  });

  it('no deja consultar la ficha de otro usuario', async () => {
    const me = await request(app).get('/api/users/me').set(auth(tenantToken)).expect(200);

    await request(app).get(`/api/users/${me.body.data.id}`).set(auth(ownerToken)).expect(403);
  });
});

describe('pisos', () => {
  it('crea un piso y lo atribuye a quien lo publica', async () => {
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

  it('rechaza un piso con datos invalidos', async () => {
    const res = await request(app)
      .post('/api/flats')
      .set(auth(ownerToken))
      .send({ ...flatPayload, areaSize: -5, yearBuilt: 1700 })
      .expect(400);

    assert.ok(res.body.error.details.areaSize);
    assert.ok(res.body.error.details.yearBuilt);
  });

  it('filtra y pagina el listado', async () => {
    const res = await request(app)
      .get('/api/flats')
      .query({ city: 'vancouver', maxPrice: 3000, limit: 10 })
      .set(auth(tenantToken))
      .expect(200);

    assert.equal(res.body.data.total, 1);
    assert.equal(res.body.data.items[0].id, flatId);
  });

  it('devuelve vacio cuando el filtro no encaja', async () => {
    const res = await request(app)
      .get('/api/flats')
      .query({ maxPrice: 100 })
      .set(auth(tenantToken))
      .expect(200);

    assert.equal(res.body.data.total, 0);
  });

  it('impide que otro usuario edite o borre el piso', async () => {
    await request(app)
      .patch(`/api/flats/${flatId}`)
      .set(auth(tenantToken))
      .send({ rentPrice: 1 })
      .expect(403);

    await request(app).delete(`/api/flats/${flatId}`).set(auth(tenantToken)).expect(403);
  });

  it('permite al propietario editar su piso', async () => {
    const res = await request(app)
      .patch(`/api/flats/${flatId}`)
      .set(auth(ownerToken))
      .send({ rentPrice: 2400 })
      .expect(200);

    assert.equal(res.body.data.rentPrice, 2400);
  });

  it('devuelve 400 ante un identificador malformado', async () => {
    const res = await request(app).get('/api/flats/no-es-un-id').set(auth(ownerToken)).expect(400);
    assert.equal(res.body.error.code, 'INVALID_ID');
  });
});

describe('favoritos', () => {
  it('anade, no duplica y elimina', async () => {
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

describe('mensajes', () => {
  it('un interesado escribe al propietario', async () => {
    const res = await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(tenantToken))
      .send({ content: 'Hola, sigue disponible?' })
      .expect(201);

    assert.equal(res.body.data.content, 'Hola, sigue disponible?');
  });

  it('el propietario no puede escribirse a si mismo', async () => {
    await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(ownerToken))
      .send({ content: 'Hola yo' })
      .expect(403);
  });

  it('rechaza un mensaje vacio', async () => {
    await request(app)
      .post(`/api/flats/${flatId}/messages`)
      .set(auth(tenantToken))
      .send({ content: '   ' })
      .expect(400);
  });

  it('el propietario ve la conversacion del piso', async () => {
    const res = await request(app)
      .get(`/api/flats/${flatId}/messages`)
      .set(auth(ownerToken))
      .expect(200);

    assert.equal(res.body.data.length, 1);
  });
});

describe('perfil', () => {
  it('permite al usuario cambiar su contrasena y volver a entrar con ella', async () => {
    const me = await request(app).get('/api/users/me').set(auth(ownerToken)).expect(200);

    await request(app)
      .patch(`/api/users/${me.body.data.id}`)
      .set(auth(ownerToken))
      .send({ password: 'NuevaClave9' })
      .expect(200);

    // Si updateUser volviera a usar findByIdAndUpdate, la contrasena quedaria
    // sin hashear y este login fallaria.
    await request(app)
      .post('/api/users/login')
      .send({ email: owner.email, password: 'NuevaClave9' })
      .expect(200);
  });
});
