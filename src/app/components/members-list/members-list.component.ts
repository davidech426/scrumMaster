import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
//import { Team_User_Project_Role } from '../../models/database.model'
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ModalMemberDialog } from './modal-member.component';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
    step=0;
    //PASS PROJECT ID HERE
    @Input() project_id: string;
    //project_id="8I9Rv9x2fMuhcfFXYx7l"
    memberList:string[]=[];
    user_id:string;
    user_name:string;

    team_project_role:Observable<any[]>;

    constructor(private auth: AngularFireAuth, private db:AngularFirestore,public dialog:MatDialog) {
    }

    //need a way to have all members involved in this particular project, 
    //most likely when manager assigns people to this project
    ngOnInit() {
        this.team_project_role=this.db.collection('team_user_project_role', ref=>{
            return ref.where('project_id','==',this.project_id)
        }).snapshotChanges().pipe(
        map(actions=>{
            return actions.map(a=>{
            const data=a.payload.doc.data();
            const id=a.payload.doc.id;
            return {id,...data}
            })
        })
        )

        this.team_project_role.subscribe(item=>{
          item.forEach(i=>{
            this.memberList.push(i);
          })
        })
    }
  
    openDialog(){
    const dialogRef = this.dialog.open(ModalMemberDialog, {
      width: '550px',
      data: {id:this.user_id,name:this.user_name}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.user_id= result.id; 
      this.user_name=result.name;    
      if(this.user_name  && this.user_id){
        this.addNewMember(this.user_name,this.user_id);
      }
    });
    }

  //note the new members added will only be developers, will not be PM,SM,PO because
  //a team/project can only have at most one of them and these 3
  //positons will be filled once a PM or SM decide to add a new member
  addNewMember(member:string,user_id:string){
    return new Promise((resolve,reject)=>{
      this.memberList=[]
      this.db
      .collection('team_user_project_role')
      .add({project_id:this.project_id,role:'developer',team_id:'', user_id:user_id, user_name:member})
      .then((obj:any)=>{
        resolve(obj);
      })
      .catch((error:any)=>{
        reject(error);
      })
    })
  }

}
