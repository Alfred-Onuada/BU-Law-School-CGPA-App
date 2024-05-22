import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private http: HttpClient
  ) { }

  addStudent(firstName: string, lastName: string, yearEnrolled: number, levelAtEnrollment: number): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/student`, {
      firstName,
      lastName,
      yearEnrolled,
      levelAtEnrollment
    });
  }

  addBulkStudents(students: any[]): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/student/bulk`, students);
  }
 }
