import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { CarouselModule } from 'ngx-bootstrap';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {TeamProjectCreationComponent} from './team-project-creation.component'
import { MatDialog } from '@angular/material';



@Component({
    selector: 'app-projects-carousel',
    templateUrl: './projects-carousel.component.html',
    styleUrls: ['./projects-carousel.component.css']
})
export class ProjectsCarouselComponent implements OnInit {

    /** TEST VARS **/
    //tempUserID = 'K6g5b5EmaoUxY6bdXURqUfTkkxv1';
    currentUserProjects: Observable<any[]>;
    key = 'role';
    current_role: string; 
    currentUserRoles: Observable<any[]>;

    memberNames: string[]=[]
    memberIDs: string[]=[]
    project:string
    projectd:string
    team:string
    teamd:string
    smID:string
    smName:string
    poID:string
    poName:string
    newProjectId:string
    newTeamId:string
    devList: string[]=[];
   devNameList:string[]=[];


    constructor(private db: AngularFirestore, private router: Router, private auth: AngularFireAuth, public dialog: MatDialog) { 

        this.currentUserProjects = this.db.collection('project', ref => ref.where(`members`, 'array-contains', this.auth.auth.currentUser.uid)).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            //console.log("Role", data);
            return { id, ...data };
          }))
        );


        

    }

    ngOnInit() {
        
    }

    goToProject(projectID) {
        this.fetchUserRole(projectID);


        console.log(projectID);
        
        //this.router.navigateByUrl('/project/'+ projectID);
    }

    fetchUserRole(projectID) {
        console.log("Fetching...");

        this.currentUserRoles = this.db.collection('team_user_project_role', ref => ref.where(`user_id`, '==', this.auth.auth.currentUser.uid).where(`project_id`, '==', projectID)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              console.log("Role", data.role);

              this.router.navigateByUrl('/project/'+ projectID+ '/'+ data.role);

              return { id, ...data };
            }))
          );
    }

    addTeamAndProject(){
        const dialogRef=this.dialog.open(TeamProjectCreationComponent,{
          width:'800px',
          data:{project: this.project,projectd:this.projectd,team:this.team,teamd:this.teamd
                ,smID:this.smID,smName:this.smName,poID:this.poID,poName:this.poName
              ,devList:this.devList,devNameList:this.devNameList}
        })
        dialogRef.afterClosed().subscribe(result=>{
          this.project=result.project
          this.projectd=result.projectd
          this.team=result.team
          this.teamd=result.teamd
          this.smName=result.smName
          this.smID=result.smID
          this.poID=result.poID
          this.poName=result.poName
          this.devList=result.devList
          this.devNameList=result.devNameList
          //make sure that all inputs are required
          if(this.project && this.projectd && this.team && this.teamd
            && this.devList.length!=0 && this.smID && this.smName
            && this.poID && this.poName){
            this.addNewProject(this.project,this.projectd,this.team,this.teamd)
          }
        })
      }
  
      addNewProject(project,projectd,team,teamd){
        for(var i=0;i<this.devList.length;i++){
          this.memberIDs.push(this.devList[i])
        }
        for(var i=0;i<this.devNameList.length;i++){
          this.memberNames.push(this.devNameList[i])
        }
        this.memberIDs.push(this.smID)
        this.memberIDs.push(this.poID)
        this.memberIDs.push(this.auth.auth.currentUser.uid)
        this.memberNames.push(this.smName)
        this.memberNames.push(this.poName)
        this.memberNames.push(this.auth.auth.currentUser.displayName)
        return new Promise((resolve,reject)=>{
          this.db
        .collection('team')
        .add({description:this.teamd, name:this.team,
          creator_id:this.auth.auth.currentUser.uid,admin_id:this.auth.auth.currentUser.uid})
        .then((docRef)=>{
          this.newTeamId=docRef.id as string;
        })
        .then((obj:any)=>{
          resolve(obj);
        })
        .catch((error:any)=>{
          reject(error);
        })
  
          this.db
          .collection('project')
          .add({
            creator_id:this.auth.auth.currentUser.uid,
            description:this.projectd,
            name:this.project,
            project_manager_id:this.auth.auth.currentUser.uid,
            project_owner_id:this.poID,
            scrum_master_id:this.smID,
            member_names:this.memberNames,
            members:this.memberIDs
          })
          .then((docRef)=>{
            this.newProjectId=docRef.id
          })
          .then((obj:any)=>{
            resolve(obj);
          })
          .catch((error:any)=>{
            reject(error);
          }).then((obj:any)=>{
              //add PM role
          this.db
          .collection('team_user_project_role')
          .add({project_id:this.newProjectId,team_id:this.newTeamId,user_id:this.auth.auth.currentUser.uid,role:'project manager',user_name:this.auth.auth.currentUser.displayName})
          .then((obj:any)=>{
            resolve(obj);
          })
          .catch((error:any)=>{
            reject(error);
        })
        //add PO role
        this.db
          .collection('team_user_project_role')
          .add({project_id:this.newProjectId,team_id:this.newTeamId,user_id:this.poID,role:'project owner',user_name:this.poName})
          .then((obj:any)=>{
            resolve(obj);
            console.log(this.newProjectId)
          })
          .catch((error:any)=>{
            reject(error);
        })
        //add SM role
        this.db
          .collection('team_user_project_role')
          .add({project_id:this.newProjectId,team_id:this.newTeamId,user_id:this.smID,role:'scrum master',user_name:this.smName})
          .then((obj:any)=>{
            resolve(obj);
          })
          .catch((error:any)=>{
            reject(error);
        })
        //add developer roles
        for(var i=0;i<this.devList.length;i++){
          this.db
          .collection('team_user_project_role')
          .add({project_id:this.newProjectId,team_id:this.newTeamId,user_id:this.devList[i],role:'developer',user_name:this.devNameList[i]})
          .then((obj:any)=>{
            resolve(obj);
          })
          .catch((error:any)=>{
            reject(error);
        })
      }
        })
      })
    }
  
}
