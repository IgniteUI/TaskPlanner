import { enableProdMode, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';


import { environment } from './environments/environment';
import { TaskPlannerComponent } from './app/taskplanner/taskplanner.component';
import { FormsModule } from '@angular/forms';
import { withInterceptorsFromDi, provideHttpClient, withXhr } from '@angular/common/http';
import { IgxDialogModule } from '@infragistics/igniteui-angular/dialog';
import { IgxButtonModule, IgxDividerModule, IgxDragDropModule, IgxFilterModule, IgxMaskModule, IgxToggleModule } from '@infragistics/igniteui-angular/directives';
import { IgxGridModule } from '@infragistics/igniteui-angular/grids/grid';
import { IgxToastModule } from '@infragistics/igniteui-angular/toast';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxNavbarModule } from '@infragistics/igniteui-angular/navbar';
import { IgxTabsModule } from '@infragistics/igniteui-angular/tabs';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonGroupModule } from '@infragistics/igniteui-angular/button-group';
import { IgxSwitchModule } from '@infragistics/igniteui-angular/switch';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxListModule } from '@infragistics/igniteui-angular/list';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
import { IgxDatePickerModule } from '@infragistics/igniteui-angular/date-picker';
import { IgxOverlayOutletDirective } from '@infragistics/igniteui-angular/core';
import { IgxCheckboxModule } from '@infragistics/igniteui-angular/checkbox';
import { IgxDropDownModule } from '@infragistics/igniteui-angular/drop-down';
import { IgxBadgeModule } from '@infragistics/igniteui-angular/badge';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(TaskPlannerComponent, {
    providers: [
        provideZonelessChangeDetection(),importProvidersFrom(BrowserModule, AppRoutingModule, IgxDialogModule, IgxButtonModule, IgxGridModule, IgxMaskModule, IgxToastModule, IgxAvatarModule, IgxIconModule, IgxFilterModule, IgxNavbarModule, IgxDividerModule, IgxTabsModule, IgxToastModule, FormsModule, IgxMaskModule, IgxInputGroupModule, IgxButtonGroupModule, IgxSwitchModule, IgxCardModule, IgxListModule, IgxSelectModule, IgxDatePickerModule, IgxDragDropModule, IgxOverlayOutletDirective, IgxCheckboxModule, IgxDropDownModule, IgxToggleModule, IgxBadgeModule, IgxProgressBarModule),
        provideAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
    ]
})
  .catch(err => console.error(err));
