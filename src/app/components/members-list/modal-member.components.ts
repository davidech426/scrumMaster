import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/database.model'
import { map } from 'rxjs/operators';


export interface MemberData {
  id: string;
  name:string;
}


@Component({
  selector: 'modal-member-dialog',
  templateUrl: 'modal-member.html',
})
export class ModalMemberDialog {

  membersInProject:Observable<any[]>
  currentProject='8I9Rv9x2fMuhcfFXYx7l'
  members=[];
  selectedUser=[];
  getInfo:Observable<any[]>

  constructor(
    public dialogRef: MatDialogRef<ModalMemberDialog>, private db:AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: MemberData) {
    
      this.membersInProject=db.collection('user').snapshotChanges().pipe(
         map(actions=>{
          return actions.map(a=>{
            const data=a.payload.doc.data() as User;
            const id=a.payload.doc.id;
            return {id,...data}
          })
        })
      )

      this.membersInProject.subscribe(item=>{
        item.forEach(i=>{
          this.members.push(i);
        })
      })
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUserName(useremail){

    this.getInfo=this.db.collection('user', ref=>{
      return ref.where('email','==',useremail)
  }).snapshotChanges().pipe(
      map(actions=>{
       return actions.map(a=>{
         const data=a.payload.doc.data() as User;
         const id=a.payload.doc.id;
         return {id,...data}
       })
     })
   )
     this.getInfo.subscribe(item=>{
      item.forEach(i=>{
        this.selectedUser.push(i);
        this.data.id=i.id;
        var firstTemp=i.first_name as string
        var lastTemp=i.last_name as string
        this.data.name=firstTemp+ " " + lastTemp
      })
    })
    
  }
}
