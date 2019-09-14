import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UdeaBombWarComponent } from './udea-bomb-war/udea-bomb-war.component';

const routes: Routes = [
  {
    path: '', component: UdeaBombWarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
