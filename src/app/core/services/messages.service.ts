import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { IHttpConnectionOptions } from '@microsoft/signalr/dist/esm/IHttpConnectionOptions';
import { LogLevel } from '@microsoft/signalr/dist/esm/ILogger';
import { HttpTransportType } from '@microsoft/signalr/dist/esm/ITransport';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dialog, Message } from '../models/message';
import { Response } from '../models/response';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  unreadMessagesCount: number;
  rootUrl: string = environment.baseUrl;
  rootApi: string = environment.baseApiUrl;
  private hubConnection: HubConnection;
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

  startConnection(): void {
    if (!!this.hubConnection) {
      return;
    }
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return this.authService.getToken()!;
      },
    };
    this.hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(this.rootUrl + '/messageHub', options)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  addMessageDataListener(callback: Function): void {
    if (!this.hubConnection) {
      this.startConnection();
    }
    this.hubConnection.on('SendMessage', (data) => callback(data));
  }

  getDialogs(): Observable<Response<Dialog[]>> {
    return this.http
      .get<Response<Dialog[]>>(this.rootApi + '/messages/dialogs', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  getMessagesByDialogId(dialogId: number): Observable<Response<Message[]>> {
    return this.http
      .get<Response<Message[]>>(this.rootApi + '/messages/' + dialogId, {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  sendMessage(request: any): Observable<any> {
    return this.http.post(`${this.rootApi}/messages`, request);
  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }

  updateUnreadCount(): void {
    if(!this.authService.isLoggedIn) {
      return;
    }
    this.http
      .get<Response<number>>(this.rootApi + '/messages/unread', {
        withCredentials: true,
      })
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe((response) => {
        this.unreadMessagesCount = response.data;
      });
  }

  get unreadMessages(): boolean {
    if (this.unreadMessagesCount != undefined) {
      return this.unreadMessagesCount > 0;
    }
    return false;
  }
}
