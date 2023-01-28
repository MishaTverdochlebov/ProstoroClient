import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SavesService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}
  private rootApi: string = environment.baseApiUrl;

  get(): Observable<any> {
    return this.http
      .get<Response<any>>(this.rootApi + '/saves', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  getByFolderName(folderName: string): Observable<any> {
    return this.http
      .get<Response<any>>(this.rootApi + '/saves/' + folderName, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}
