import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

    /** TESTING VARS **/
    tempID = 'K6g5b5EmaoUxY6bdXURqUfTkkxv1';

    notifications: Observable<any[]>;
    pageEvent: PageEvent;


    constructor(private db: AngularFirestore) { 
        this.getNotifications();
    }

    ngOnInit() {
    }

    getNotifications() {
        this.notifications = this.db.collection(`user/${this.tempID}/notifications`, ref => ref.orderBy('date')).snapshotChanges().pipe(
          map(actions => actions.map(a => {

            const data = a.payload.doc.data();
            const id = a.payload.doc.id;

            return { id, ...data };
          }))
        );
        /*this.notifications = this.db.collection(`user/${this.tempID}/notifications`).valueChanges();

        this.notifications.subscribe(
            (datas) => { console.log("Notification!") },
            (err)=>{ console.log("Error: ", err) });*/

        //console.log(this.db.collection(`user/${this.tempID}/notifications`).stateChanges());
    }

    markAsUnread(current) {
        console.log("Unread!", current);
        this.db.collection(`user/${this.tempID}/notifications`).doc(current).set({ dismissed: false}, { merge: true});

    }

    markAsRead(current) {
        console.log("Read!", current);
        this.db.collection(`user/${this.tempID}/notifications`).doc(current).set({ dismissed: true}, { merge: true});
    }

}
