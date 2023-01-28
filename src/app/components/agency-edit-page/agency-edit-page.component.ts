import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Agency } from 'src/app/core/models/agency';
import { City } from 'src/app/core/models/city';
import { ImageSnippet } from 'src/app/core/models/response';
import { Tag } from 'src/app/core/models/tag';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { cityOptions } from 'src/app/test-data/cities-data';
import { tagOptions } from 'src/app/test-data/tags-data';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-agency-edit-page',
  templateUrl: './agency-edit-page.component.html',
  styleUrls: ['./agency-edit-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AgencyEditPageComponent implements OnInit {
  agencyForm!: FormGroup;
  formChanged = false;
  agency?: Agency;
  selectedFile: ImageSnippet;
  tagOptions = tagOptions;
  filteredStyleTags: Tag[] = [];
  selectedStyleTags: Tag[] = [];
  cityOptions = cityOptions;
  filteredCities: City[] = [];
  selectedCity?: City;
  constructor(
    private agenciesService: AgenciesService,
    private imagesService: ImagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAgencyInfo();
    this.agencyForm = new FormGroup({
      agencyName: new FormControl('', [Validators.required]),
      contactName: new FormControl(''),
      contactLastname: new FormControl(''),
      phoneNumber: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      about: new FormControl(''),
      description: new FormControl(''),
      remote: new FormControl(''),
      onSite: new FormControl(''),
      budget: new FormControl(''),
      logoImgUrl: new FormControl(''),
      tag: new FormControl(''),
    });
  }

  initForm(): void {
    this.agencyForm.controls['agencyName'].setValue(this.agency?.name);
    this.agencyForm.controls['contactName'].setValue(
      this.agency?.contactFirstName
    );
    this.agencyForm.controls['contactLastname'].setValue(
      this.agency?.contactLastName
    );
    this.agencyForm.controls['phoneNumber'].setValue(this.agency?.phoneNumber);
    this.agencyForm.controls['email'].setValue(this.agency?.email);
    this.agencyForm.controls['city'].setValue(this.agency?.city?.ua);
    this.selectedCity = this.cityOptions.find(
      (city) => city.value == this.agency?.city?.value
    );
    this.agencyForm.controls['about'].setValue(this.agency?.about);
    this.agencyForm.controls['description'].setValue(this.agency?.description);
    this.agencyForm.controls['remote'].setValue(this.agency?.remoteAvailable);
    this.agencyForm.controls['onSite'].setValue(this.agency?.onSiteAvailable);
    this.agencyForm.controls['budget'].setValue(this.agency?.budget);
    this.agencyForm.controls['logoImgUrl'].setValue(this.agency?.logoImgUrl);
  }

  ngAfterViewInit(): void {
    this.scrollSpy();
  }

  loadAgencyInfo() {
    this.agenciesService.getProfile().subscribe((response) => {
      this.agency = response.data;
      if (response.data?.tags) {
        this.selectedStyleTags = response.data.tags;
      }
      this.initForm();
    });
  }

  submitSave(): void {
    this.formChanged = false;
    console.log(this.agencyForm.value);
    var formValue = this.agencyForm.value;
    var request = {
      name: formValue.agencyName,
      contactFirstname: formValue.contactName,
      contactLastname: formValue.contactLastname,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      city: this.selectedCity,
      about: formValue.about,
      description: formValue.description,
      remoteAvailable: formValue.remote,
      OnSiteAvailable: formValue.onSite,
      budget: formValue.budget,
      logoImgUrl: formValue.logoImgUrl,
      tags: this.selectedStyleTags,
    };
    this.agenciesService
      .updateAgency(request, this.agency?.id!)
      .subscribe((res) => {
        this.router.navigateByUrl('/pro/agency');
      });
  }

  scrollSpy(): void {
    const navLinks = document.querySelectorAll('#agency-edit-navbar a');

    navLinks.forEach((link: Element) => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const yOffset = window.innerWidth * 0.13;
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        const targetElement = document.querySelector(targetId!);
        const y =
          targetElement!.getBoundingClientRect().top +
          window.pageYOffset -
          yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    window.addEventListener('scroll', () => {
      // const scrollPos = window.scrollY;
      const yOffset = window.innerWidth * 0.2;
      navLinks.forEach((link: Element) => {
        const refElement = document.querySelector(link.getAttribute('href')!);
        const elY = refElement!.getBoundingClientRect().top;
        const elHeight = refElement!.getBoundingClientRect().height;
        if (elY <= yOffset * 1.035 && elY + elHeight >= yOffset * 0.965) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
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
          this.agencyForm.controls['logoImgUrl'].setValue(res.data);
          this.agency!.logoImgUrl = res.data;
          //https://res.cloudinary.com/interiorhub/image/upload/v1673381200/yjtxlwocpbath2xfjyfx.jpg
        });
    });

    reader.readAsDataURL(file);
  }

  filterTags(tagType: string) {
    let filteredTags = this.tagOptions.filter(
      (item) =>
        item.type === tagType &&
        item.value
          .toLowerCase()
          .includes(this.agencyForm.get('tag')?.value.toLowerCase()) &&
        !this.isAddedTag(item)
    );
    this.filteredStyleTags = filteredTags.slice(0, 3);
  }
  isAddedTag(tag: Tag): boolean {
    return !!this.selectedStyleTags.find((t) => t.value === tag.value);
  }

  addTag(tag: Tag) {
    if (this.selectedStyleTags.length < 10) {
      this.selectedStyleTags.push(tag);
      this.agencyForm.controls['tag'].setValue('');
      this.filterTags(tag.type);
      this.formChanged = true;
    }
  }

  removeTag(tag: Tag) {
    const index = this.selectedStyleTags.indexOf(tag, 0);
    if (index > -1) {
      this.selectedStyleTags.splice(index, 1);
    }
    this.filterTags(tag.type);
  }

  filterCities() {
    let filteredCities = this.cityOptions.filter((city) =>
      city.ua
        .toLowerCase()
        .includes(this.agencyForm.get('city')?.value.toLowerCase())
    );
    this.filteredCities = filteredCities.slice(0, 3);
  }

  selectCity(city: City) {
    this.formChanged = true;
    this.selectedCity = city;
    this.agencyForm.controls['city'].setValue(this.selectedCity.ua);
  }
}
