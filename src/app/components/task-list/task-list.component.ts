import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { async } from 'q';
import { DataSource } from '@angular/cdk/table';
import { Task } from '../../models/database.model'

const DATA: Task[]=[]
/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-task-list',
  styleUrls: ['task-list.component.css'],
  templateUrl: 'task-list.component.html',
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['id','assignee', 'task', 'project'];
  dataSource = new MatTableDataSource<Task>();
  data;

  /* KEVIN PASS PROJECT ID HERE-DAVID*/
  @Input() project_id: string;
  //project_id='8I9Rv9x2fMuhcfFXYx7l';
  myTasks:Observable<any[]>;
  allTasks:Observable<any[]>;
  roles:Observable<any[]>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  _db:AngularFirestore;
  tasks: Observable<any[]>;
  task_ids:Observable<Task[]>;
  taskCollection:AngularFirestoreCollection<Task>;

  SMOrPMList:String []=[]


  constructor(private auth: AngularFireAuth,private db:AngularFirestore) {
  }

  ngOnInit() {
    this._db=this.db;
    this.tasks=this.db.collection('task').valueChanges();
    
    //if developer/ po should only view their tasks
    this.myTasks=this.db.collection('task', ref=>{
        return ref.where('assignee_name','==',this.auth.auth.currentUser.displayName)
          .where('project_id','==',this.project_id)
    }).snapshotChanges().pipe(
      map(actions=>{
        return actions.map(a=>{
          const data=a.payload.doc.data() as Task;
          const id=a.payload.doc.id;
          return {id,...data}
        })
      })
    )  

    //if SM or PM should view all tasks
    this.allTasks=this.db.collection('task', ref=>{
      return ref.where('project_id','==',this.project_id)
  }).snapshotChanges().pipe(
    map(actions=>{
      return actions.map(a=>{
        const data=a.payload.doc.data() as Task;
        const id=a.payload.doc.id;
        return {id,...data}
      })
    })
  )  

    this.roles=this.db.collection('team_user_project_role', ref=>{
      return ref.where('project_id','==',this.project_id)
        .where('role','==','project manager')
  }).snapshotChanges().pipe(
    map(actions=>{
      return actions.map(a=>{
        const data=a.payload.doc.data() as Task;
        const id=a.payload.doc.id;
        return {id,...data}
      })
    })
  )
  

    this.roles.subscribe(item=>{
      item.forEach(i=>{
        this.SMOrPMList.push(i);
      })
    })

    this.roles.subscribe( items=>{
      items.map(item=>{
        //if current user is the PM for this project then show all tasks
        if(item.user_id==this.auth.auth.currentUser.uid){
            this.allTasks.subscribe(data=>{
              this.dataSource.data=data;
            })
        } else{ //else only show their tasks
          this.myTasks.subscribe(data=>{
            this.dataSource.data=data;
          })
        }
        console.log(item.user_id==this.auth.auth.currentUser.uid)
      })
    })
   
    
    // Assign the data to the data source for the table to render
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
