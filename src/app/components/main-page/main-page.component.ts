import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import SwiperCore, { Navigation, Pagination, Mousewheel } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation, Pagination, Mousewheel]);

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: [
    './main-page.styles/main-page-desktop.css',
    './main-page.styles/main-page-phone.css',
  ],
  encapsulation: ViewEncapsulation.None, //???
})
export class MainPageComponent implements OnInit {
  public innerWidth: any;
  navMenuActive = false;
  selectedRoom = 'bed';
  selectedStyle = 'victorian';
  imgBasePath = 'assets\\images\\ideas-selection\\'; //???
  scrollOnFooter: boolean;
  @ViewChild('images', { static: false }) imagesSwiper?: SwiperComponent;
  @ViewChild('pageSwiper', { static: false }) pageSwiper?: SwiperComponent;
  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  onBurgerClick(): void {
    this.navMenuActive = !this.navMenuActive;
  }

  onPageSlideChange(): void {
    console.log(this.pageSwiper?.swiperRef?.activeIndex);
    if (this.innerWidth > 768) {
      switch (this.pageSwiper?.swiperRef?.activeIndex) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
          this.scrollOnFooter = false;
          break;
        case 5:
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

  onSelectionIconClick(selectedRoom: string): void {
    if (this.selectedRoom == selectedRoom) {
      return;
    }
    if (this.innerWidth > 768) {
      switch (selectedRoom) {
        case 'bed':
          this.imagesSwiper?.swiperRef.slideTo(1);
          break;
        case 'kitchen':
          this.imagesSwiper?.swiperRef.slideTo(2);
          break;
        case 'bath':
          this.imagesSwiper?.swiperRef.slideTo(3);
          break;
        case 'living':
          this.imagesSwiper?.swiperRef.slideTo(4);
          break;
      }
    } else {
      switch (selectedRoom) {
        case 'bed':
          this.imagesSwiper?.swiperRef.slideTo(2);
          break;
        case 'kitchen':
          this.imagesSwiper?.swiperRef.slideTo(3);
          break;
        case 'bath':
          this.imagesSwiper?.swiperRef.slideTo(4);
          break;
        case 'living':
          this.imagesSwiper?.swiperRef.slideTo(5);
          break;
      }
    }
  }

  onImagesSlideChange(): void {
    if (this.innerWidth > 768) {
      switch (this.imagesSwiper?.swiperRef?.activeIndex) {
        case 0:
          this.selectedRoom = 'living';
          break;
        case 1:
          this.selectedRoom = 'bed';
          break;
        case 2:
          this.selectedRoom = 'kitchen';
          break;
        case 3:
          this.selectedRoom = 'bath';
          break;
        case 4:
          this.selectedRoom = 'living';
          break;
        case 5:
          this.selectedRoom = 'bed';
          break;
        case 6:
          this.selectedRoom = 'kitchen';
          break;
      }
    } else {
      switch (this.imagesSwiper?.swiperRef?.activeIndex) {
        case 0:
          this.selectedRoom = 'bath';
          break;
        case 1:
          this.selectedRoom = 'living';
          break;
        case 2:
          this.selectedRoom = 'bed';
          break;
        case 3:
          this.selectedRoom = 'kitchen';
          break;
        case 4:
          this.selectedRoom = 'bath';
          break;
        case 5:
          this.selectedRoom = 'living';
          break;
        case 6:
          this.selectedRoom = 'bed';
          break;
      }
    }

    this.ref.detectChanges();
  }

  onSelectionStyleClick(selectedStyle: string): void {
    this.selectedStyle = selectedStyle;
    this.ref.detectChanges();
    // this.updateImage();
  }
}
