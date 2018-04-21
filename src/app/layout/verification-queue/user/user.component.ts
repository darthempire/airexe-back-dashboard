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
            return _.find(this.user.attrs, { code: type }) === undefined ? '' : _.find(this.user.attrs, { code: type }).value;
        }
        return '';
    }

    getAttributeValidation(type) {
        if (this.user !== undefined) {
            return _.find(this.user.attrs, { code: type }) === undefined ? '' : _.find(this.user.attrs, { code: type }).validation;
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
        let isAllSelected = true;
        this.user.attrs.forEach(element => {
            if (element.validation === 0 && _.find(this.requiredFieldCodes, element.code)) {
                // 0 - waiting
                isAllSelected = false;
                this.requiredSelected = true;
            }
        });
        return isAllSelected;
    }

    changeStatus(type, status) {
        this.user.attrs.forEach(element => {
            if (element.code === type) {
                element.validation = status;
                console.log(this.user);
                this.changedFields.push(
                    _.find(this.user.attrs, { code: type })
                );
            }
        });
    }

    saveChanges() {
        this.badSend = false;
        this.goodSend = false;
        if (this.checkRequired()) {
            const attrs = this.user.attrs;
            const images = [];
            images.push(
                _.find(attrs, {
                    code: AttributeTypes.PassportPhoto
                })
            );
            images.push(
                _.find(attrs, { code: AttributeTypes.UserPhoto })
            );
            images.push(
                _.find(attrs, {
                    code: AttributeTypes.AddressPhoto
                })
            );
            console.log(images);
            _.remove(attrs, {
                code: AttributeTypes.PassportPhoto
            });
            _.remove(attrs, { code: AttributeTypes.UserPhoto });
            _.remove(attrs, { code: AttributeTypes.AddressPhoto });

            this.validateSourseNew(images, 0, this.id);
            this.rejectSourseNew(images, 0, this.id);


            this.validateNew(attrs, 0, this.id);
            this.rejectNew(attrs, 0, this.id);

            alert('Changes saved!');
        }
    }

    validateArray(array) {
        array.forEach(element => {
            this.validate(element.code, this.id);
        });
    }

    verifyUser() {
        this.badSend = false;
        this.goodSend = true;
        this.userService
            .verifyUser(this.id)
            .then(data => {
                this.goodSend = true;
                this.getUser();
            })
            .catch(err => {
                this.badSend = true;
                this.getUser();
            });
    }

    rejectUser() {
        this.badSend = false;
        this.goodSend = true;
        this.userService
            .rejectUser(this.id)
            .then(data => {
                this.goodSend = true;
                this.getUser();
            })
            .catch(err => {
                this.badSend = true;
                this.getUser();
            });
    }

    validateNew(arr, index, userId) {
        if (arr[index] !== undefined && arr[index].code !== AttributeTypes.Email && arr[index].value !== '') {

            if (arr[index].validation === this.statuses.Verified && _.find(this.changedFields, {code: arr[index].code})) {
                this.userService.validate(arr[index].code, userId)
                .then(data => {
                    if (arr[index + 1] !== undefined) {
                        this.validateNew(arr, index + 1, userId);
                    }
                })
                .catch(err => {
                    this.badSend = true;
                });
            } else {
                if (arr[index + 1] !== undefined) {
                    this.validateNew(arr, index + 1, userId);
                }
            }
        } else {
            if (arr[index + 1] !== undefined) {
                this.validateNew(arr, index + 1, userId);
            }
        }
    }

    rejectNew(arr, index, userId) {
        if (arr[index] !== undefined && arr[index].code !== AttributeTypes.Email && arr[index].value !== '') {

            if (arr[index].validation === this.statuses.Rejected && _.find(this.changedFields, {code: arr[index].code})) {
                this.userService.reject(arr[index].code, userId)
                .then(data => {
                    if (arr[index + 1] !== undefined) {
                        this.rejectNew(arr, index + 1, userId);
                    }
                })
                .catch(err => {
                    this.badSend = true;
                });
            } else {
                if (arr[index + 1] !== undefined) {
                    this.rejectNew(arr, index + 1, userId);
                }
            }
        } else {
            if (arr[index + 1] !== undefined) {
                this.rejectNew(arr, index + 1, userId);
            }
        }
    }

    validateSourseNew(arr, index, userId) {
        if (arr[index] !== undefined && arr[index].code !== AttributeTypes.Email && arr[index].value !== '') {

            if (arr[index].validation === this.statuses.Verified && _.find(this.changedFields, {code: arr[index].code})) {
                this.userService.validateSource(arr[index].value)
                .then(data => {
                    if (arr[index + 1] !== undefined) {
                        this.validateSourseNew(arr, index + 1, userId);
                    }
                })
                .catch(err => {
                    this.badSend = true;
                });
            } else {
                if (arr[index + 1] !== undefined) {
                    this.validateSourseNew(arr, index + 1, userId);
                }
            }
        } else {
            if (arr[index + 1] !== undefined) {
                this.validateSourseNew(arr, index + 1, userId);
            }
        }
    }

    rejectSourseNew(arr, index, userId) {
        if (arr[index] !== undefined && arr[index].code !== AttributeTypes.Email && arr[index].value !== '') {

            if (arr[index].validation === this.statuses.Rejected && _.find(this.changedFields, {code: arr[index].code})) {
                this.userService.rejectSource(arr[index].value)
                .then(data => {
                    if (arr[index + 1] !== undefined) {
                        this.rejectSourseNew(arr, index + 1, userId);
                    }
                })
                .catch(err => {
                    this.badSend = true;
                });
            } else {
                if (arr[index + 1] !== undefined) {
                    this.rejectSourseNew(arr, index + 1, userId);
                }
            }
        } else {
            if (arr[index + 1] !== undefined) {
                this.rejectSourseNew(arr, index + 1, userId);
            }
        }
    }


    validate(code, userId) {
        return this.userService.validate(code, userId)
        .then(data => {

        })
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
