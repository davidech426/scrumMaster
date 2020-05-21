import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

    myForm: FormGroup;

    authError:any;

    constructor(private auth: AuthService, private fb: FormBuilder, private router: Router) { }

    ngOnInit() {
       this.auth.eventAuthError$.subscribe( data => {
        this.authError = data;
    })

       this.myForm = this.fb.group({
        firstName : '',
        lastName : '',
        email : '',
        password : '',
        confirmPassword : ''
    })
   }
   
   createUser(frm) {

    /**
        Notes:
        - Add user roles. (validate)
        **/

        if (!frm.value.firstName) {
            console.log("Enter a name.");
        } else if (!frm.value.lastName) {
            console.log("Enter a last name.");
        } else if (!frm.value.email) {
            console.log("Enter an email.");
        } else if (!frm.value.password) {
            console.log("Enter a password.");
        } else if (frm.value.password != frm.value.confirmPassword) {
            console.log("Passwords must match.");
        } else {
            //if (frm.value.firstName && frm.value.lastName && frm.value.email && frm.value.password && frm.value.password == frm.value.confirmPassword) {
                console.log(frm.value);

                // Send to auth service
                this.auth.register(frm.value);
            }
        }

        login() {
            this.authError = null;
            this.auth.resetError();
            this.router.navigateByUrl('/login');
        }



    }
