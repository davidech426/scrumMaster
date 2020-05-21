import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';

//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private eventAuthError = new BehaviorSubject<string>("");
    eventAuthError$ = this.eventAuthError.asObservable();

    newUser: any;


    constructor(public afAuth: AngularFireAuth, public db: AngularFirestore, private router: Router) { 

    }

    /**isAuthenticated(): boolean {
        return this.afAuth.authState.pipe(map((res) => {
            if (res && res.uid){
                return true;
            } else {
                return false;
            }
        }));
    }**/

    register(user) {
        console.log(user);

        this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
        .then( userCredentials => {

            this.newUser = user;
            console.log(userCredentials);

            userCredentials.user.updateProfile({
                displayName: user.firstName + ' ' + user.lastName
            });

            this.insertUserData(userCredentials)
            .then(() => {
                console.log("User data inserted.");
            });
        }).catch(error => {
            console.log(error);
            this.eventAuthError.next(error);
        });
    }

    insertUserData(userCredential: firebase.auth.UserCredential) {
        return this.db.doc(`user/${userCredential.user.uid}`).set({
            email: this.newUser.email,
            first_name: this.newUser.firstName,
            last_name: this.newUser.lastName,
            role: 1
        });
    }

    login(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            this.eventAuthError.next(error);
        }).then(userCredential => {
            if (userCredential) {
                console.log("User logged in.");

                this.router.navigateByUrl('/');

            }
        })
    }

    getUserState() {
        return this.afAuth.authState;
    }

    getAuth() {
        return this.afAuth;
    }

    logout() {
        return this.afAuth.auth.signOut();
    }

    resetError() {
        this.eventAuthError.next(null);
    }
}