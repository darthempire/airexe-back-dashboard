import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AuthService } from '../shared/core/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { LoaderService } from './../shared/core/loader.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
    referalId: any;
    confirm: any;
    isConfirm = false;
    isErrorConfirm = true;
    allowRegistration = false;

    loginData = new LoginData('', '', false, false);
    registrationData = new LoginData('', '', false, false);

    isRegistrationSuccess = false;
    isRegistrationFailed = false;
    isLoginFailed = false;
    errorMessage = '';
    passwordStrength = '';

    @ViewChild('pass1') pass1: ElementRef;
    @ViewChild('pass2') pass2: ElementRef;

    // tslint:disable-next-line:max-line-length
    constructor(
        private loaderService: LoaderService,
        private authService: AuthService,
        private route: ActivatedRoute,
        public router: Router
    ) {}

    ngOnInit() {
    }

    onLogging() {
        this.loaderService.display(true);
        this.clear();

        if (!this.validateEmail(this.loginData.email)) {
            this.errorMessage = 'Email is invalid!';
            this.isLoginFailed = true;
            this.loaderService.display(false);
        } else if (
            this.loginData.password.length === 0 ||
            this.loginData.email.length === 0
        ) {
            this.errorMessage = 'Email or password can`t be empty!';
            this.isLoginFailed = true;
            this.loaderService.display(false);
        } else if (this.loginData.password.length === 0) {
            this.errorMessage = 'Password should be more than 8 characters!';
            this.isLoginFailed = true;
            this.loaderService.display(false);
        } else {
            this.authService
                .login(this.loginData)
                .then(data => {
                    this.router.navigate(['/dashboard']);
                    this.loaderService.display(false);
                })
                .catch(err => {
                    this.errorMessage = 'Email or password is incorrect!';
                    this.isLoginFailed = true;
                    this.loaderService.display(false);
                });
        }
    }

    validatePassword() {
        const strongRegex = new RegExp(
            '^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$',
            'g'
        );
        const mediumRegex = new RegExp(
            '^(?=.{9,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
            'g'
        );
        const enoughRegex = new RegExp('(?=.{8,}).*', 'g');
        const pwd = this.registrationData.password;
        if (false === enoughRegex.test(pwd)) {
            this.allowRegistration = false;
            this.passwordStrength =
                'Password too week. Please make stronger password, minimum 8 characters';
        } else if (strongRegex.test(pwd)) {
            this.passwordStrength = 'Strong!';
            this.allowRegistration = true;
        } else if (mediumRegex.test(pwd)) {
            this.passwordStrength = 'Medium!';
            this.allowRegistration = true;
        } else {
            this.allowRegistration = false;
            this.passwordStrength =
                'Password too week. Please make stronger password, minimum 8 characters';
        }
    }

    clear() {
        this.isRegistrationSuccess = false;
        this.isRegistrationFailed = false;
        this.errorMessage = '';
        this.passwordStrength = '';
        this.isLoginFailed = false;
        this.isConfirm = false;
    }

    validateEmail(email) {
        // tslint:disable-next-line:max-line-length
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    showPassword() {
        this.pass1.nativeElement.setAttribute('type', 'text');
        this.pass2.nativeElement.setAttribute('type', 'text');
    }

    hidePassword() {
        this.pass1.nativeElement.setAttribute('type', 'password');
        this.pass2.nativeElement.setAttribute('type', 'password');
    }
}

class LoginData {
    constructor(
        public email: string,
        public password: string,
        public getEmails: boolean,
        public terms: boolean
    ) {}

    isValid() {
        return true;
    }
}
