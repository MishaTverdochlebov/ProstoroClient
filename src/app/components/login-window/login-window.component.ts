import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrls: ['./login-window.component.css'],
})
export class LoginWindowComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  authTab: string;
  authContentAppear: string;
  isIncorrectLoginOrPassword = false;
  isSuccessfulRegistration = false;
  loginPasswordShow = false;
  registerPasswordShow = false;
  registerWarning = '';
  confirmationCode = '';
  confirmationCodeWarning = '';
  passwordRecoveryWarning = '';
  client_id = environment.client_id;

  constructor(
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    private modalWindowService: ModalWindowService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.modalWindowService.open('login-popup');
    //   this.authTab = 'forgot-password-success';
    //   setTimeout(() => {
    //     this.authContentAppear = 'forgot-password-success';
    //     this.ref.detectChanges();
    //   }, 10);
    // }, 10);
    if (!this.authService.isLoggedIn) {
      this.activateGoogleOneTap();
    }
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern(
        //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        // ),
        Validators.minLength(8),
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
      ]),
    });
    this.registerForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          // Validators.pattern(
          //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          // ),
          Validators.minLength(8),
        ]),
        passwordRepeat: new FormControl('', [
          Validators.required,
          // Validators.pattern(
          //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          // ),
          Validators.minLength(8),
        ]),
      },
      { validators: this.checkPasswordsRegister }
    );
    this.forgotPasswordForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        passwordRepeat: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      { validators: this.checkPasswordsRecover }
    );
  }

  activateGoogleOneTap() {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.client_id,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('googleLoginBtn'),
        {
          theme: 'filled_blue',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'circle',
        }
      );
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('googleSignupBtn'),
        {
          theme: 'filled_blue',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'circle',
        }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  handleCredentialResponse(response: CredentialResponse) {
    this.authService
      .loginWithGoogle(response.credential)
      .subscribe((res: any) => {
        this.authService.setToken(res.token, 'user');
        this.modalWindowService.close('login-popup');
        window.location.reload();
      });
  }

  checkPasswordsRegister: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    var pass = this.registerForm?.get('password')?.value;
    var confirmPass = this.registerForm?.get('passwordRepeat')?.value;

    return pass === confirmPass ? null : { notSame: true };
  };

  checkPasswordsRecover: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    var pass = this.forgotPasswordForm?.get('password')?.value;
    var confirmPass = this.forgotPasswordForm?.get('passwordRepeat')?.value;

    return pass === confirmPass ? null : { notSame: true };
  };

  onTabChange(authTab: string) {
    if (authTab == 'register-email-confirm') {
      this.confirmationCode = '';
      var email = this.registerForm.get('email')?.value;
      this.authService.checkEmailExistence(email).subscribe((res) => {
        if (res.data.alreadyRegistered) {
          this.registerWarning =
            'Account with this email is already registered';
          return;
        } else {
          this.confirmationCode = res.data.confirmationCode;
          this.authTab = authTab;
          setTimeout(() => {
            this.authContentAppear = authTab;
            this.ref.detectChanges();
          }, 10);
        }
      });
    } else if (authTab == 'forgot-password-confirm') {
      this.confirmationCode = '';
      var email = this.forgotPasswordForm.get('email')?.value;
      this.authService.confirmPasswordRecovery(email).subscribe((res) => {
        if (!res.data.isRegistered) {
          this.registerWarning = 'Account with this email does not exist';
          return;
        } else {
          this.confirmationCode = res.data.confirmationCode;
          this.authTab = authTab;
          setTimeout(() => {
            this.authContentAppear = authTab;
            this.ref.detectChanges();
          }, 10);
        }
      });
    } else {
      this.authTab = authTab;
      setTimeout(() => {
        this.authContentAppear = authTab;
        this.ref.detectChanges();
      }, 10);
    }
  }

  checkConfirmCode(event: any, tab: string) {
    if (this.confirmationCode == event) {
      this.onTabChange(tab);
      this.confirmationCode = '';
    } else {
      this.confirmationCodeWarning = 'confirmCodeWarning';
    }
  }

  submitLogin() {
    var loginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService
      .login(loginRequest)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.isIncorrectLoginOrPassword = true;
            }
          },
        })
      )
      .subscribe((res) => {
        this.authService.setToken(res.token, 'user');
        this.modalWindowService.close('login-popup');
      });
  }

  submitRegister() {
    console.log(this.registerForm.value);
    var registerInfo = {
      username: this.registerForm.get('email')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: 'User',
    };
    this.authService.register(registerInfo).subscribe((res) => {
      if (res.status === 'Success') {
        this.isSuccessfulRegistration = true;
        var loginInfo = {
          email: registerInfo.email,
          password: registerInfo.password,
        };
        this.authService.login(loginInfo).subscribe((res) => {
          this.authService.setToken(res.token, 'user');
          this.modalWindowService.close('login-popup');
        });
        this.onTabChange('register-success');
        setTimeout(() => {
          this.modalWindowService.close('login-popup');
        }, 500);
      }
    });
  }

  submitChangePassword() {
    var request = {
      email: this.forgotPasswordForm.value.email,
      password: this.forgotPasswordForm.value.password,
    };
    this.authService
      .changePassword(request)
      .pipe(
        tap({
          next: () => {},
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.isIncorrectLoginOrPassword = true;
            }
          },
        })
      )
      .subscribe((res) => {
        if (res.status == 'Success') {
          this.onTabChange('forgot-password-success');
          setTimeout(() => this.modalWindowService.close('login-popup'), 500);
        } else {
          //...
        }
      });
  }

  loginPasswordEyeToggle() {
    this.loginPasswordShow = !this.loginPasswordShow;
  }

  registerPasswordEyeToggle() {
    this.registerPasswordShow = !this.registerPasswordShow;
  }
}
