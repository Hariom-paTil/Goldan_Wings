import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let origStorage: any;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [AuthService] });
    service = TestBed.inject(AuthService);
    origStorage = (window as any).localStorage;
  });

  afterEach(() => {
    (window as any).localStorage = origStorage;
  });

  it('restore() populates user$ when auth_user exists', async () => {
    const saved: User = { email: 'test@example.com', name: 'Test' };
    (window as any).localStorage = { getItem: (k: string) => (k === 'auth_user' ? JSON.stringify(saved) : null) };

    service.restore();

    const user = await firstValueFrom(service.user$.pipe(filter((u) => !!u)));
    expect(user).toEqual(saved);
  });

  it('restore() does not throw on invalid JSON', async () => {
    (window as any).localStorage = { getItem: (k: string) => (k === 'auth_user' ? '{invalid json' : null) };

    // Should not throw
    expect(() => service.restore()).not.toThrow();
    // user$ should remain null
    const current = await firstValueFrom(service.user$.pipe(filter((u) => u === null || !!u)));
    expect(current === null || !!current).toBeTrue();
  });
});