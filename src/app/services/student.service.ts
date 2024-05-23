import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/api-response';
import { IStudent } from '../interfaces/students';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  addStudent(
    firstName: string,
    lastName: string,
    yearEnrolled: number,
    levelAtEnrollment: number
  ): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/student`, {
      firstName,
      lastName,
      yearEnrolled,
      levelAtEnrollment,
    });
  }

  addBulkStudents(students: any[]): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(
      `${environment.apiUrl}/student/bulk`,
      students
    );
  }

  getStudents(
    sessionId: string,
    level: number,
    semesterId: string,
    pageSize: number,
    currentPage?: number,
    query?: string
  ): Observable<{ students: IStudent[]; total: number }> {
    return this.http
      .get<IApiResponse>(`${environment.apiUrl}/students`, {
        params: {
          sessionId,
          level,
          semesterId,
          limit: pageSize.toString(),
          page: currentPage || 1,
          query: query || '',
        },
      })
      .pipe(
        map(
          (response) => response.data as { students: IStudent[]; total: number }
        )
      );
  }

  getStudent(studentId: string): Observable<IStudent> {
    return this.http
      .get<IApiResponse>(`${environment.apiUrl}/student/${studentId}`)
      .pipe(map((response) => response.data as IStudent));
  }
}
