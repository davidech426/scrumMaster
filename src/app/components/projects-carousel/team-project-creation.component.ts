import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { DataSource } from '@angular/cdk/table';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {User} from '../../models/database.model'
import { map } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface CreationData{
  project:string,
  projectd:string,
  team:string,
  teamd:string,
  poID:string,
  poName:string,
  smID:string,
  smName:string,
  devList:string[],
  devNameList:string[]
}
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
  foundPM:boolean
  foundSM:boolean
  foundPO:boolean;

  constructor(private auth: AngularFireAuth,private db:AngularFirestore,
    public dialogRef:MatDialogRef<TeamProjectCreationComponent>,
    @Inject(MAT_DIALOG_DATA) public data:CreationData) {
      
    this._db=db;
    this.users=db.collection('user').valueChanges();
    this.foundPM=false;
    this.foundSM=false;
    this.foundPO=false;
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

  assignSM(uid,ufirst,ulast){
    this.smID=uid as string
    this.smName=ufirst+ " " + ulast
    this.foundSM=true
    this.data.smID=this.smID
    this.data.smName=this.smName
  }

  assignPO(uid,ufirst,ulast){
    this.poID=uid as string
    this.poName=ufirst+" "+ulast
    this.foundPO=true
    this.data.poName=this.poName
    this.data.poID=this.poID
  }

  assignDev(uid,ufirst,ulast){
    var devID=uid as string;
    this.devList.push(devID);
    this.devNameList.push(ufirst+" "+ulast)
    this.data.devList=this.devList
    this.data.devNameList=this.devNameList
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
