import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPlannerComponent } from './taskplanner/taskplanner.component';

const routes: Routes = [
  { path: '', redirectTo: '/grid', pathMatch: 'full' },
  { path: 'grid', component: TaskPlannerComponent, data: { text: 'TaskPlannerGrid' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
