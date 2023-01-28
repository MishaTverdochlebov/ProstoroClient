import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { Agency } from 'src/app/core/models/agency';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.css'],
})
export class MessagePopupComponent implements OnInit {
  messageForm!: FormGroup;
  @Input() recipientId?: number;
  @Input() recipientImgUrl?: string;
  @Input() recipientName?: string;

  constructor(private messagesService: MessagesService, private modalWindowService:ModalWindowService) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  sendMessage() {
    var request = {
      recipientId: this.recipientId,
      text: this.messageForm.get('message')?.value,
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
        //this.modalWindowService.close(this.complaintPopupId);
        this.modalWindowService.close('message-window');
      });
  }
}
