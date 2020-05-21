import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { User, SideBarOrder } from '../../models/database.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

    @Input() option: string;
    @Input() project_id: string;

    notifications: Observable<any[]>;

    constructor(private auth :AngularFireAuth, private auth2: AuthService, private router: Router, public db: AngularFirestore) { 
    
    }

    username = this.auth.auth.currentUser.displayName
    user_id = this.auth.auth.currentUser.uid

    menu_options: String[] = [
        "Home",
        "Notifications",
        "Projects",
        "Calendar",
        "Settings",
        "Sign Out"
    ];

    ngOnInit() {
      this.retrieveSidebarOrder();
      this.updateNotoficationFlag();
    }

    retrieveSidebarOrder() {      
      this.db.doc(`side_bar_order/${this.user_id}`).snapshotChanges().subscribe(x => {
            if(x.payload.exists) {
                 const data: SideBarOrder = x.payload.data();
                 this.menu_options = data.menu_order;
            } 
        }
      )
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.menu_options, event.previousIndex, event.currentIndex);
    }

    onClose(event: Event){
        event.preventDefault();
        document.getElementById("mySideNav").style.width = "0";
        document.getElementById("header").style.marginLeft="0";
        document.getElementById("header-right").style.marginLeft="0";
        document.getElementById("scrum-board").style.marginLeft="0";
        document.getElementById("other-pages").style.marginLeft="0";
    }

    switchToPage(page) {
        if(page.localeCompare('Home') == 0) {
            this.switchToHome();
        } else if(page.localeCompare('Projects') == 0) {
            this.switchToProject();
        } else if(page.localeCompare('Settings') == 0) {
            this.switchToSettings();
        } else if(page.localeCompare('Sign Out') == 0) {
            this.signOut();
        } else if (page.localeCompare('Calendar') == 0) {
            this.switchToCalendar();
        } else if (page.localeCompare('Notifications') == 0) {
            this.switchToNotifications();
        } else {
            alert("This page is not implemented yet");
        }
    }

    switchToHome() {
        document.getElementById("header-right").style.display = "none";
        document.getElementById("header-right-settings").style.display = "none";
        document.getElementById("header-right-calendar").style.display = "none";
        document.getElementById("header-right-notifications").style.display = "none";
        document.getElementById("header-right-home").style.display = "block";
    }

    switchToProject() {
        document.getElementById("header-right-home").style.display = "none";
        document.getElementById("header-right-settings").style.display = "none";
        document.getElementById("header-right-calendar").style.display = "none";
        document.getElementById("header-right-notifications").style.display = "none";
        document.getElementById("header-right").style.display = "block";
    }

    switchToCalendar() {
        document.getElementById("header-right-home").style.display = "none";
        document.getElementById("header-right").style.display = "none";
        document.getElementById("header-right-settings").style.display = "none";
        document.getElementById("header-right-notifications").style.display = "none";
        document.getElementById("header-right-calendar").style.display = "block";
    }

    switchToNotifications() {
        document.getElementById("header-right-home").style.display = "none";
        document.getElementById("header-right").style.display = "none";
        document.getElementById("header-right-calendar").style.display = "none";
        document.getElementById("header-right-settings").style.display = "none";
        document.getElementById("header-right-notifications").style.display = "block";
    }

    switchToSettings() {
        document.getElementById("header-right-home").style.display = "none";
        document.getElementById("header-right").style.display = "none";
        document.getElementById("header-right-calendar").style.display = "none";
        document.getElementById("header-right-notifications").style.display = "none";
        document.getElementById("header-right-settings").style.display = "block";
    }

    signOut() {
        if (this.auth2.logout()) {
            
            // Storing the order of the sidebar in the database
            //var order_arr = document.getElementById('example-list').textContent.split(" ");
            
            // Considering the problem case
            //var index_of_sign = order_arr.indexOf("Sign");
            //order_arr[index_of_sign] = "Sign Out";
            //delete order_arr[index_of_sign + 1];

            // Filtering blank values
            //order_arr = order_arr.filter(function(e){return e}); 
            
            // Adding to the database
            //this.db.collection("side_bar_order").doc(this.user_id).set({ menu_order: order_arr }, { merge: true });

            this.db.collection("side_bar_order").doc(this.user_id).set({ menu_order: this.menu_options }, { merge: true });
            
            this.router.navigateByUrl('/login');
        } else {
            console.log("Logout failed.");
        }
    }

    updateNotoficationFlag() {
        //console.log("USER:", this.user_id);
        this.notifications = this.db.collection(`user/${this.user_id}/notifications`, ref => ref.where('dismissed', '==', false)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                //console.log(a.type);
  
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            }))
          );
    }
}
