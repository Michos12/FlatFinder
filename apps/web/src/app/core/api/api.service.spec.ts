import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('unwraps the envelope so callers see the data alone', () => {
    let received: unknown;
    api.get<{ id: string }>('/flats/abc').subscribe((value) => (received = value));

    http.expectOne(`${environment.apiUrl}/flats/abc`).flush({
      success: true,
      data: { id: 'abc' },
    });

    expect(received).toEqual({ id: 'abc' });
  });

  it('drops filters that have no value', () => {
    api
      .get('/flats', { city: 'Quebec', maxPrice: undefined, minArea: null, sortBy: '' })
      .subscribe();

    // An empty filter must not travel: the API would read it as a real value
    // and return nothing.
    const request = http.expectOne((r) => r.url === `${environment.apiUrl}/flats`);
    expect(request.request.params.get('city')).toBe('Quebec');
    expect(request.request.params.has('maxPrice')).toBe(false);
    expect(request.request.params.has('minArea')).toBe(false);
    expect(request.request.params.has('sortBy')).toBe(false);

    request.flush({ success: true, data: { items: [], total: 0, page: 1, limit: 20 } });
  });

  it('keeps numbers and booleans that are actually set', () => {
    api.get('/flats', { maxPrice: 2000, hasAC: false }).subscribe();

    const request = http.expectOne((r) => r.url === `${environment.apiUrl}/flats`);
    expect(request.request.params.get('maxPrice')).toBe('2000');
    expect(request.request.params.get('hasAC')).toBe('false');

    request.flush({ success: true, data: { items: [], total: 0, page: 1, limit: 20 } });
  });

  it('sends an empty object rather than null on a bodyless post', () => {
    api.put('/users/me/favorites/abc').subscribe();

    const request = http.expectOne(`${environment.apiUrl}/users/me/favorites/abc`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({});

    request.flush({ success: true, data: [] });
  });

  it('expects no envelope from a 204 delete', () => {
    let completed = false;
    api.deleteVoid('/flats/abc').subscribe(() => (completed = true));

    const request = http.expectOne(`${environment.apiUrl}/flats/abc`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });

    expect(completed).toBe(true);
  });
});
