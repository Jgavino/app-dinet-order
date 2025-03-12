import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApiServiceUrl = environment.baseApiServiceUrl;

  private authState$ = signal<AuthResponse>({
    id: '',
    isAuthenticated: false,
  });

  readonly isAuthenticated = computed(() => this.authState$().isAuthenticated);
  readonly userId = computed(() => this.authState$().id);

  constructor(private http: HttpClient) {}

  login(body: any): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/account/authenticate`;

    return this.http.post<any>(url, body, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      tap((response) => {
        localStorage.setItem('sessionBulkTransaction', true.toString());
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  setUserAuth(authResponse: AuthResponse): void {
    this.authState$.update((state) => ({
      ...state,
      id: authResponse.id,
      isAuthenticated: authResponse.isAuthenticated,
    }));
  }

  logout(): Observable<any> {
    const url = `${this.baseApiServiceUrl}/api/account/logout`;
    return this.http.post<any>(url, {}, { observe: 'response' }).pipe(
      map((response) => {
        return response;
      }),
      tap(() => {
        this.setLogoutStatus();
        localStorage.clear();
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  setLogoutStatus(): void {
    localStorage.removeItem('sessionBulkTransaction');
    localStorage.removeItem('_linkUserProfile');
    localStorage.removeItem('_linkToken');
    localStorage.removeItem('_linkListDetailOrder');
    localStorage.removeItem('_linkOrderForm');
    this.authState$.update((state) => ({
      ...state,
      id: '',
      isAuthenticated: false,
    }));
  }
}
