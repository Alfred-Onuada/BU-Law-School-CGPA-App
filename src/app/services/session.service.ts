import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ISession } from '../interfaces/session';
import { IApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private httpService: HttpClient,
  ) { }

  getSessions(): Observable<ISession[]> {
    return this.httpService.get<IApiResponse>(`${environment.apiUrl}/sessions`)
      .pipe(
        map((response: IApiResponse) => response.data)
      );
  }

  getSession(sessionId: string): Observable<ISession> {
    return this.httpService.get<IApiResponse>(`${environment.apiUrl}/session/${sessionId}`)
      .pipe(
        map((response: IApiResponse) => response.data)
      );
  }

  createSession(name: string, startYear: number): Observable<IApiResponse> {
    return this.httpService.post<IApiResponse>(`${environment.apiUrl}/sessions`, { name, startYear });
  }
}
