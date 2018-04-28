import { Component, OnInit } from '@angular/core';

import { UserService } from './../../shared/core/user.service';
import { LoaderService } from './../../shared/core/loader.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-verification-queue',
    templateUrl: './verification-queue.component.html',
    styleUrls: ['./verification-queue.component.css']
})
export class VerificationQueueComponent implements OnInit {
    searchModel: any = {
        skip: 0,
        take: 20
    };

    users: any = new Array();

    constructor(private userService: UserService, private loaderService: LoaderService) {}

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.loaderService.display(true);
        this.userService
            .getUsers(this.searchModel.skip, this.searchModel.take)
            .then(data => {
                this.prepareDataToTable(JSON.parse(data['_body']));
                this.loaderService.display(false);
            })
            .catch(err => {
                this.loaderService.display(false);
                console.log(err);
            });
    }

    private prepareDataToTable(data) {
        for (const user of data) {
            user.Email = _.find(user.attrs, { code: '1050' }).value;
            user.validated = _.countBy(user.attrs, { validation: 1 }).true;
            user.waiting = _.countBy(user.attrs, { validation: 0 }).true;
            this.users.push(user);
        }
    }

    next() {
        this.searchModel.skip += 20;
        this.searchModel.take += 20;
        this.cleanusers();
        this.getUsers();
    }

    previous() {
        this.searchModel.skip -= 20;
        this.searchModel.take -= 20;
        this.cleanusers();
        this.getUsers();
    }

    cleanusers() {
        this.users = new Array();
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
