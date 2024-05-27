import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ISemester } from '../interfaces/semester';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/api-response';
import { ISession } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class SemestersService {
  constructor(
    private http: HttpClient
  ) { }

  getSemesters(sessionId: string): Observable<{semesters: ISemester[], session: ISession}> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/sessions/${sessionId}/semesters`)
      .pipe(
        map((response) => response.data as {semesters: ISemester[], session: ISession})
      );
  }

  createSemester(name: string, optional: boolean, sessionId: string): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/sessions/${sessionId}/semesters`, { name, optional });
  }

  getSemester(semesterId: string): Observable<ISemester> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/semester/${semesterId}`)
      .pipe(
        map((response) => response.data as ISemester)
      );
  }
}
