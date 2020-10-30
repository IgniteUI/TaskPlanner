import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxDialogModule, IgxButtonModule, IgxGridModule, IgxAvatarModule, IgxIconModule,
  IgxNavbarModule, IgxDividerModule, IgxTabsModule, IgxToastModule, IgxMaskModule,
  IgxInputGroupModule, IgxButtonGroupModule, IgxSwitchModule, IgxCardModule, IgxListModule, IgxFilterModule, IgxActionStripModule } from '@infragistics/igniteui-angular';
import { TasksDataService } from './services/tasks.service';
import { TaskPlannerComponent } from './taskplanner/taskplanner.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { BacklogComponent } from './backlog/backlog.component';
import { GridWithTransactionsComponent } from './transaction-component/transaction-grid.component';
import { HttpClientModule } from '@angular/common/http';
import { StatusLabelPipe, PriorityLabelPipe, PlaceholderPipe, DeadlinePipe, ProgressPipe, LoginLabelPipe } from './pipes/taskplanner.pipes';

@NgModule({
  declarations: [
    TaskPlannerComponent,
    HeaderComponent,
    StatusLabelPipe,
    PriorityLabelPipe,
    ProgressPipe,
    PlaceholderPipe,
    DeadlinePipe,
    LoginLabelPipe,
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
    HttpClientModule,
    IgxMaskModule,
    IgxToastModule,
    IgxAvatarModule,
    IgxIconModule,
    IgxFilterModule,
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
  bootstrap: [TaskPlannerComponent]
})
export class AppModule {
}
