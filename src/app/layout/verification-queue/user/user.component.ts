import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from './../../../shared/core/user.service';
import { LoaderService } from './../../../shared/core/loader.service';
import { HttpClient } from './../../../shared/utils/HttpClient';

import * as _ from 'lodash';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [UserService, HttpClient]
})
export class UserComponent implements OnInit {

    private id: number;
    user: any;
    attributeTypes: any;

    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute, private userService: UserService, private loaderService: LoaderService) {
        this.routeSubscription = route.params.subscribe(params => this.id = params['id']);
        this.attributeTypes = AttributeTypes;
    }

    ngOnInit() {
        this.getUser();
        this.getSourse();
    }

    getUser() {
        this.loaderService.display(true);
        this.userService.getUserById(this.id)
            .then(data => {
                this.loaderService.display(false);
                this.user = JSON.parse(data['_body']);
                console.log(this.user);
            })
            .catch(err => {
                this.loaderService.display(false);
                console.log(err);
            });
    }

    getSourse() {
        this.userService.getSourseBlob('44038984-09b1-49cb-aba2-c58c5778b088')
        .then(data => {
            const blob = new Blob([data['_body']], { type: 'image/jpg' });
            this.blobToBase64(blob);
        })
        .catch(err => {
            console.log(err);
        });
    }

    private blobToBase64(blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            const base64data = reader.result;
        };
    }

    getAttribute(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, {code: type}).value;
        }
        return '';
    }
}

enum AttributeTypes {
    Email = '1050',
    FirstName = '1001',
    Surname = '1002',
    MiddleName = '1003',
    Gender = '1060',
    BirthDate = '1010',
    CountryCode = '1021',
    Zip = '1031',
    State = '1032',
    City = '1033',
    Street = '1034',
    House = '1035',
    Flat = '1036',
    PassportType = '1041',
    PassportNumber = '1042',
    PassportIssueDate = '1043',
    PassportExpirationDate = '1044',
    PassportPhoto = '1070',
    AddressPhoto = '1071',
    UserPhoto = '1072'
}
