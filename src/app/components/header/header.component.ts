import { Component, OnInit, Input } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../models/database.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    @Input() option: string;
    @Input() project_id: string;

    constructor(private auth :AngularFireAuth, private auth2: AuthService, private router: Router, public db: AngularFirestore) { }

    is_scrumMaster = false;
    user_id = this.auth.auth.currentUser.uid

    ngOnInit() {
    }

    toggleSide(){
        if (document.getElementById("mySideNav2").style.width == "250px") {
            document.getElementById("mySideNav2").style.width = "0";
            document.getElementById("header").style.marginLeft= "0";
            document.getElementById("header-right").style.marginLeft="0";
            document.getElementById("scrum-board").style.marginLeft="0";
            document.getElementById("other-pages").style.marginLeft="0";
        } else { 
            document.getElementById("mySideNav2").style.width="250px";
            document.getElementById("header").style.marginLeft="250px";
            document.getElementById("header-right").style.marginLeft="250px";
            document.getElementById("scrum-board").style.marginLeft="250px";
            document.getElementById("other-pages").style.marginLeft="250px";
        }
    }

    goToAllProjects() {
        this.router.navigateByUrl('');
    }

}
