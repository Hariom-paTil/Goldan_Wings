import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const token = window.localStorage.getItem('auth_token');
        if (token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(cloned);
        }
      }
    } catch (e) {
      // ignore
    }
    return next.handle(req);
  }
}
