import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { ProjFeed, UserFeed, User, MembersSubCol } from '../../models/database.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-daily-scrum',
  templateUrl: './daily-scrum.component.html',
  styleUrls: ['./daily-scrum.component.css']
})

export class DailyScrumComponent implements OnInit {

    @Input() project_id: string;

  constructor(public db: AngularFirestore) {
	  
  }
  
  // This stores the Project ID - PLACEHOLDER ID FOR NOW
  curr_project;
  selectedIndex: number = 0;
  users = [];
  date1 = null;
  date2 = null;
  
  ngOnInit() {	
      this.curr_project = this.project_id;
	this.retrieveUsers();
  }
  
  retrieveUsers() {
	  this.db.doc(`project/${this.curr_project}`).snapshotChanges().subscribe(x => {
			if(x.payload.exists) {
				 const data: UserFeed = x.payload.data() as any;
				 this.users = data.member_names;
			} 
		}
	  )
  }
  
  saveDate(type: string, event: MatDatepickerInputEvent<Date>) {
	  if(type == "date1")
		this.date1 = event.value;
	  else
		this.date2 = event.value;
  }
  
  saveSchedule() {
	  // alert("Start date: " + this.date1 + ", End date: " + this.date2);
	  
	  if(this.date1 == null || this.date2 == null) {
		  alert("Please choose a start and end date before submitting.");
	  } else if(this.date1 > this.date2) {
		  alert("The end date cannot be earlier than the start date. Please try again.");
	  } else {
		  if(confirm("This schedule will appear on all team members' calendar. Proceed?")) {
			  alert("Schedule saved!");
			  
			  // May need to add more fields
			  this.db.collection("daily_scrum_schedule").doc(this.curr_project).set({ start_date: this.date1, end_date: this.date2 }, { merge: true });
		  }
	  }
  }
  
  nextTab() {
	  if(this.selectedIndex == (this.users.length-1))
		  this.selectedIndex = 0;
	  else 
		  this.selectedIndex = this.selectedIndex + 1;
  }
  
  saveScrum(name) {
	  if(confirm("Daily scrum data for this user will be inserted into the database. Proceed?")) {
		  alert("Data recorded for " + name + "!");
		  
		  var today_date = new Date();
		  var date_id = (today_date.getMonth() + 1) + "" + today_date.getDate() + "" + today_date.getFullYear()
		  // alert(date_id);
		  
		  var since_last_meeting = (document.getElementById("last_meeting") as HTMLTextAreaElement).value;
		  var before_next_meeting = (document.getElementById("next_meeting") as HTMLTextAreaElement).value;
		  var biggest_impediments = (document.getElementById("big_prob") as HTMLTextAreaElement).value;
		  this.db.collection(`scrum_log/${this.curr_project}/${date_id}`).doc(`${name}`).set({ last_meeting: since_last_meeting, before_next: before_next_meeting, big_problems: biggest_impediments }, { merge: true });
	  }
  }
  
}
