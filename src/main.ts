import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { TaskPlannerComponent } from './app/taskplanner/taskplanner.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(TaskPlannerComponent, appConfig)
    .catch(err => console.error(err));
