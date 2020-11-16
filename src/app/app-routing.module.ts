import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPlannerComponent } from './taskplanner/taskplanner.component';

const routes: Routes = [
  { path: '', component: TaskPlannerComponent, data: { text: 'TaskPlannerGrid' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
