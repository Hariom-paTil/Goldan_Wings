import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error: string | null = null;
  success = false;
  successMessage: string | null = null;

  private adminLoginUrl = 'https://localhost:7196/api/AdminLogin';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check if already logged in as admin
    const adminToken = this.getAdminToken();
    if (adminToken) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value as {
      email: string;
      password: string;
    };

    this.loading = true;
    this.error = null;
    this.success = false;
    this.successMessage = null;

    const payload = {
      email: email,
      password: password,
    };

    this.http.post<any>(this.adminLoginUrl, payload, {
      responseType: 'text' as 'json',
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Admin login response:', res);

        // Treat as success
        this.success = true;
        this.successMessage = 'Admin login successful! Redirecting...';

        // Store admin token
        const adminToken = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
          if (typeof window !== 'undefined' && 'localStorage' in window) {
            window.localStorage.setItem('admin_token', adminToken);
            window.localStorage.setItem('admin_email', email);
          }
        } catch {}

        // Redirect to admin dashboard after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.success = false;

        let msg = 'Admin login failed';

        if (err instanceof ProgressEvent || err?.status === 0 || err?.type === 'error') {
          msg = 'Cannot connect to server. Please try again.';
        } else if (err?.status === 401 || err?.status === 400) {
          msg = 'Invalid email or password.';
        } else if (err?.error) {
          if (typeof err.error === 'string') {
            msg = err.error;
          } else if (err.error.message) {
            msg = err.error.message;
          }
        }

        this.error = msg;
      },
    });
  }

  private getAdminToken(): string | null {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage.getItem('admin_token');
      }
    } catch {}
    return null;
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
