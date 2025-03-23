import { Routes } from '@angular/router';
import { ApplayoutComponent } from '../Components/applayout/applayout.component';
import { UsersListComponent } from '../Components/users-list/users-list.component';
import { authGuard } from '../Guards/auth.guard';
import { LoginComponent } from '../Components/login/login.component';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '', component: ApplayoutComponent, canActivate: [authGuard], children: [
            {path:'',component:DashboardComponent},
            { path: 'users', component: UsersListComponent },
            ]
    },
    {path:'login',component:LoginComponent},
];