import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { Agency } from 'src/app/core/models/agency';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgencyDetailsComponent implements OnInit {
  private routeSub: Subscription;
  @ViewChild('messageBox') messageBox: ElementRef;
  agencyId: number;
  agency?: Agency;
  selectedTab: string = 'portfolio';
  rate: number = 0;
  reviewMessage: string;
  @ViewChild('tabs', { static: false }) swiper?: SwiperComponent;
  constructor(
    private agenciesService: AgenciesService,
    private route: ActivatedRoute,
    private modalWindowService: ModalWindowService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.agencyId = params['id'];
      this.loadAgencyInfo();
    });
  }

  ngAfterViewInit() {
    this.onScroll();
  }

  loadAgencyInfo() {
    this.agenciesService.getById(this.agencyId).subscribe((response) => {
      this.agency = response.data;
    });
  }

  onSaveClick(): void {
    var saveModel = {
      agencyId: this.agency?.id,
      unsave: this.agency?.isSaved,
    };
    this.agenciesService.toSave(saveModel).subscribe((res) => {
      this.agency!.isSaved = !this.agency!.isSaved;
    });
  }

  onTabClick(selectedTab: string) {
    if (this.selectedTab == selectedTab) {
      return;
    }
    this.selectedTab = '';
    setTimeout(() => {
      this.selectedTab = selectedTab;
    }, 100);
  }

  onStarClick(id: number) {
    this.rate = id;
  }

  onReviewSubmit(): void {
    if (this.rate === 0) {
      return;
    }
    var reviewModel = {
      agencyId: this.agencyId,
      message: this.reviewMessage,
      rate: this.rate,
    };
    this.agenciesService
      .sendReview(reviewModel)
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
        this.agency?.reviews?.unshift(res);
        this.rate = 0;
        this.reviewMessage = '';
      });
  }

  numSequence(n?: number): Array<number> {
    return Array(n);
  }

  openMessageWindow() {
    this.modalWindowService.open('message-window');
  }

  onScroll() {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > window.innerHeight * 0.8) {
        // console.log(this.messageBox); // add class show
        this.messageBox.nativeElement.classList.add('active');
      } else {
        this.messageBox.nativeElement.classList.remove('active');
      }
    });
  }

  hideMessageBox() {
    this.messageBox.nativeElement.classList.add('hide');
  }
}
