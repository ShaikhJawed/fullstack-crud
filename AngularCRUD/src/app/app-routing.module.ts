import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeEntryComponent } from './employee-entry/employee-entry.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path:'', component:HomeComponent, canActivate:[AuthGuard]},
  {path:'login', component:LoginComponent},
  {path:'employee', component:EmployeeComponent, children:[
    {path:'', component:EmployeeListComponent},
    {path:'create', component:EmployeeEntryComponent},
    {path:'edit/:id', component:EmployeeEntryComponent}
  ], canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
