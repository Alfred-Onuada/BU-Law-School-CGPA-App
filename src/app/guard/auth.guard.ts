import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const AuthGuard: CanActivateFn = (route, state) => {
  const jwtHelper = inject(JwtHelperService)
  const router = inject(Router)

  const token = jwtHelper.tokenGetter() as string; // Ensure you have a tokenGetter method or get the token appropriately
  const isExpired = jwtHelper.isTokenExpired(token);

  if (isExpired) {
    router.navigate(["/login"]);
  }

  return true;
};
