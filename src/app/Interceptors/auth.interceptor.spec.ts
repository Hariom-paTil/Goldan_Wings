import { AuthInterceptor } from './auth.interceptor';
import { HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let origStorage: any;

  beforeEach(() => {
    interceptor = new AuthInterceptor();
    // backup and ensure localStorage exists in test env
    origStorage = (window as any).localStorage;
    if (!origStorage) {
      (window as any).localStorage = { getItem: () => null };
    }
  });

  afterEach(() => {
    (window as any).localStorage = origStorage;
  });

  it('adds Authorization header when token present', (done) => {
    const token = 'abc-123-token';
    (window as any).localStorage = { getItem: (k: string) => (k === 'auth_token' ? token : null) };

    const req = new HttpRequest('GET', '/some');
    const handler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        try {
          expect(r.headers.get('Authorization')).toBe(`Bearer ${token}`);
          done();
        } catch (err) {
          done.fail(err as Error);
        }
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(req, handler).subscribe();
  });

  it('does not set Authorization when no token', (done) => {
    (window as any).localStorage = { getItem: () => null };

    const req = new HttpRequest('GET', '/some');
    const handler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        try {
          expect(r.headers.has('Authorization')).toBeFalse();
          done();
        } catch (err) {
          done.fail(err as Error);
        }
        return of(new HttpResponse({ status: 200 }));
      },
    };

    interceptor.intercept(req, handler).subscribe();
  });
});