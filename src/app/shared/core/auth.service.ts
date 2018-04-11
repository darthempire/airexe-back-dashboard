import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';

import { environment } from './../../../environments/environment.prod';

import * as sha256 from 'sha256';

@Injectable()
export class AuthService {
    constructor(private http: Http, private router: Router) {}

    saveUserInfo(value) {
        localStorage.setItem('user-info', JSON.stringify(value));
    }

    getUserInfo() {
        return JSON.parse(localStorage.getItem('user-info'));
    }

    get token() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.token : '';
    }

    get user() {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.user : null;
    }

    isLogged() {
        const userInfo = this.getUserInfo();
        return !!userInfo;
    }

    isAdmin() {
        return !!this.user.isAdmin;
    }

    navigateToRegistration() {
        this.router.navigate(['/registration']);
    }

    navigateToUserRoot() {
        this.router.navigate(['/']);
    }

    navigateToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    logout() {
        localStorage.removeItem('user-info');
        this.navigateToRegistration();
    }

    login(loginInputData) {
        const loginData = {
            credentialsType: 'password',
            login: loginInputData.email,
            password: sha256(loginInputData.password)
        };

        return new Promise((resolve, reject) => {
            this.http
                .put(`${environment.apiUrl}credentials/signin`, loginData)
                .map(res => res)
                // tslint:disable-next-line:no-shadowed-variable
                .subscribe(
                    data => {
                        console.log(data);
                        this.saveUserInfo(JSON.parse(data['_body']));
                        resolve(data);
                    },
                    err => {
                        reject(err);
                    }
                );
        });
    }
}
