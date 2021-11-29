import { Component } from '@angular/core';
import { IgxTransactionService } from 'igniteui-angular';

@Component({
selector: 'app-grid-transactions',
template: `<igx-grid [data]="data" [batchEditing]="true">
</igx-grid>`
})
export class GridWithTransactionsComponent { data = []}
