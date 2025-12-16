import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @Output() close = new EventEmitter<void>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value as { email: string; password: string };
    this.loading = true;
    this.error = null;
    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.close.emit();
      },
      error: (err: any) => {
        this.loading = false;
        // Show helpful message for network/CORS failures (ProgressEvent) and server messages
        if (err instanceof ProgressEvent || err?.type === 'error' || err?.status === 0) {
          this.error = 'Network error or CORS blocked — check the browser console and server.';
        } else {
          this.error = err?.message || err?.error?.message || 'Login failed. Please try again.';
        }
      },
    });
  }

  cancel() {
    this.close.emit();
  }
}
