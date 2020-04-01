import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { TaskPlannerGridComponent } from './taskplannergrid/taskplannergrid.component';

const routes: Routes = [
  { path: '', redirectTo: '/grid', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { text: 'Home' } },
  { path: 'dialog', component: DialogComponent, data: { text: 'Dialog' } },
  { path: 'grid', component: TaskPlannerGridComponent, data: { text: 'TaskPlannerGrid' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
