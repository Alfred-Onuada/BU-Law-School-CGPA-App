import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/auth/login`, { email, password });
  }
}
