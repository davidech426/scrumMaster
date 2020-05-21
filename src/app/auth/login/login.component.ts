import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import {MatSnackBar} from '@angular/material/snack-bar';

import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    authError: any;

    myForm: FormGroup;

    durationInSeconds = 5;

    constructor(private auth: AuthService, private fb: FormBuilder, private router: Router, private _snackBar: MatSnackBar) { 
    }

    ngOnInit() {
        this.auth.eventAuthError$.subscribe( data => {
            this.authError = data;
        })

        /**this.auth.getUserState().subscribe(user => {
            console.log(user);
        })**/

        this.myForm = this.fb.group({
            email: '',
            password: ''
        })

        //this.myForm.valueChanges.subscribe(console.log)
    }

    login(frm) {
        console.log("Called!");
        console.log(frm.value.email);
        console.log(frm.value.password);

        this.auth.login(frm.value.email, frm.value.password);
    }

    register() {
        this.authError = null;
        this.auth.resetError();
        this.router.navigateByUrl('/registration');
    }

    openSnackBar() {
        this._snackBar.openFromComponent(LoginComponent, {
          duration: this.durationInSeconds * 1000,
        });
    }

}
