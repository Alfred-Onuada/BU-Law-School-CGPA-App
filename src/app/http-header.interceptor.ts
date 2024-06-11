import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // handle 401 errors
    return next.handle(clonedRequest).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
              this.router.navigate(['/login']);

              localStorage.clear();
            }
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);

            localStorage.clear();
          }
        }
      })
    );
  }
}
