import { Routes } from '@angular/router';
import { IndexUsersComponent } from './index-users/index-users.component';
import { CreateUsersComponent } from './create-users/create-users.component';
import { EditUsersComponent } from './edit-users/edit-users.component';

export const routes: Routes = [
    { path: '', component: IndexUsersComponent },
    { path: 'create', component: CreateUsersComponent },
    { path: ':userId/edit', component: EditUsersComponent },
];
