import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { tap } from 'rxjs';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalWindowService } from 'src/app/core/services/modal-window.service';

@Component({
  selector: 'app-pro-login-window',
  templateUrl: './pro-login-window.component.html',
  styleUrls: ['./pro-login-window.component.css'],
})
export class ProLoginWindowComponent implements OnInit {
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

  constructor(
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    private agenciesService: AgenciesService,
    private modalWindowService: ModalWindowService
  ) {}

  ngOnInit(): void {
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
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          // Validators.pattern(
          //   '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          // ),
          Validators.minLength(8),
        ]),
        //mb confirm?
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
        if (res.token) {
          this.authService.setToken(res.token, 'pro');
          this.modalWindowService.close('pro-login-popup');
          console.log(true);
        } else {
          console.log(false);
        }
      });
  }

  submitRegister() {
    var registerInfo = {
      username: this.registerForm.get('email')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: 'Pro',
    };
    this.authService.register(registerInfo).subscribe((res) => {
      if (res.status === 'Success') {
        var createAgencyRequest = {
          name: this.registerForm.get('name')?.value,
          email: this.registerForm.get('email')?.value,
        };
        this.agenciesService
          .createAgency(createAgencyRequest)
          .subscribe((res) => {
            console.log(res);
          });
        this.isSuccessfulRegistration = true;
        this.authService
          .login({
            email: registerInfo.email,
            password: registerInfo.password,
          })
          .subscribe((res) => {
            this.authService.setToken(res.token, 'pro');
          });
        this.onTabChange('register-success');
        setTimeout(() => {
          this.modalWindowService.close('pro-login-popup');
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
          setTimeout(
            () => this.modalWindowService.close('pro-login-popup'),
            500
          );
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
