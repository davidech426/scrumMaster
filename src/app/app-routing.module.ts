import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthenticatedViewComponent } from './components/authenticated-view/authenticated-view.component';
import { CurrentProjectViewComponent } from './components/current-project-view/current-project-view.component';

const routes: Routes = [
    {
        path: '',
        component: AuthenticatedViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'registration', 
        component: RegistrationComponent,
    },
    {
        path: 'project/:id/:role',
        component: CurrentProjectViewComponent
    }
	//{path: '**', component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
