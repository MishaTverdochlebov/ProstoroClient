import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Agency, CreateAgencyRequest } from '../models/agency';
import { ErrorService } from 'src/app/core/services/error.service';
import { Response } from '../models/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgenciesService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}
  rootApi: string = environment.baseApiUrl;

  // getAll(): Observable<Response<Agency[]>> {
  //   return this.http
  //     .get<Response<Agency[]>>(this.rootApi + '/agencies', {
  //       withCredentials: true, //???
  //     })
  //     .pipe(catchError(this.errorHandler.bind(this)));
  // }

  get(params: any): Observable<Response<Agency[]>> {
    return this.http
      .get<Response<Agency[]>>(this.rootApi + '/agencies', {
        withCredentials: true,
        params: params,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  getById(id: number): Observable<Response<Agency>> {
    return this.http
      .get<Response<Agency>>(this.rootApi + '/agencies/' + id, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }
  
  toSave(saveParams: any): Observable<any> {
    return this.http.post(`${this.rootApi}/agencies/save`, saveParams);
  }

  getProfile(): Observable<Response<Agency>> {
    return this.http
      .get<Response<Agency>>(this.rootApi + '/agencies/profile', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  updateAgency(request: any, id: number): Observable<any> {
    return this.http.put(this.rootApi + '/agencies/' + id, request);
  }

  // updateHeaderImage(headerImgUrl: string, id: number): Observable<any> {
  //   return this.http.post(this.rootApi + '/agencies/headerImg/' + id, headerImgUrl);
  // }

  createAgency(request: any): Observable<any> {
    return this.http.post(`${this.rootApi}/agencies`, request);
  }

  sendReview(reviewDto: any): Observable<any> {
    return this.http.post(`${this.rootApi}/reviews`, reviewDto);
  }

  sendComplaint(complaintDto: any): Observable<any> {
    return this.http.post(`${this.rootApi}/reviews/complaint`, complaintDto);
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}
