import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxDialogModule, IgxButtonModule, IgxGridModule, IgxAvatarModule, IgxIconModule, IgxNavbarModule, IgxDividerModule, IgxTabsModule, IgxToastModule, IgxMaskModule, IgxInputGroupModule, IgxButtonGroupModule, IgxSwitchModule, IgxCardModule, IgxListModule } from 'igniteui-angular';
import { TasksDataService } from './services/tasks.service';
import { TaskPlannerComponent } from './taskplanner/taskplanner.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { BacklogComponent } from './backlog/backlog.component';
import { GridWithTransactionsComponent } from './transaction-component/transaction-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskPlannerComponent,
    HeaderComponent,
    BacklogComponent,
    GridWithTransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxDialogModule,
    IgxButtonModule,
    IgxGridModule,
    IgxMaskModule,
    IgxToastModule,
    IgxAvatarModule,
    IgxIconModule,
    IgxNavbarModule,
    IgxDividerModule,
    IgxTabsModule,
    IgxToastModule,
    FormsModule,
    IgxMaskModule,
    IgxInputGroupModule,
    IgxButtonGroupModule,
    IgxSwitchModule,
    IgxCardModule,
    IgxListModule,
    HammerModule
  ],
  providers: [TasksDataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
