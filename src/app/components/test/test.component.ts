import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Mousewheel, Swiper } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// install Swiper modules
SwiperCore.use([Mousewheel, Navigation, Pagination]);

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  encapsulation: ViewEncapsulation.None, //???
})
export class TestComponent implements OnInit {
  popupActive = false;
  selectedRoom: string;

  @ViewChild('images', { static: false }) swiper?: SwiperComponent;
  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {}

  onSelectionIconClick(selectedRoom: string): void {
    if (this.selectedRoom == selectedRoom) {
      return;
    }
    // this.selectedRoom = selectedRoom;
    switch (selectedRoom) {
      case 'bath':
        this.swiper?.swiperRef.slideTo(1);
        break;
      case 'bed':
        this.swiper?.swiperRef.slideTo(2);
        break;
      case 'kitchen':
        this.swiper?.swiperRef.slideTo(3);
        break;
      case 'living':
        this.swiper?.swiperRef.slideTo(4);
        break;
    }
    // this.updateImage();
  }

  onSlideChange() {
    switch (this.swiper?.swiperRef.activeIndex) {
      case 0:
        this.selectedRoom = 'living';
        break;
      case 1:
        this.selectedRoom = 'bath';
        break;
      case 2:
        this.selectedRoom = 'bed';
        break;
      case 3:
        this.selectedRoom = 'kitchen';
        break;
      case 4:
        this.selectedRoom = 'living';
        break;
      case 5:
        this.selectedRoom = 'bath';
        break;
    }
    this.ref.detectChanges();
  }

  onPopupOpen() {
    this.popupActive = true;
  }

  onPopupClose(): void {
    this.popupActive = false;
  }
}
