import { Component } from '@angular/core';
import { IgxGridTransaction, IgxTransactionService } from 'igniteui-angular';

@Component({
    providers: [/* Injection token 'IgxGridTransaction' has been deprecated. Please refer to the update guide for more details. */
/* Injection token 'IgxGridTransaction' has been deprecated. Please refer to the update guide for more details. */
{ provide: IgxGridTransaction, useClass: IgxTransactionService }],    selector: 'app-grid-transactions',
    template: '<ng-content></ng-content>'
})
export class GridWithTransactionsComponent { }
