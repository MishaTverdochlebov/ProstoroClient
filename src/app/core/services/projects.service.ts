import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectCreateRequest, ProjectDetails } from '../models/project';
import { Response } from '../models/response';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}
  rootApi: string = environment.baseApiUrl;

  getById(id: number): Observable<Response<ProjectDetails>> {
    return this.http
      .get<Response<ProjectDetails>>(this.rootApi + '/projects/' + id, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  post(request: ProjectCreateRequest): Observable<any> {
    return this.http.post(`${this.rootApi}/projects`, request);
  }

  toLike(likeParams: any): Observable<any> {
    return this.http.post(`${this.rootApi}/projects/like`, likeParams);
  }
  
  toSave(saveParams: any): Observable<any> {
    return this.http.post(`${this.rootApi}/projects/save`, saveParams);
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
}
