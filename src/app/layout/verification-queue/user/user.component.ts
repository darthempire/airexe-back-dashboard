import { Component, OnInit, NgModule, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserService } from './../../../shared/core/user.service';
import { LoaderService } from './../../../shared/core/loader.service';
import { HttpClient } from './../../../shared/utils/HttpClient';

import * as _ from 'lodash';

import { CountryCodes } from './country-codes';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [UserService, HttpClient]
})
export class UserComponent implements OnInit {
    userID: string;
    CreatedDate: Date;
    UpdateDate: Date;
    UserStatus: string;

    surname = '11232';
    private id: number;
    badSend = false;
    goodSend = false;
    user: any;
    attributeTypes: any;
    countryCodes: any = CountryCodes;

    passportPhoto: any;
    addressPhoto: any;
    userPhoto: any;

    requiredFields: any = [];
    changedFields: any = [];
    requiredFieldCodes: any = [
        AttributeTypes.FirstName,
        AttributeTypes.Surname,
        AttributeTypes.Gender,
        AttributeTypes.BirthDate,
        AttributeTypes.PassportType,
        AttributeTypes.PassportNumber,
        AttributeTypes.PassportIssueDate,
        AttributeTypes.CountryCode,
        AttributeTypes.City,
        AttributeTypes.Street,
        AttributeTypes.House,
        AttributeTypes.PassportPhoto
    ];

    private routeSubscription: Subscription;

    statuses: any = {
        Waiting: 0,
        Verified: 1,
        Rejected: 2
    };

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private loaderService: LoaderService
    ) {
        this.routeSubscription = route.params.subscribe(
            params => (this.id = params['id'])
        );
        this.attributeTypes = AttributeTypes;

        console.log(this.attributeTypes);
    }

    ngOnInit() {
        this.getUser();
        this.getSourses();
        this.surname = this.getAttribute(this.attributeTypes.Surname);
    }

    getUser() {
        this.loaderService.display(true);
        this.userService
            .getUserById(this.id)
            .then(data => {
                this.loaderService.display(false);
                this.user = JSON.parse(data['_body']);
                this.userID = this.user.id;
                this.CreatedDate = this.user.createdDate;
                this.UpdateDate = this.user.updateDate;
                this.UserStatus = this.user.status;

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
        this.userService
            .getSourseBlob(this.getAttribute(type))
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
        reader.onloadend = e => {
            if (type === this.attributeTypes.PassportPhoto) {
                this.passportPhoto = reader.result;
            }
            if (type === this.attributeTypes.UserPhoto) {
                this.userPhoto = reader.result;
            }
            if (type === this.attributeTypes.AddressPhoto) {
                this.addressPhoto = reader.result;
            }
        };
    }

    getAttribute(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, { code: type }).value;
        }
        return '';
    }

    getAttributeValidation(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, { code: type }).validation;
        }
        return '';
    }

    getCountryName(countryCode) {
        const result = _.find(this.countryCodes, {
            'alpha-2': countryCode.toString().toUpperCase()
        });
        if (result !== undefined) {
            return result.name;
        } else {
            return '';
        }
    }

    refillRequired() {
        this.requiredFields = [];
        this.requiredFieldCodes.forEach(element => {
            this.requiredFields.push(
                _.find(this.user.attrs, { code: element })
            );
        });
    }

    checkRequired() {
        this.refillRequired();
        let isAllSelected = false;
        this.requiredFields.forEach(element => {
            if (element.status === 0) {
                // 0 - waiting
                isAllSelected = true;
            }
        });
        return isAllSelected;
    }

    changeStatus(type, status) {
        this.user.attrs.forEach(element => {
            if (element.code === type) {
                element.validation = status;
                this.changedFields.push(
                    _.find(this.user.attrs, { code: type })
                );
            }
        });
    }

    saveChanges() {
        this.badSend = false;
        this.goodSend = false;
        console.log(this.changedFields);
        if (this.checkRequired()) {
            const images = [];
            images.push(
                _.find(this.changedFields, {
                    code: AttributeTypes.PassportPhoto
                })
            );
            images.push(
                _.find(this.changedFields, { code: AttributeTypes.UserPhoto })
            );
            images.push(
                _.find(this.changedFields, {
                    code: AttributeTypes.AddressPhoto
                })
            );

            _.remove(this.changedFields, {
                code: AttributeTypes.PassportPhoto
            });
            _.remove(this.changedFields, { code: AttributeTypes.UserPhoto });
            _.remove(this.changedFields, { code: AttributeTypes.AddressPhoto });

            images.forEach(element => {
                if (element.validation === this.statuses.Verified) {
                    this.validateSource(element.value);
                }
                if (element.validation === this.statuses.Rejected) {
                    this.rejectSource(element.value);
                }
            });

            this.changedFields.forEach(element => {
                if (element.validation === this.statuses.Verified) {
                    this.validate(element.code);
                }
                if (element.validation === this.statuses.Rejected) {
                    this.reject(element.code);
                }
            });
        }
    }

    verifyUser() {
        this.badSend = false;
        this.goodSend = true;
        this.userService
            .verifyUser()
            .then(data => {
                this.goodSend = true;
            })
            .catch(err => {
                this.badSend = true;
            });
    }

    rejectUser() {
        this.badSend = false;
        this.goodSend = true;
        this.userService
            .rejectUser()
            .then(data => {
                this.goodSend = true;
            })
            .catch(err => {
                this.badSend = true;
            });
    }

    validate(code) {
        this.userService.validate(code).catch(err => {
            this.badSend = true;
        });
    }

    reject(code) {
        this.userService.reject(code).catch(err => {
            this.badSend = true;
        });
    }

    validateSource(id) {
        this.userService.validateSource(id).catch(err => {
            this.badSend = true;
        });
    }

    rejectSource(id) {
        this.userService.rejectSource(id).catch(err => {
            this.badSend = true;
        });
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
    UserPhoto = '1072',

    Selfie = '1100',
    Address = '1101',
    Passport = '1102'
}
