import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function httpInterceptorService(
  req: HttpRequest<any>,
  next: HttpHandlerFn
) {
  const token = localStorage.getItem('_linkToken');
  const newReq = req.clone({
    withCredentials: true,
    headers: req.headers
      .append(
        'Content-Type',
        req.headers.get('Content-Type') || 'application/json'
      )
      .append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
