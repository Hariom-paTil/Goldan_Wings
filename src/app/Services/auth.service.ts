import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface User {
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this._user$.asObservable();

 
  // Backend login endpoint (updated)
  private baseUrl = 'https://localhost:7196/api/Login/register';

  constructor(private http: HttpClient) {}


  login(email: string, password: string): Observable<boolean> {
    // Use server-expected payload shape: Email and Password
    return this.http.post<any>(this.baseUrl, {
      Email: email,
      Password: password
    }).pipe(
      tap((resp: any) => {
        // Expect response shape: { success: boolean, user?: User, token?: string }
        if (resp && resp.success) {
          const user: User = resp.user ?? { email };
          this._user$.next(user);
          try {
            if (typeof window !== 'undefined' && 'localStorage' in window) {
              window.localStorage.setItem('auth_user', JSON.stringify(user));
              if (resp.token) {
                window.localStorage.setItem('auth_token', resp.token);
              }
            }
          } catch {}
        } else {
          throw new Error('Login failed');
        }
      }),
      map(() => true),
      catchError(err => {
        // Handle network/CORS failures and surface validation messages from server (400)
        let message = 'Login failed';
        if (err instanceof ProgressEvent || err?.type === 'error' || err?.status === 0) {
          message = 'Network error or CORS blocked — check server, browser console, and CORS settings.';
        } else if (err?.status === 400 && err?.error && err.error.errors) {
          // Aggregate model validation messages: { errors: { Field: ["msg"] } }
          const errs = err.error.errors;
          const msgs = Object.values(errs).flat().join(' ');
          message = msgs || 'Validation failed';
        } else if (err?.error) {
          message = typeof err.error === 'string' ? err.error : (err.error.message || JSON.stringify(err.error));
        } else if (err?.message) {
          message = err.message;
        }
        return throwError(() => new Error(message));
      })
    );
  }

  logout() {
    const storage = (typeof window !== 'undefined' && 'localStorage' in window) ? window.localStorage : null;
    if (storage) {
      storage.removeItem('auth_token');
      storage.removeItem('auth_user');
    }
    this._user$.next(null);
  }

  
  restore(): void {
    try {
      const storage = (typeof window !== 'undefined' && 'localStorage' in window) ? window.localStorage : null;
      if (storage) {
        const saved = storage.getItem('auth_user');
        if (saved) {
          try {
            const user = JSON.parse(saved) as User;
            this._user$.next(user);
          } catch {}
        }
      }
    } catch (e) {
      // ignore
    }
  }
}
