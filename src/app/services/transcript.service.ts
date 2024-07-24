import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../interfaces/api-response';
import { IGPASummary, IStudentGrade, IStudentTranscript } from '../interfaces/student-info-transcript';

@Injectable({
  providedIn: 'root',
})
export class TranscriptService {
  constructor(private http: HttpClient) {}

  fetchTranscript(studentId: string): Observable<{studentInfo: IStudentTranscript, grades: IStudentGrade[], gpaSummary: IGPASummary}> {
    return this.http.get<IApiResponse>(`${environment.apiUrl}/student/${studentId}/transcript`)
      .pipe(
        map((response) => response.data as {studentInfo: IStudentTranscript, grades: IStudentGrade[], gpaSummary: IGPASummary})
      );
  }
}
