import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})

export class ImagesService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}
  rootApi: string = environment.baseApiUrl;

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.rootApi}/images`, formData);
  }
}
