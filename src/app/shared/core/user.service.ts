import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '../utils/HttpClient';
import { AuthService } from './auth.service';

import { environment } from './../../../environments/environment.prod';
import { ResponseContentType } from '@angular/http';
import { saveAs } from 'file-saver/FileSaver';

@Injectable()
export class UserService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getUser() {
        return this.http.get(
            `${environment.apiUrl}users/` +
                this.authService.getUserInfo().userId
        );
    }

    getUserById(userId) {
        return this.http.get(
            `${environment.apiUrl}users/` + userId
        );
    }

    updateAttributes(data) {
        return this.http.put(
            `${environment.apiUrl}users/${
                this.authService.getUserInfo().userId
            }/attributes`,
            data
        );
    }

    createSourse(data) {
        data.id = this.authService.getUserInfo().id;
        data.userId = this.authService.getUserInfo().userId;
        return this.http.post(
            `${environment.apiUrl}users/${
                this.authService.getUserInfo().userId
            }/sources`,
            data
        );
    }

    createSourceByForm(data, picture: File) {

        const formData: FormData = new FormData();
        formData.append('Picture', picture, 'file.jpg');

        // tslint:disable-next-line:max-line-length
        return this.http.post(
            `${environment.apiUrl}users/${
                this.authService.getUserInfo().userId
            }/sources/${data.sourceType}/form`,
            formData
        );
    }

    getSourse(id) {
        return this.http
            .download(`${environment.apiUrl}sources/${id}`)
            .then(data => {
                const blob = new Blob([data['_body']], { type: 'image/jpg' });
                saveAs(blob, `${id}.jpg`);
            })
            .catch(err => {
                console.log(err);
            });
    }

    getSourseBlob(id) {
        return this.http
            .download(`${environment.apiUrl}sources/${id}`);
    }

    getReferrers() {
        return this.http.get(`${environment.apiUrl}users/` + this.authService.getUserInfo().userId + `/referrers`);
    }

    getStaticData() {
        return this.http.get(`../../../assets/data/referrers.json`);
    }

    getUsers(skip, take) {
        return this.http.get(
            `${environment.apiUrl}users/?skip=${skip}&take=${take}`
        );
    }

    validate(code) {
        return this.http.put(
            `${environment.apiUrl}users/${this.authService.getUserInfo().userId}/attributes/${code}/validate`,
            null
        );
    }

    reject(code) {
        return this.http.put(
            `${environment.apiUrl}users/${this.authService.getUserInfo().userId}/attributes/${code}/reject`,
            null
        );
    }
}
