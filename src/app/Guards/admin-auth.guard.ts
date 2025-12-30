import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function getAdminToken(): string | null {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      return window.localStorage.getItem('admin_token');
    }
  } catch {}
  return null;
}

// If already logged in, skip the login page and go to admin home.
export const adminLoggedInRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = getAdminToken();
  if (token) {
    router.navigate(['/about/G_W_AdminPanel/home']);
    return false;
  }
  return true;
};

// Protect admin home; if not logged in, go back to login.
export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = getAdminToken();
  if (!token) {
    router.navigate(['/about/G_W_AdminPanel']);
    return false;
  }
  return true;
};
