import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireAuth} from '@angular/fire/auth'
import { DialogOverviewExampleDialog } from './modal.component'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../../models/database.model';
import { DialogData } from '../../models/database.model'
import { formatDate } from '@angular/common'
import * as firebase from 'firebase'


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit,OnDestroy {
    //PASS IN PROJECT ID HERE
    @Input() project_id: string;
    //project_id='8I9Rv9x2fMuhcfFXYx7l'
    added: boolean;
    task: string;
    due: string;
    start: string;
    name: string;
    todo=[]
    inProgress=[]
    done=[]
    task_assigned_to:string;
    assignee:string
    
    _db:AngularFirestore;
    tasks: Observable<any[]>
    tasksTodo: Observable<any[]>
    projectName:Observable<any[]>
    tasksInP: Observable<any[]>
    tasksDone: Observable<any[]>
    users: Observable<any[]>
    private progressSub: Subscription
    private doneSub: Subscription
    private todoSub: Subscription

    constructor(public dialog: MatDialog, private auth: AngularFireAuth, private db:AngularFirestore) {
        
     }

    ngOnInit() {
        console.log("Board for: ", this.project_id);

        this._db=this.db;
        this.tasks=this.db.collection('task').valueChanges();
        //this.users=db.collection('user').valueChanges();
        this.task_assigned_to=this.auth.auth.currentUser.displayName


        this.tasksTodo=this._db.collection('task', ref=>{
          return ref.where('status','==','todo').where('project_id','==',this.project_id)
      }).snapshotChanges().pipe(
          map(actions=>{
            return actions.map(a=>{
              const data=a.payload.doc.data() as Task;
              const id=a.payload.doc.id;
              return {id,...data}
            })
          })
        )
  
        this.projectName=this.db.collection('project', ref=>{
          return ref.where('id','==',this.project_id)
      }).snapshotChanges().pipe(
          map(actions=>{
            return actions.map(a=>{
              const data=a.payload.doc.data() as Task;
              const id=a.payload.doc.id;
              return {id,...data}
            })
          })
        )

        this.tasksInP=this.db.collection('task', ref=>{
          return ref.where('status','==','inProgress').where('project_id','==',this.project_id)
      }).snapshotChanges().pipe(
          map(actions=>{
            return actions.map(a=>{
              const data=a.payload.doc.data() as Task;
              const id=a.payload.doc.id;
              return {id,...data}
            })
          })
        )

        this.tasksDone=this.db.collection('task', ref=>{
          return ref.where('status','==','done').where('project_id','==',this.project_id)
      }).snapshotChanges().pipe(
          map(actions=>{
            return actions.map(a=>{
              const data=a.payload.doc.data() as Task;
              const id=a.payload.doc.id;
              return {id,...data}
            })
          })
        )

        this.progressSub=this.tasksInP.subscribe(item=>{
          item.forEach(i=>{
            this.inProgress.push(i);
          })
        })
        
        this.doneSub=this.tasksDone.subscribe(item=>{
          item.forEach(i=>{
            this.done.push(i);
          })
        });


      this.projectName.subscribe(item=>{
        item.forEach(i=>{
          console.log(i)
        })
      })

      this.todoSub=this.tasksTodo.subscribe(item=>{
        item.forEach(i=>{
          this.todo.push(i);
        })
      })
    }

    ngOnDestroy(){
    
    }

    //get current user name
    username=this.auth.auth.currentUser.displayName
    userid=this.auth.auth.currentUser.uid
  
    openDialog() {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '550px',
        data: {task: this.task, due:this.due,assignee:this.assignee}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.task = result.task;
        this.due= result.due;
        this.assignee=result.assignee;
        console.log(this.assignee)
        if(this.assignee){
          this.task_assigned_to=this.assignee
        }    
        if(this.task && this.due){
          this.addNewTask(this.task);
        }
      });
   }
  

   //function when a current logged in user assigns tasks to themselves
   addNewTask(task:string){
      return new Promise((resolve,reject)=>{
        this.todo=[]
        this._db
        .collection('task')
        .add({project_id:this.project_id,
              description:task,
              name:task,
              projected_end_date: formatDate(this.due,'MMMM d, y, h:mm:ss a z','en'),
              projected_start_date:formatDate(new Date(),'MMMM d, y, h:mm:ss a z','en'),
              status:"todo",
              assignee_id:this.userid,
              owner_id:this.userid,
              assignee_name:this.task_assigned_to})
        .then((obj:any)=>{
          resolve(obj);
        })
        .catch((error:any)=>{
          reject(error);
        })
      })
   }

   deleteTask(id:string,status:string){
     console.log(status);
    return new Promise((resolve,reject)=>{
      if(status=="todo"){
        this.todo=[]
      }else if(status=="inProgress"){
        this.inProgress=[]
      }else if(status=="done"){
        this.done=[]
      }
      this._db
      .collection('task')
      .doc(id)
      .delete()
      .then((obj:any)=>{
        resolve(obj);
      })
      .catch((error:any)=>{
        reject(error);
      })
    })
   }

    drop(event: CdkDragDrop<string[]>) {
        //console.log("EVENT: ");
        //console.log(event);
        var arrExample=[]
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
            
          if(this.inProgress==event.container.data){
            console.log(this.inProgress)
            for(var i=0;i<this.inProgress.length;i++){
              this._db.collection('task', ref=>{
              return ref.where(firebase.firestore.FieldPath.documentId(),'==',this.inProgress[i].id)
                }).snapshotChanges().pipe(
                map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Task;
                    const id = a.payload.doc.id;
                   return { id, ...data };
                });
              })
            ).subscribe(items=>{
              items.forEach(currTask=>{
                this.progressSub.unsubscribe()
                this.todoSub.unsubscribe()
                this.doneSub.unsubscribe()
                this._db.doc(`task/${currTask.id}`).update({status:'inProgress'});
              })
            });
            }   
          }else if (this.todo==event.container.data){
            for(var i=0;i<this.todo.length;i++){      
              this._db.collection('task', ref=>{
              return ref.where(firebase.firestore.FieldPath.documentId(),'==',this.todo[i].id)
                }).snapshotChanges().pipe(
                map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Task;
                    const id = a.payload.doc.id;
                   return { id, ...data };
                });
              })
            ).subscribe(items=>{
              items.forEach(job=>{
                this.todoSub.unsubscribe()
                this.doneSub.unsubscribe()
                this.progressSub.unsubscribe()
                this._db.doc(`task/${job.id}`).update({status:'todo'});
              })
            });
            }  
          }else if(this.done==event.container.data){
            for(var i=0;i<this.done.length;i++){
            
              this._db.collection('task', ref=>{
              return ref.where(firebase.firestore.FieldPath.documentId(),'==',this.done[i].id)
                }).snapshotChanges().pipe(
                map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Task;
                    const id = a.payload.doc.id;
                   return { id, ...data };
                });
              })
            ).subscribe(items=>{
              items.forEach(job=>{
                this.doneSub.unsubscribe()
                this.progressSub.unsubscribe()
                this.todoSub.unsubscribe()
                this._db.doc(`task/${job.id}`).update({status:'done'});
              })
            });
            }  
          }
    
          
        }
  }

}

