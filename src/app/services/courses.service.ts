import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICourse } from '../interfaces/course';
import { IApiResponse } from '../interfaces/api-response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  getCourses(
    sessionId: string,
    semesterId: string,
    level: number
  ): Observable<ICourse[]> {
    return this.http
      .get<IApiResponse>(`${environment.apiUrl}/courses`, {
        params: {
          sessionId,
          semesterId,
          level: level,
        },
      })
      .pipe(map((response) => response.data as ICourse[]));
  }

  saveCourses(courses: ICourse[]): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(`${environment.apiUrl}/courses`, courses);
  }

  deleteCourse(courseId: string): Observable<IApiResponse> {
    return this.http.delete<IApiResponse>(
      `${environment.apiUrl}/course/${courseId}`
    );
  }
}
