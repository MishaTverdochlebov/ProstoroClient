import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { Review } from 'src/app/core/models/agency';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css'],
})
export class ReviewCardComponent implements OnInit {
  @Input() review: Review;
  timeAgo: string;
  complaintPopupId: string;
  complaintForm!: FormGroup;
  constructor(private modalWindowService: ModalWindowService, private agenciesService:AgenciesService) {}

  ngOnInit(): void {
    this.complaintForm = new FormGroup({
      reason: new FormControl('spam', [Validators.required]),
      message: new FormControl('', [Validators.required])
    });
    this.complaintPopupId = 'complaint-popup-' + this.review.id;
    this.getTimeAgo();

    // if(this.review.id === 1) {
    //   setTimeout(() => 
    //   {
    //     this.openComplaintWindow();
    //   }, 200)
    // }
  }

  numSequence(n?: number): Array<number> {
    return Array(n);
  }

  getTimeAgo(): void {
    var ms = new Date().getTime() - new Date(this.review.createdOn).getTime();
    var daysAgo = this.msToDays(ms);
    if (daysAgo < 1) {
      this.timeAgo = 'today';
    } else if (daysAgo < 2) {
      this.timeAgo = 'yesterday';
    } else if (daysAgo < 30.5) {
      this.timeAgo = Math.round(daysAgo) + ' days ago';
    } else {
      this.timeAgo = Math.round(daysAgo / 30.5) + ' month ago';
    }
  }

  msToDays(duration: number): number {
    return duration / (1000 * 60 * 60 * 24);
  }

  openComplaintWindow() {
    this.modalWindowService.open(this.complaintPopupId);
  }

  sendComplaint() {
    var complaintRequest = {
      reviewId: this.review.id,
      complaintReason: this.complaintForm.get("reason")?.value,
      message: this.complaintForm.get("message")?.value
    }

    this.agenciesService.sendComplaint(complaintRequest)
    .pipe(
      tap({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            // console.log("401 401 401");
          }
        },
      })
    )
    .subscribe((res) => {
      this.modalWindowService.close(this.complaintPopupId);
    });;
  }
}
