import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { Dialog, Message } from 'src/app/core/models/message';
import { MessagesService } from 'src/app/core/services/messages.service';

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.css'],
})
export class MessagesPageComponent implements OnInit {
  dialogsList: Dialog[];
  loading = false;
  selectedDialog?: Dialog;
  messagesList: Message[];
  separatedMessages: any[];
  @ViewChild('sendMessageTextarea') sendMessageTextarea: ElementRef;
  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.loadDialogs();
    this.messagesService.addMessageDataListener((data: any) => {
      this.loadDialogs();
    });
  }

  loadDialogs(): void {
    this.loading = true;
    this.messagesService.getDialogs().subscribe((response) => {
      this.dialogsList = response.data;
      if(this.selectedDialog) {
        this.selectedDialog = this.dialogsList.find(d => d.id === this.selectedDialog!.id)
        this.loadMessages();
      }
      this.orderDialogs();
    });
  }

  orderDialogs(): void {
    this.dialogsList = this.dialogsList.sort(
      (objA, objB) =>
        new Date(objB.lastMessage!.date!).getTime() -
        new Date(objA.lastMessage!.date!).getTime()
    );
  }

  separateMessagesByDate(): void {
    this.separatedMessages = [];
    this.separatedMessages.push({
      messages: [],
      date: this.messagesList[0]?.date,
    });
    this.separatedMessages[0].messages.push(this.messagesList[0]);
    let separatedMessagesCount = 0;
    for (let i = 1; i < this.messagesList.length; i++) {
      const preElement = this.messagesList[i - 1];
      const element = this.messagesList[i];
      const preElementDate = new Date(preElement.date!);
      const elementDate = new Date(element.date!);
      if (
        elementDate.getFullYear() === preElementDate.getFullYear() &&
        elementDate.getMonth() === preElementDate.getMonth() &&
        elementDate.getDate() === preElementDate.getDate()
      ) {
        // this.separatedMessages[0].messages.push(this.messagesList[0]);
        this.separatedMessages[separatedMessagesCount].messages.push(element);
      } else {
        this.separatedMessages.push({
          messages: [],
          date: element.date,
        });
        this.separatedMessages[++separatedMessagesCount].messages.push(element);
      }
    }
  }

  selectDialog(dialog: Dialog): void {
    this.selectedDialog = dialog;
    this.loadMessages();
  }

  loadMessages(): void {
    if(!this.selectedDialog) {
      return;
    }
    this.messagesService
      .getMessagesByDialogId(this.selectedDialog!.id!)
      .subscribe((response) => {
        this.messagesList = response.data; //.sort((objA, objB) => objA.date.getTime() - objB.date.getTime());
        this.separateMessagesByDate();
        this.selectedDialog!.unviewedCount = 0;
        this.messagesService.updateUnreadCount();
      });
  }

  sendMessage(): void {
    console.log(this.sendMessageTextarea.nativeElement.value);
    var request = {
      recipientId: this.selectedDialog?.contact?.id,
      text: this.sendMessageTextarea.nativeElement.value,
    };
    this.messagesService
      .sendMessage(request)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              console.log('401 401 401');
            }
          },
        })
      )
      .subscribe((res) => {
        // console.log(res);
        if (res) {
          this.sendMessageTextarea.nativeElement.value = '';
          this.messagesList.push(res);
          this.separateMessagesByDate();
          this.selectedDialog!.lastMessage = res;
          this.orderDialogs();
        }
      });
  }
}
