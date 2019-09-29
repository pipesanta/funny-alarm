import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmListComponent } from './alarm-list/alarm-list.component';


const routes: Routes = [
  {
    path: '', component: AlarmListComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
