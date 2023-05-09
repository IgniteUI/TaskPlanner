import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { TaskPlannerComponent } from './app/taskplanner/taskplanner.component';
import { FormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { IgxDialogModule, IgxButtonModule, IgxGridModule, IgxMaskModule, IgxToastModule, IgxAvatarModule, IgxIconModule, IgxFilterModule, IgxNavbarModule, IgxDividerModule, IgxTabsModule, IgxInputGroupModule, IgxButtonGroupModule, IgxSwitchModule, IgxCardModule, IgxListModule, IgxSelectModule, IgxDatePickerModule, IgxDragDropModule, IgxOverlayOutletDirective, IgxCheckboxModule, IgxDropDownModule, IgxToggleModule, IgxBadgeModule, IgxProgressBarModule } from '@infragistics/igniteui-angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, HammerModule, bootstrapApplication } from '@angular/platform-browser';
import { TasksDataService } from './app/services/tasks.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(TaskPlannerComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, IgxDialogModule, IgxButtonModule, IgxGridModule, IgxMaskModule, IgxToastModule, IgxAvatarModule, IgxIconModule, IgxFilterModule, IgxNavbarModule, IgxDividerModule, IgxTabsModule, IgxToastModule, FormsModule, IgxMaskModule, IgxInputGroupModule, IgxButtonGroupModule, IgxSwitchModule, IgxCardModule, IgxListModule, HammerModule, IgxSelectModule, IgxDatePickerModule, IgxDragDropModule, IgxOverlayOutletDirective, IgxCheckboxModule, IgxDropDownModule, IgxToggleModule, IgxBadgeModule, IgxProgressBarModule),
        TasksDataService,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
  .catch(err => console.error(err));
