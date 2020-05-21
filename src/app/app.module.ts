import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/** FORM BUILDING **/ 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** ROUTING, MAIN APP COMPONENTS. **/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/** FIRESTORE MODULES. **/
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

/** AUTHENTICATION COMPONENTS **/
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthenticatedViewComponent } from './components/authenticated-view/authenticated-view.component';

import { MaterialModule } from './material/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CarouselModule } from 'ngx-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


/** APP COMPONENTS **/
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { TeamProjectCreationComponent } from './components/projects-carousel/team-project-creation.component';
import { ProjectsCarouselComponent } from './components/projects-carousel/projects-carousel.component';
import { CurrentProjectViewComponent } from './components/current-project-view/current-project-view.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { ModalMemberDialog } from './components/members-list/modal-member.component'
import { DailyScrumComponent } from './components/daily-scrum/daily-scrum.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { BoardComponent } from './components/board/board.component';
import { DialogOverviewExampleDialog } from './components/board/modal.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    AuthenticatedViewComponent,
    SidebarComponent,
    HeaderComponent,
    TeamProjectCreationComponent,
    ProjectsCarouselComponent,
    CurrentProjectViewComponent,
    MembersListComponent,
    DailyScrumComponent,
    ModalMemberDialog,
    TaskListComponent,
    BoardComponent,
    DialogOverviewExampleDialog,
    CalendarComponent,
    NotificationsComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MaterialModule,
    DragDropModule,
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CarouselModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule
  ],
  entryComponents: [DialogOverviewExampleDialog, ModalMemberDialog,TeamProjectCreationComponent],
  providers: [{provide: MatDialogRef,useValue:{}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
