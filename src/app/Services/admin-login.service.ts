import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminLoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminLoginService {
  private readonly adminLoginUrl = 'https://localhost:7196/api/AdminLogin';

  constructor(private http: HttpClient) {}

  login(payload: AdminLoginPayload): Observable<string> {
    return this.http.post<string>(this.adminLoginUrl, payload, {
      responseType: 'text' as 'json',
    });
  }
}
