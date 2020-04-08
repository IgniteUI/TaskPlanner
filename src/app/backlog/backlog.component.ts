import {Component, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { IgxInputDirective, IgxListComponent, IgxListItemComponent } from 'igniteui-angular';
import { TASKS_DATA } from '../services/tasksData';
import { ITask } from '../taskplanner/taskplanner.component';

@Component({
    selector: 'app-backlog',
    templateUrl: './backlog.component.html',
    styleUrls: ['./backlog.component.scss'],
})
export class BacklogComponent  {
    public issues = TASKS_DATA.filter(rec => !rec.owner.id);
    public dropTileId: number;
    public backlogElement = this.elementRef.nativeElement;

    @ViewChild('taskSearch', { read: IgxInputDirective, static: true }) public searchInput: IgxInputDirective;
    @ViewChild(IgxListComponent, { read: IgxListComponent, static: true }) public tasksList: IgxListComponent;

    @Output() taskEditAction = new EventEmitter<any>();

    constructor(private elementRef: ElementRef) {}

    public clearSearchInput() {
        this.searchInput.value = '';
    }

    public onEditIconClicked(action: string, i: number, issue: ITask) {
        this.taskEditAction.emit({ action, issue, index: i });
    }

    public dragEndHandler(dragRef: IgxListItemComponent) {
        const listElement = dragRef.element;
        listElement.style.visibility = 'visible';
    }

    public ghostCreateHandler(dragRef: IgxListItemComponent, issue: ITask, i: number) {
        this.taskEditAction.emit({ action: 'drag', issue, index: i });
        const listElement = dragRef.element;
        listElement.style.visibility = 'hidden';
    }
}
