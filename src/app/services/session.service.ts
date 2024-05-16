import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ISession } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private httpService: HttpClient,
  ) { }

  getSessions(): Observable<ISession[]> {
    return this.httpService.get<ISession[]>(environment.apiUrl + '/sessions');
  }
}
