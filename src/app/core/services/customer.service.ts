import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseApiServiceUrl = environment.baseApiServiceUrl;
  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/customers`;

    return this.http.get<any>(url, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
