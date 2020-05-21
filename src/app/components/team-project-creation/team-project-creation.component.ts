import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { DataSource } from '@angular/cdk/table';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {User} from '../../models/database.model'
import { map } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-team-project-creation',
  templateUrl: './team-project-creation.component.html',
  styleUrls: ['./team-project-creation.component.css']
})
export class TeamProjectCreationComponent implements OnInit {

  displayedColumns: string[] = ['name', 'id', 'role-selection'];
  dataSource=new MatTableDataSource<User>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  _db:AngularFirestore;
  users: Observable<any[]>;
  pmID:string;
  pmName:string;
  smID:string;
  smName:string;
  poID:string;
  poName:string;
  devList: string[]=[];
  devNameList:string[]=[];
  projectName:string;
  projectDescription:string;
  teamName:string;
  teamDescription:string;
  foundPM:boolean
  foundSM:boolean
  foundPO:boolean;
  newProjectId:string
  newTeamId:string

  constructor(private auth: AngularFireAuth,private db:AngularFirestore) {
    this._db=db;
    this.users=db.collection('user').valueChanges();
    this.foundPM=false;
    this.foundSM=false;
    this.foundPO=false;
    this.newProjectId="";
    this.newTeamId="";

    this.users=db.collection('user').snapshotChanges().pipe(
      map(actions=>{
        return actions.map(a=>{
          const data=a.payload.doc.data() as User;
          const id=a.payload.doc.id;
          return {id,...data}
        })
      })
    )

    
   }

  ngOnInit() {

    this.users.subscribe(data=>{
      this.dataSource.data=data;
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }

  getProjectName(pname){
    this.projectName=pname as string
  }

  getProjectDescription(pdesc){
    this.projectDescription=pdesc as string
  }

  getTeamName(tname){
    this.teamName=tname as string
  }

  getTeamDescription(tdesc){
     this.teamDescription=tdesc as string
  }

  assignPM(uid,ufirst,ulast){
    this.pmID=uid as string
    this.pmName=ufirst + " " + ulast
    this.foundPM=true
  }

  assignSM(uid,ufirst,ulast){
    this.smID=uid as string
    this.smName=ufirst+ " " + ulast
    this.foundSM=true
  }

  assignPO(uid,ufirst,ulast){
    this.poID=uid as string
    this.poName=ufirst+" "+ulast
    this.foundPO=true
  }

  assignDev(uid,ufirst,ulast){
    var devID=uid as string;
    this.devList.push(devID);
    this.devNameList.push(ufirst+" "+ulast)
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addTeamAndProject(){
    return new Promise((resolve,reject)=>{
      this._db
      .collection('team')
      .add({description:this.teamDescription, name:this.teamName,
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
      this._db
      .collection('project')
      .add({description:this.projectDescription, name:this.projectName,project_manager_id:this.pmID,project_owner_id:this.poID,scrum_master_id:this.smID,creator_id:this.auth.auth.currentUser.uid})
      .then((docRef)=>{
        this.newProjectId=docRef.id as string;
      })
      .then((obj:any)=>{
        resolve(obj);
      })
      .catch((error:any)=>{
        reject(error);
      }).then((obj:any)=>{
        //add PM role
        this._db
          .collection('team_user_project_role')
          .add({project_id:this.newProjectId,team_id:this.newTeamId,user_id:this.pmID,role:'project manager',user_name:this.pmName})
          .then((obj:any)=>{
            resolve(obj);
          })
          .catch((error:any)=>{
            reject(error);
        })
        //add PO role
        this._db
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
        this._db
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
          this._db
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
