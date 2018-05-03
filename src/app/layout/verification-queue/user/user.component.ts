import { Component, OnInit, NgModule, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserService } from './../../../shared/core/user.service';
import { LoaderService } from './../../../shared/core/loader.service';
import { HttpClient } from './../../../shared/utils/HttpClient';

import * as _ from 'lodash';

import { CountryCodes } from './country-codes';
import { log } from 'util';

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

    private id: number;
    badSend = false;
    goodSend = false;
    user: any;
    attributeTypes: any;
    countryCodes: any = CountryCodes;
    requiredSelected = false;

    passportPhoto: any;
    addressPhoto: any;
    userPhoto: any;
    userEmail: any;

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
        AttributeTypes.PassportPhoto,
        AttributeTypes.AddressPhoto
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
    }

    ngOnInit() {
        this.getUser();
    }

    getUser() {
        this.loaderService.display(true);
        // this.userService.validateSourceNew(12);
        this.userService
            .getUserById(this.id)
            .then(data => {
                this.loaderService.display(false);
                this.user = JSON.parse(data['_body']);

                this.userID = this.user.id;
                this.CreatedDate = this.user.createdDate;
                this.UpdateDate = this.user.updateDate;
                this.UserStatus = this.user.status;
                this.userEmail = _.find(this.user.attrs, { code: '1050' }).value;
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
            return _.find(this.user.attrs, { code: type }) === undefined
                ? ''
                : _.find(this.user.attrs, { code: type }).value;
        }
        return '';
    }

    getAttributeValidation(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, { code: type }) === undefined
                ? ''
                : _.find(this.user.attrs, { code: type }).validation;
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
        this.requiredSelected = false;
        let isAllSelected = false;
        this.user.attrs.forEach(element => {
            if (
                element.validation === 0 &&
                this.requiredFieldCodes.includes(element.code) === true
            ) {
                console.log(element.code);
                // 0 - waiting
                this.requiredSelected = true;
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
        if (!this.checkRequired()) {
            const attrs = this.user.attrs;
            const images = [];
            images.push(
                _.find(attrs, {
                    code: AttributeTypes.PassportPhoto
                })
            );
            images.push(_.find(attrs, { code: AttributeTypes.UserPhoto }));
            images.push(
                _.find(attrs, {
                    code: AttributeTypes.AddressPhoto
                })
            );
            _.remove(attrs, {
                code: AttributeTypes.PassportPhoto
            });
            _.remove(attrs, { code: AttributeTypes.UserPhoto });
            _.remove(attrs, { code: AttributeTypes.AddressPhoto });

            const lets = [];
            this.loaderService.display(true);
            try {
                this.validateSourseNew(images).then(data => {
                    this.rejectSourseNew(images).then(result => {
                        this.validateNew(attrs).then(result1 => {
                            this.rejectNew(attrs).then(result2 => {
                                this.loaderService.display(false);
                                this.getUser();
                                alert('Changes Saved!');
                            });
                        });
                    });
                });
            } catch {
                this.loaderService.display(false);
            }
        }
    }

    validateArray(array) {
        array.forEach(element => {
            this.validate(element.code, this.id);
        });
    }

    verifyUser() {
        this.badSend = false;
        this.goodSend = false;
        console.log(this.checkRequiredPhotos());
        if (this.checkRequiredPhotos()) {
            if (!this.checkRejectUser() && !this.checkRejectUser()) {
                this.userService
                .verifyUser(this.id)
                .then(data => {
                    this.goodSend = true;
                    this.getUser();
                    alert('Success');
                })
                .catch(err => {
                    this.badSend = true;
                    this.getUser();
                });
            } else {
                alert('Have rejected field');
            }
        } else {
            alert('Not all required photos');
        }
    }

    rejectUser() {
        this.badSend = false;
        this.goodSend = false;
        console.log(this.checkRejectUser());
        if (this.checkRejectUser()) {
            this.userService
            .rejectUser(this.id)
            .then(data => {
                this.goodSend = true;
                this.getUser();
                alert('Success');
            })
            .catch(err => {
                this.badSend = true;
                this.getUser();
            });
        } else {
            alert('No fields in status Rejected');
        }

    }

    checkRequiredPhotos() {
        const value1 = _.find(this.user.attrs, { code: AttributeTypes.AddressPhoto }).value;
        const value2 = _.find(this.user.attrs, { code: AttributeTypes.PassportPhoto }).value;
        console.log(value2);
        if ((value1  !== undefined || value1 !== '') && (value2  !== undefined || value2 !== '')) {
            return true;
        } else {
            return false;
        }
    }

    validateNew(arr) {
        const elements = [];
        arr.forEach(element => {
            if (
                element !== undefined &&
                element.code !== AttributeTypes.Email
            ) {
                if (
                    element.validation === this.statuses.Verified &&
                    _.find(this.changedFields, { code: element.code })
                ) {
                    elements.push(element);
                }
            }
        });

        return this.userService.validateNew(elements, this.id);
    }

    checkRejectUser() {
        let result = false;
        this.user.attrs.forEach(element => {
            if (element.validation === this.statuses.Rejected) {
                result = true;
            }
        });
        return result;
    }

    rejectNew(arr) {
        const elements = [];
        arr.forEach(element => {
            if (
                element !== undefined &&
                element.code !== AttributeTypes.Email
            ) {
                if (
                    element.validation === this.statuses.Rejected &&
                    _.find(this.changedFields, { code: element.code })
                ) {
                    elements.push(element);
                }
            }
        });

        return this.userService.rejectNew(elements, this.id);
    }

    validateSourseNew(arr) {
        const elements = [];
        arr.forEach(element => {
            if (
                element !== undefined &&
                element.code !== AttributeTypes.Email &&
                element.value !== ''
            ) {
                if (
                    element.validation === this.statuses.Verified &&
                    _.find(this.changedFields, { code: element.code })
                ) {
                    elements.push(element);
                }
            }
        });
        return this.userService.validateSourceNew(elements);
    }

    rejectSourseNew(arr) {
        const elements = [];
        arr.forEach(element => {
            if (
                element !== undefined &&
                element.code !== AttributeTypes.Email &&
                element.value !== ''
            ) {
                if (
                    element.validation === this.statuses.Rejected &&
                    _.find(this.changedFields, { code: element.code })
                ) {
                    elements.push(element);
                }
            }
        });
        return this.userService.rejectSourceNew(elements);
    }

    validate(code, userId) {
        return this.userService
            .validate(code, userId)
            .then(data => {})
            .catch(err => {
                this.badSend = true;
            });
    }

    reject(code, userId) {
        this.userService.reject(code, userId).catch(err => {
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
    UserPhoto = '1072'
}
