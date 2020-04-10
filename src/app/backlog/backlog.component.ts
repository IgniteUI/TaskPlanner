import {Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { IgxInputDirective, IgxListComponent, IgxOverlayOutletDirective, OverlaySettings } from 'igniteui-angular';
import { TASKS_DATA } from '../services/tasksData';
import { ITask } from '../taskplanner/taskplanner.component';

export interface IListItemAction {
    action: string;
    issue: ITask;
    index?: number;
}

@Component({
    selector: 'app-backlog',
    templateUrl: './backlog.component.html',
    styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent implements OnInit  {
    public issues = TASKS_DATA.filter(rec => !rec.owner.id);
    public dropTileId: number;
    public overlaySettings: OverlaySettings = {
        modal: false,
        closeOnOutsideClick: true
    };

    @ViewChild('taskSearch', { read: IgxInputDirective, static: true }) public searchInput: IgxInputDirective;
    @ViewChild(IgxListComponent, { read: IgxListComponent, static: true }) public tasksList: IgxListComponent;
    @ViewChild(IgxOverlayOutletDirective, { static: true }) public outlet: IgxOverlayOutletDirective;

    @Output() listItemAction = new EventEmitter<IListItemAction>();

    constructor() {}

    public ngOnInit() {
        this.overlaySettings.outlet = this.outlet;
    }

    public clearSearchInput() {
        this.searchInput.value = '';
    }

    public onActionTriggered(action: string, issue: ITask) {
        const eventArgs: IListItemAction = { action, issue };
        this.listItemAction.emit(eventArgs);
    }

    public deleteItem(issue: ITask, index?: number) {
        index = index ? index : this.issues.findIndex(rec => rec.id === issue.id);
        this.issues.splice(index, 1);
    }
}
