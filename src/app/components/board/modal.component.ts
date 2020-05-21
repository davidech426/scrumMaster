import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
//import {Team_User_Project_Role} from '../../models/database.model'
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';


export interface DialogData {
  task: string;
  due: string;
  assignee:string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  membersInProject:Observable<any[]>
  membersWithPriority:Observable<any[]>
  //need to pass project id here
  //@Input() currentProject: string;
  currentProject='8I9Rv9x2fMuhcfFXYx7l'
  members=[];
  isPMorSMArr=[]
  member_assigned:string=""
  isPMorSM=false
  auxT:any[]=[]

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, private db:AngularFirestore,
    private auth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    
      this.membersInProject=db.collection('team_user_project_role', ref=>{
        return ref.where('project_id','==',this.currentProject)
      }).snapshotChanges().pipe(
         map(actions=>{
          return actions.map(a=>{
            const data=a.payload.doc.data();
            const id=a.payload.doc.id;
            return {id,...data}
          })
        })
      )

        this.membersWithPriority=db.collection('team_user_project_role', ref=>{
          return ref.where('project_id','==',this.currentProject).where('role','==','project manager')
        }).snapshotChanges().pipe(
           map(actions=>{
            return actions.map(a=>{
              const data=a.payload.doc.data();
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

      this.membersWithPriority.subscribe(item=>{
        item.forEach(i=>{
          this.isPMorSMArr.push(i.user_id);
        })
      })


    }

    isPriorityMember(){
        if(this.isPMorSMArr.includes(this.auth.auth.currentUser.uid)){
          return true;
        }
        return false;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


