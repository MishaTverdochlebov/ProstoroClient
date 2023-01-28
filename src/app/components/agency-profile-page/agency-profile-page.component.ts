import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { tap } from 'rxjs';
import { Agency } from 'src/app/core/models/agency';
import { ImageSnippet } from 'src/app/core/models/response';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-agency-profile-page',
  templateUrl: './agency-profile-page.component.html',
  styleUrls: ['./agency-profile-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgencyProfilePageComponent implements OnInit {
  agency?: Agency;
  selectedTab: string = 'portfolio';
  selectedFile: ImageSnippet;
  @ViewChild('tabs', { static: false }) swiper?: SwiperComponent;
  constructor(
    private agenciesService: AgenciesService,
    private imagesService: ImagesService,
    private modalWindowService: ModalWindowService
  ) {}

  ngOnInit(): void {
    this.loadAgencyInfo();
    // setTimeout(() => {
    //   this.openWarningWindow();
    // }, 100);
  }

  loadAgencyInfo() {
    this.agenciesService.getProfile().subscribe((response) => {
      this.agency = response.data;
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

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.imagesService
        .uploadImage(this.selectedFile.file)
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
          this.agency!.headerImgUrl = res.data;
          this.agenciesService
            .updateAgency({ headerImgUrl: res.data }, this.agency?.id!)
            .subscribe((res) => {
              console.log(res);
            });
          //https://res.cloudinary.com/interiorhub/image/upload/v1673381200/yjtxlwocpbath2xfjyfx.jpg
        });
    });

    reader.readAsDataURL(file);
  }

  openWarningWindow() {
    this.modalWindowService.open('finish-edit-popup');
  }

  publishAgency() {
    this.agenciesService
      .updateAgency({ isAvailable: true }, this.agency?.id!)
      .subscribe((res) => {
        //console.log(res);
        this.agency!.isAvailable = true;
      });
  }

  get showFinishEditWarning(): boolean {
    if (!this.agency) {
      return false;
    }
    return !this.agency?.isAvailable;
  }

  get isReadyToPublish(): boolean {
    return (
      !!this.agency?.city &&
      !!this.agency?.logoImgUrl &&
      !!this.agency?.about &&
      !!this.agency?.description &&
      !!this.agency?.tags &&
      this.agency?.tags?.length > 0 &&
      !!this.agency?.projects &&
      this.agency?.projects.length > 0
    );
  }
}
