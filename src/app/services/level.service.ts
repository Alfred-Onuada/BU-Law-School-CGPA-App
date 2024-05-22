import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../interfaces/api-response';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILevel } from '../interfaces/level';
import { ISemester } from '../interfaces/semester';
import { ISession } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  constructor(
    private http: HttpClient
  ) { }

  getLevels(): Observable<ILevel[]> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/levels`)
      .pipe(
        map((response) => response.data as ILevel[])
      );
  }

  createLevel(name: number): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/levels`, { name });
  }

  getSemesterAndSessionDetails(semesterId: string): Observable<{semester: ISemester, session: ISession}> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/semestersAndSession/${semesterId}`)
      .pipe(
        map((response) => response.data as {semester: ISemester, session: ISession})
      );
  }
}
