import { Component, ViewChild, EventEmitter, Output, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IgxListComponent } from '@infragistics/igniteui-angular/list';
import { IgxOverlayOutletDirective, OverlaySettings } from '@infragistics/igniteui-angular/core';
import { IgxFilterOptions, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { ITask } from '../interfaces';

import { FormsModule } from '@angular/forms';
import { IgxCardComponent, IgxCardContentDirective, IgxCardHeaderComponent, IgxCardHeaderTitleDirective } from '@infragistics/igniteui-angular/card';
import { IgxOverlayOutletDirective as IgxOverlayOutletDirective_1 } from '@infragistics/igniteui-angular/core';
import { IgxInputDirective, IgxInputGroupComponent, IgxPrefixDirective, IgxSuffixDirective } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxDataLoadingTemplateDirective, IgxEmptyListTemplateDirective, IgxListComponent as IgxListComponent_1, IgxListItemComponent, IgxListLineSubTitleDirective, IgxListLineTitleDirective } from '@infragistics/igniteui-angular/list';
import { IgxDividerDirective, IgxDragDirective, IgxDragHandleDirective, IgxFilterPipe, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';

export interface IListItemAction {
    action: string;
    issue: ITask;
}

@Component({
    selector: 'app-backlog',
    templateUrl: './backlog.component.html',
    styleUrls: ['./backlog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
    IgxCardComponent,
    IgxCardHeaderComponent,
    IgxCardHeaderTitleDirective,
    IgxDividerDirective,
    IgxCardContentDirective,
    IgxInputGroupComponent,
    FormsModule,
    IgxInputDirective,
    IgxPrefixDirective,
    IgxIconComponent,
    IgxSuffixDirective,
    IgxListComponent_1,
    IgxListItemComponent,
    IgxDragDirective,
    IgxDragHandleDirective,
    IgxListLineTitleDirective,
    IgxListLineSubTitleDirective,
    IgxDataLoadingTemplateDirective,
    IgxEmptyListTemplateDirective,
    IgxOverlayOutletDirective_1,
    IgxFilterPipe,
    IgxIconButtonDirective,
    IgxRippleDirective
]
})
export class BacklogComponent implements OnInit  {
    public tasks: ITask[];
    public dropTileId: number;
    public taskSearchString: string;
    public overlaySettings: OverlaySettings = {
        modal: false,
        closeOnOutsideClick: true
    };

    @ViewChild(IgxListComponent, { read: IgxListComponent, static: true }) public tasksList: IgxListComponent;
    @ViewChild(IgxOverlayOutletDirective, { static: true }) public outlet: IgxOverlayOutletDirective;

    @Output() listItemAction = new EventEmitter<IListItemAction>();

    @Input()
    public set data(data: ITask[]) {
        this.tasks = data;
    }

    constructor() {}

    public ngOnInit() {
        this.overlaySettings.outlet = this.outlet;
    }

    public onActionTriggered(action: string, issue: ITask) {
        const eventArgs: IListItemAction = { action, issue };
        this.listItemAction.emit(eventArgs);
    }

    public deleteItem(issue: ITask, index?: number) {
        index = index ? index : this.tasks.findIndex(rec => rec.id === issue.id);
        this.tasks.splice(index, 1);
    }

    public get filterTasks() {
        const fo = new IgxFilterOptions();
        fo.key = 'title';
        fo.inputValue = this.taskSearchString;
        return fo;
    }

    public getPriority(value: ITask) {
        const label = value.labels.filter(l => l.name.indexOf('severity:') === 0);
        if (label.length) {
            return label[0].name.substring(10).toLowerCase();
        } else {
            return 'low';
        }
    }
}
