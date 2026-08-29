import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { User } from '@flatfinder/types';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/api/auth.service';
import { Profile } from './profile';

const TOKEN_KEY = 'flatfinder.token';

const guest: User = {
  id: 'u1',
  email: 'michael@flatfinder.test',
  firstName: 'Michael',
  lastName: 'Veliz',
  birthDate: '1998-04-12T00:00:00.000Z',
  role: 'guest',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('Profile', () => {
  let fixture: ComponentFixture<Profile>;
  let component: Profile;
  let auth: AuthService;
  let http: HttpTestingController;

  async function renderAs(user: User): Promise<void> {
    localStorage.setItem(TOKEN_KEY, 'a-token');
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    auth.setCurrentUser(user);

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [Profile] });
  });

  afterEach(() => localStorage.clear());

  it('hides the role from an ordinary user', async () => {
    await renderAs(guest);

    // Everyone is a guest until they are not, so the label says nothing.
    expect(fixture.nativeElement.textContent).not.toContain('Role');
    expect(fixture.nativeElement.querySelector('.profile__role')).toBeNull();
    http.verify();
  });

  it('shows the role to an administrator', async () => {
    await renderAs({ ...guest, role: 'admin' });

    expect(fixture.nativeElement.textContent).toContain('Role');
    expect(fixture.nativeElement.querySelector('.profile__role')?.textContent).toContain('admin');
    http.verify();
  });

  it('offers initials until a picture is set', async () => {
    await renderAs(guest);

    expect(fixture.nativeElement.querySelector('.avatar-picker__initials')?.textContent).toBe('MV');
    expect(fixture.nativeElement.querySelector('.avatar-picker__image')).toBeNull();
    http.verify();
  });

  it('renders the picture once there is one', async () => {
    await renderAs({ ...guest, avatarUrl: 'https://example.test/face.jpg' });

    const img: HTMLImageElement = fixture.nativeElement.querySelector('.avatar-picker__image');
    expect(img.getAttribute('src')).toBe('https://example.test/face.jpg');
    http.verify();
  });

  it('saves a new picture on its own, without the profile form', async () => {
    await renderAs(guest);

    component.saveAvatar('https://example.test/face.jpg');

    const request = http.expectOne(`${environment.apiUrl}/users/${guest.id}`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ avatarUrl: 'https://example.test/face.jpg' });

    request.flush({
      success: true,
      data: { ...guest, avatarUrl: 'https://example.test/face.jpg' },
    });
    await fixture.whenStable();

    expect(auth.currentUser()?.avatarUrl).toBe('https://example.test/face.jpg');
    expect(component.successMessage()).toBe('Picture updated');
    http.verify();
  });

  it('sends an empty string to remove the picture', async () => {
    await renderAs({ ...guest, avatarUrl: 'https://example.test/face.jpg' });

    component.saveAvatar('');

    const request = http.expectOne(`${environment.apiUrl}/users/${guest.id}`);
    expect(request.request.body).toEqual({ avatarUrl: '' });
    request.flush({ success: true, data: guest });
    await fixture.whenStable();

    expect(component.successMessage()).toBe('Picture removed');
    http.verify();
  });

  it('leaves the password out of the payload when it was not changed', async () => {
    await renderAs(guest);

    component.toggleEdit();
    component.form.patchValue({ firstName: 'Miguel', password: '' });
    component.save();

    const request = http.expectOne(`${environment.apiUrl}/users/${guest.id}`);
    // Sending an empty password used to overwrite the real one on every save.
    expect(request.request.body).not.toHaveProperty('password');
    expect(request.request.body.firstName).toBe('Miguel');

    request.flush({ success: true, data: { ...guest, firstName: 'Miguel' } });
    http.verify();
  });
});
