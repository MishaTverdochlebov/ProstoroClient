import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse, Response } from '../models/response';
import { LoginInfo, RegisterInfo, User } from '../models/user';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = environment.baseApiUrl + '/auth';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  isProPage = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.isProPage =
      router.url.includes('/pro/') ||
      router.url.includes('/pro#') ||
      router.url == '/pro';
  }

  getProfileInfo(): Observable<any> {
    return this.http
      .get<Response<any>>(this.endpoint + '/profileinfo', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  getProfileDetails(): Observable<any> {
    return this.http
      .get<Response<any>>(this.endpoint + '/profiledetails', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  updateProfile(request: any): Observable<any> {
    return this.http.put<any>(`${this.endpoint}/update`, request);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${this.endpoint}/delete`);
  }

  register(registerInfo: RegisterInfo): Observable<any> {
    return this.http.post(`${this.endpoint}/register`, registerInfo);
  }

  login(loginInfo: LoginInfo): Observable<any> {
    return this.http.post<LoginResponse>(`${this.endpoint}/login`, loginInfo);
  }

  loginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(
      `${this.endpoint}/googleLogin`,
      JSON.stringify(credentials),
      { headers: header }
    );
  }

  doLogout() {
    if (this.isProPage) {
      localStorage.removeItem('access_token_pro');
    } else {
      localStorage.removeItem('access_token_user');
    }
    //let removeToken = localStorage.removeItem('access_token');
    // if (removeToken == null) {
    //   this.router.navigate(['login']);
    // }
  }

  setToken(token: string, role: string) {
    localStorage.setItem('access_token_' + role, token);
  }

  getToken() {
    if (this.isProPage) {
      return localStorage.getItem('access_token_pro');
    } else {
      return localStorage.getItem('access_token_user');
    }
  }

  get isLoggedIn(): boolean {
    if (this.isProPage) {
      let authToken = localStorage.getItem('access_token_pro');
      return authToken !== null ? true : false;
    } else {
      let authToken = localStorage.getItem('access_token_user');
      return authToken !== null ? true : false;
    }
  }

  checkEmailExistence(email: string) {
    return this.http
      .get<Response<any>>(this.endpoint + '/checkemail/' + email, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  confirmPasswordRecovery(email: string) {
    return this.http
      .get<Response<any>>(this.endpoint + '/confirmrecovery/' + email, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  changePassword(request: any): Observable<any> {
    return this.http.post<any>(`${this.endpoint}/changepassword`, request);
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg); // ???
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}
