import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { IgxDialogModule, IgxButtonModule, IgxGridModule, IgxAvatarModule } from 'igniteui-angular';
import { TaskPlannerGridComponent } from './taskplannergrid/taskplannergrid.component';
import { DataService } from './services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DialogComponent,
    TaskPlannerGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxDialogModule,
    IgxButtonModule,
    IgxGridModule,
    IgxAvatarModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
