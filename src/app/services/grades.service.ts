import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICoursesAndGrade } from '../interfaces/courses-and-grades';
import { IApiResponse } from '../interfaces/api-response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  constructor(private http: HttpClient) {}

  getCoursesAndGrade(
    sessionId: string,
    semesterId: string,
    level: string,
    studentId: string
  ): Observable<ICoursesAndGrade[]> {
    return this.http
      .get<IApiResponse>(`${environment.apiUrl}/grades`, {
        params: {
          sessionId,
          semesterId,
          level,
          studentId,
        },
      })
      .pipe(map((response) => response.data as ICoursesAndGrade[]));
  }
  
  saveGrade(
    score: number, studentId: string, courseId: string, studentLevel: number, semesterId: string, sessionId: string
  ): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/grades`, {
      score,
      studentId,
      courseId,
      studentLevel,
      semesterId,
      sessionId,
    });
  }
}
