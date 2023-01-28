import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SwiperComponent } from 'swiper/angular';
import { TopPanelComponent } from '../top-panel/top-panel.component';

@Component({
  selector: 'app-pro-main-page',
  templateUrl: './pro-main-page.component.html',
  styleUrls: ['./pro-main-page.styles/pro-main-page-desktop.css'],
})
export class ProMainPageComponent implements OnInit {
  public innerWidth: any;
  scrollOnFooter: boolean;
  @ViewChild('pageSwiper', { static: false }) pageSwiper?: SwiperComponent;
  @ViewChild(TopPanelComponent) topPanel: TopPanelComponent;
  constructor(private ref: ChangeDetectorRef, public authService: AuthService) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  onPageSlideChange(): void {
    console.log(this.pageSwiper?.swiperRef?.activeIndex);
    if (this.innerWidth > 768) {
      switch (this.pageSwiper?.swiperRef?.activeIndex) {
        case 0:
          // case 1:
          // case 2:
          // case 3:
          // case 4:
          this.scrollOnFooter = false;
          break;
        case 1:
          this.scrollOnFooter = true;
          break;
      }
    } else {
      switch (
        this.pageSwiper?.swiperRef?.activeIndex
        // case 0:
        //   this.selectedRoom = 'bath';
        //   break;
      ) {
      }
    }
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);
  }

  onLogin() {
    this.topPanel.onProLoginClick();
  }
}
