import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Agency } from 'src/app/core/models/agency';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-profile-settings-page',
  templateUrl: './profile-settings-page.component.html',
  styleUrls: ['./profile-settings-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileSettingsPageComponent implements OnInit {
  agencyForm!: FormGroup;
  agency?: Agency;
  constructor(private agenciesService: AgenciesService) {}

  ngOnInit(): void {
    this.loadAgencyInfo();
    this.agencyForm = new FormGroup({
      agencyName: new FormControl('', [Validators.required]),
      contactName: new FormControl('', [Validators.required]),
      contactLastname: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewInit(): void {
    this.scrollSpy();
  }

  loadAgencyInfo() {
    this.agenciesService.getById(1).subscribe((response) => {
      this.agency = response.data;
      // this.swiper?.swiperRef.updateAutoHeight();
    });
  }

  submitSave(): void {
    console.log('qweqwe');
  }

  scrollSpy(): void {
    const navLinks = document.querySelectorAll('#agency-edit-navbar a');

    navLinks.forEach((link: Element) => {
      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const yOffset = window.innerWidth * 0.13
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        const targetElement = document.querySelector(targetId!);
        const y = targetElement!.getBoundingClientRect().top + window.pageYOffset - yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
      });
    });

    window.addEventListener('scroll', () => {
      // const scrollPos = window.scrollY;
      const yOffset = window.innerWidth * 0.2
      navLinks.forEach((link: Element) => {
        const refElement = document.querySelector(link.getAttribute("href")!);
        const elY = refElement!.getBoundingClientRect().top;
        const elHeight = refElement!.getBoundingClientRect().height;
        if (elY <= yOffset * 1.035 && elY + elHeight >= yOffset * 0.965) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  }
}
