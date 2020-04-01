import { Component } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent {
  onDialogOKSelected(args) {
    const dialog = args.dialog as IgxDialogComponent;
    dialog.close();
  }
}
