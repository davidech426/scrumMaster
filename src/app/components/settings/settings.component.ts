import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../models/database.model';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
    constructor(private auth :AngularFireAuth, private auth_add: AuthService, private router: Router, public db: AngularFirestore) { }

    ngOnInit() {}

    fullname = this.auth.auth.currentUser.displayName
    email = this.auth.auth.currentUser.email
    user_id = this.auth.auth.currentUser.uid
    
    // userCollection: AngularFirestoreCollection<User>;
    // feedItem: Observable<Feed[]>;
    
    // NEED TO CLOSE OBSERVABLES BEFORE WRITING TO THE DATABASE, THEN REOPEN AFTER
    
    items = [
        {selected: true, label: 'Software Developer'}, 
        {selected: false, label: 'Project Manager'},
        {selected: false, label: 'Project Owner'},
        {selected: false, label: 'Scrum Master'}
    ];
    
    /* 
    retrieve(col, doc?, query?) {       
      this.userCollection = this.db.collection(col);
      this.feedItem = this.userCollection.snapshotChanges()
        .pipe(map(actions => {
            return actions.map( action => {
              const data = action.payload.doc.data();
              const id = action.payload.doc.id;
              const firstName = data.first_name;
              const lastName = data.last_name;
              const email = data.email;
              return { this_id: id, first_name: firstName, last_name: lastName, email: email };
            });
        }),
      );
    } 
    */
    
    recordChanges(message) {
        for (var i = 0; i < this.items.length; i++) {
            if(this.items[i].label == message)
                this.items[i].selected = true;
            else
                this.items[i].selected = false;
        }
    }
    
    submitChanges() {       
        /*
        this.retrieve("user");
        this.feedItem.forEach(value => {
          value.forEach(v => {
              alert(v.this_id + " " + v.first_name + " " + v.last_name + " " + v.email);
          })
        });
        */
        
        // For debugging purposes
        var str = "";
        
        for(var i = 0; i < this.items.length; i++) {
            str += this.items[i].label + " " + this.items[i].selected + ", ";
        }
        
        // alert(str);
        
        // Adding / Updating the database here. Remember to consider the transition to regular radio buttons...
        this.db.collection("user").doc(this.user_id).set({ is_developer: this.items[0].selected }, { merge: true });
        this.db.collection("user").doc(this.user_id).set({ is_manager: this.items[1].selected }, { merge: true });
        this.db.collection("user").doc(this.user_id).set({ is_owner: this.items[2].selected }, { merge: true });
        this.db.collection("user").doc(this.user_id).set({ is_master: this.items[3].selected }, { merge: true });
    }
}

