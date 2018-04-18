import { Component, OnInit, NgModule, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from './../../../shared/core/user.service';
import { LoaderService } from './../../../shared/core/loader.service';
import { HttpClient } from './../../../shared/utils/HttpClient';

import * as _ from 'lodash';
import { NgModel, FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [UserService, HttpClient, NgModel]
})
export class UserComponent implements OnInit {
    surname: string;
    private id: number;
    user: any;
    attributeTypes: any;

    passportPhoto: any;
    addressPhoto: any;
    userPhoto: any;

    private routeSubscription: Subscription;

    form: FormGroup;

    constructor(private route: ActivatedRoute, private userService: UserService, private loaderService: LoaderService) {
        this.routeSubscription = route.params.subscribe(params => this.id = params['id']);
        this.attributeTypes = AttributeTypes;
    }

    ngOnInit() {
        this.getUser();
        this.getSourses();
        this.surname = this.getAttribute(this.attributeTypes.Surname);
        // this.form = new FormGroup({
        //     firstname: new FormControl(this.getAttribute(this.attributeTypes.FirstName)),
        //     // surname: new FormControl(''),
        //     // // middleName: new FormControl(''),
        //     // gender: new FormControl(''),
        //     // birthDate: new FormControl(''),
        //     // passportType: new FormControl(''),
        //     // passportNumber: new FormControl(''),
        //     // passportIssueDate: new FormControl(''),
        //     // // passportExpirationDate: new FormControl(''),
        //     // country: new FormControl(''),
        //     // zip: new FormControl(''),
        //     // // state: new FormControl(''),
        //     // city: new FormControl(''),
        //     // street: new FormControl(''),
        //     // house: new FormControl('')
        //     // flat: new FormControl('')
        // });
    }

    getUser() {
        this.loaderService.display(true);
        this.userService.getUserById(this.id)
            .then(data => {
                this.loaderService.display(false);
                this.user = JSON.parse(data['_body']);
                console.log(this.user);
                this.getSourses();
            })
            .catch(err => {
                this.loaderService.display(false);
                console.log(err);
            });
    }
    getSourses() {
        this.getSourse(this.attributeTypes.PassportPhoto);
        this.getSourse(this.attributeTypes.UserPhoto);
        this.getSourse(this.attributeTypes.AddressPhoto);
    }
    getSourse(type) {
        this.userService.getSourseBlob(this.getAttribute(type))
        .then(data => {
            const blob = new Blob([data['_body']], { type: 'image/jpg' });
            this.blobToBase64(blob, type);
        })
        .catch(err => {
            console.log(err);
        });
    }

    private blobToBase64(blob, type) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = (e) => {
            if (type === this.attributeTypes.PassportPhoto) {
                this.passportPhoto = reader.result;
            }
            if (type === this.attributeTypes.UserPhoto) {
                this.userPhoto = reader.result;
            }
            if (type === this.attributeTypes.AddressPhoto) {
                this.addressPhoto = reader.result;
                console.log(this.addressPhoto);
            }
        };
    }

    getAttribute(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, {code: type}).value;
        }
        return '';
    }

    checkValidation(asd) {
        console.log((<HTMLInputElement>asd.target).innerText);
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
