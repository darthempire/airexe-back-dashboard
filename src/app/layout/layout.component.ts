import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
    css_class_wrapper: any;
    css_class_sidebar: any;

    constructor(public router: Router) { }

    ngOnInit() {

        if (document.body.clientWidth < 991) {
            this.css_class_wrapper = 'col-12';
            this.css_class_sidebar = 'd-none';
        } else {
            this.css_class_wrapper = 'col-10';
            this.css_class_sidebar = '';
        }

        if (this.router.url === '/') {
            this.router.navigate(['/verification-queue']);
        }
    }

}
