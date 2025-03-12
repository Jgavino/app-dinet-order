import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseApiServiceUrl = environment.baseApiServiceUrl;
  constructor(private http: HttpClient) {}

  getAllOrders(request: any): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/orders`;

    const params = new HttpParams().appendAll(request);

    return this.http.get<any>(url, { observe: 'response', params }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  createOrder(request: any): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/orders`;

    return this.http.post<any>(url, request, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  updateOrder(request: any): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/orders`;

    return this.http.put<any>(url, request, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  getOrderById(id: string): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/orders/${id}`;

    return this.http.get<any>(url, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  deleteOrder(id: string): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/orders/${id}`;

    return this.http.delete<any>(url, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }
}
