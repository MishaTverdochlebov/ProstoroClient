import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessagesService } from 'src/app/core/services/messages.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import { LoginWindowComponent } from '../login-window/login-window.component';
import { ProLoginWindowComponent } from '../pro-login-window/pro-login-window.component';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.css'],
})
export class TopPanelComponent implements OnInit {
  @ViewChild(LoginWindowComponent) loginWindow: LoginWindowComponent;
  @ViewChild(ProLoginWindowComponent) proLoginWindow: ProLoginWindowComponent;
  @ViewChild('profileToggleButton') profileToggleButton: ElementRef;
  @ViewChild('profilePopup') profilePopup: ElementRef;
  @Input() isMainPage: boolean;
  @Input() onFooter: boolean;
  constructor(
    public authService: AuthService,
    private modalWindowService: ModalWindowService,
    private route: ActivatedRoute,
    private router: Router,
    public messagesService: MessagesService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.profileToggleButton?.nativeElement &&
        e.target !== this.profilePopup?.nativeElement
      ) {
        this.profilePopupActive = false;
      }
    });
  }
  navMenuActive = false;
  isProPage = false;
  profilePopupActive = false;
  profileInfo: any;

  ngOnInit(): void {
    this.route.url.subscribe((params) => {
      this.isProPage = params[0]?.path === 'pro';
    });
    if (this.authService.isLoggedIn) {
      this.messagesService.startConnection();
      this.messagesService.addMessageDataListener(() => {
        this.messagesService.updateUnreadCount();
      });
      this.loadProfileInfo();
    } else if (this.router.url.includes('/pro#signup')) {
      setTimeout(() => this.onProRegisterClick(), 100);
    }
    this.messagesService.updateUnreadCount();

    // setTimeout(() => {
    //   this.onProRegisterClick();
    // }, 100);
  }
  onBurgerClick(): void {
    this.navMenuActive = !this.navMenuActive;
  }

  onLoginClick(): void {
    this.loginWindow.onTabChange('login');
    this.modalWindowService.open('login-popup');
  }

  onRegisterClick(): void {
    this.loginWindow.onTabChange('register-email');
    this.modalWindowService.open('login-popup');
  }

  onProLoginClick(): void {
    this.proLoginWindow.onTabChange('login');
    this.modalWindowService.open('pro-login-popup');
  }

  onProRegisterClick(): void {
    this.proLoginWindow.onTabChange('register-email');
    this.modalWindowService.open('pro-login-popup');
  }

  onLogoutClick(): void {
    this.authService.doLogout();
  }

  loadProfileInfo() {
    this.authService.getProfileInfo().subscribe((res) => {
      this.profileInfo = res.data;
    })
  }
}
