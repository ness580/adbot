import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { ComputerListComponent } from './components/computer-list/computer-list.component';
import { OuListComponent } from './components/ous/ou-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'users', 
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'groups', 
    component: GroupListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'computers', 
    component: ComputerListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'ous', 
    component: OuListComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];