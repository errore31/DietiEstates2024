import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const reqWithCredentials = request.clone({ withCredentials: true });
  return next(reqWithCredentials);
}

