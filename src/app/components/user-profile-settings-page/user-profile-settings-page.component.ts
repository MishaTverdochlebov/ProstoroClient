import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { City } from 'src/app/core/models/city';
import { ImageSnippet } from 'src/app/core/models/response';
import { AuthService } from 'src/app/core/services/auth.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { cityOptions } from 'src/app/test-data/cities-data';
@Component({
  selector: 'app-user-profile-settings-page',
  templateUrl: './user-profile-settings-page.component.html',
  styleUrls: ['./user-profile-settings-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileSettingsPageComponent implements OnInit {
  profileForm!: FormGroup;
  formChanged = false;
  selectedFile: ImageSnippet;
  profile: any;
  cityOptions = cityOptions;
  filteredCities: City[] = [];
  selectedCity?: City;

  constructor(
    private imagesService: ImagesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfileInfo();
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      imgUrl: new FormControl(''),
      notificationsEmail: new FormControl(true),
      notificationsDesktop: new FormControl(true),
      notificationsDirectMessages: new FormControl(true),
      notificationsSpecials: new FormControl(true),
      notificationsUpdates: new FormControl(true),
      notificationsActivity: new FormControl(true),
    });
  }

  initForm(): void {
    this.profileForm.controls['name'].setValue(this.profile?.name);
    this.profileForm.controls['lastname'].setValue(this.profile?.lastname);
    this.profileForm.controls['email'].setValue(this.profile?.email);
    this.profileForm.controls['phone'].setValue(this.profile?.phone);
    this.profileForm.controls['imgUrl'].setValue(this.profile?.imgUrl);
    this.profileForm.controls['notificationsEmail'].setValue(this.profile?.notificationSettings.email);
    this.profileForm.controls['notificationsDesktop'].setValue(this.profile?.notificationSettings.desktop);
    this.profileForm.controls['notificationsDirectMessages'].setValue(this.profile?.notificationSettings.directMessages);
    this.profileForm.controls['notificationsSpecials'].setValue(this.profile?.notificationSettings.specials);
    this.profileForm.controls['notificationsUpdates'].setValue(this.profile?.notificationSettings.updates);
    this.profileForm.controls['notificationsActivity'].setValue(this.profile?.notificationSettings.activity);
  }

  ngAfterViewInit(): void {
    this.scrollSpy();
  }

  submitSave(): void {
    this.formChanged = false;
    var formValue = this.profileForm.value;
    var request = {
      name: formValue.name,
      lastname: formValue.lastname,
      email: formValue.email,
      phone: formValue.phone,
      notificationSettings: {
        email: formValue.notificationsEmail,
        desktop: formValue.notificationsDesktop,
        directMessages: formValue.notificationsDirectMessages,
        specials: formValue.notificationsSpecials,
        updates: formValue.notificationsUpdates,
        activity: formValue.notificationsActivity
      },
      imgUrl: formValue.imgUrl,
    };
    this.authService
      .updateProfile(request)
      .subscribe((res) => {
        this.router.navigateByUrl('/profile');
      });
  }

  loadProfileInfo() {
    this.authService.getProfileDetails().subscribe((res) => {
      this.profile = res.data;
      this.initForm();
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
        .subscribe((res) => {
          this.profileForm.controls['imgUrl'].setValue(res.data);
          this.profile!.imgUrl = res.data;
        });
    });

    reader.readAsDataURL(file);
  }
  
  deleteAccount() {
    this.authService.deleteAccount().subscribe((res) => {
      this.authService.doLogout();
      this.router.navigateByUrl('');
    }) 
  }
}
