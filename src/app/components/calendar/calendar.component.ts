import { Component, OnInit } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Task } from '../../models/task.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Calendar imports. **/
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';

import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
} from 'angular-calendar';

const colors: any = {
    todo: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    doing: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    done: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
/** Calendar imports. **/


@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    currentUserTasks: Observable<any[]>;

    localTasks;
    view = "month";
    viewDate: Date = new Date();
    events: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    activeDayIsOpen: boolean = true;

    /* Reference to Firestore Collection*/
    taskCollection: AngularFirestoreCollection<any>;
    collection: Observable<any[]>;
    testlist = [];
    displayCalendar: boolean = false;


    constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
        
    }

    ngOnInit() {
        this.fetchTasks(); 
    }

    fetchTasks() {
        this.currentUserTasks = this.db.collection('task').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                var currColor;

                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                
                console.log("Task", data);

                if (data.status === "todo") {
                    currColor = colors.todo;
                } else if (data.status === "doing") {
                    currColor = colors.doing;
                } else {
                    currColor = colors.done;
                }


                this.events.push({
                    start: new Date(data.projected_start_date),
                    end: new Date(data.projected_end_date),
                    title: data.name,
                    color: currColor,

                    allDay: false,
                    resizable: {
                        beforeStart: true,
                        afterEnd: true
                    },
                    draggable: false
                });

                this.displayCalendar = true;

                return { id, ...data };
            }))
          );
    }

    dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
                ) {
                this.activeDayIsOpen = false;
        } else {
            this.activeDayIsOpen = true;
        }
        this.viewDate = date;
    }
    }

    handleEvent(action: string, event: CalendarEvent): void {
    }

    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    }

    setView (viewOption) {
        this.view = viewOption;
    }
}
