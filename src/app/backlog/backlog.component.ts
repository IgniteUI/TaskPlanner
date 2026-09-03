import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { IgxFilterOptions, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { ITask } from '../interfaces';

import { FormsModule } from '@angular/forms';
import { IgxCardComponent, IgxCardContentDirective, IgxCardHeaderComponent, IgxCardHeaderTitleDirective } from '@infragistics/igniteui-angular/card';
import { IgxDividerComponent, IgxDragDirective, IgxDragHandleDirective, IgxFilterPipe } from '@infragistics/igniteui-angular/directives';
import { IgxInputDirective, IgxInputGroupComponent, IgxPrefixDirective, IgxSuffixDirective } from '@infragistics/igniteui-angular/input-group';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxDataLoadingTemplateDirective, IgxEmptyListTemplateDirective, IgxListComponent as IgxListComponent_1, IgxListItemComponent, IgxListLineSubTitleDirective, IgxListLineTitleDirective } from '@infragistics/igniteui-angular/list';
import { IgxOverlayOutletDirective as IgxOverlayOutletDirective_1 } from '@infragistics/igniteui-angular/core';

export interface IListItemAction {
    action: string;
    issue: ITask;
}

@Component({
    selector: 'app-backlog',
    templateUrl: './backlog.component.html',
    styleUrls: ['./backlog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
    IgxCardComponent,
    IgxCardHeaderComponent,
    IgxCardHeaderTitleDirective,
    IgxDividerComponent,
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
    IgxIconButtonDirective
]
})
export class BacklogComponent {
    public readonly data = input<ITask[]>([]);

    public readonly listItemAction = output<IListItemAction>();

    /**
     * Local writable view of the incoming list. `deleteItem` used to `splice()`
     * the parent's array in place; `igxFilter` is a pure pipe, so it memoised on
     * the unchanged array reference and the removed task stayed on screen.
     * Replacing the reference makes the pipe re-run and notifies Angular.
     */
    public readonly tasks = linkedSignal(() => this.data());

    public readonly taskSearchString = signal('');

    public readonly filterTasks = computed(() => {
        const fo = new IgxFilterOptions();
        fo.key = 'title';
        fo.inputValue = this.taskSearchString();
        return fo;
    });

    public onActionTriggered(action: string, issue: ITask): void {
        this.listItemAction.emit({ action, issue });
    }

    /** Called from this template and from TaskPlannerComponent on grid drop. */
    public deleteItem(issue: ITask, index?: number): void {
        this.tasks.update(tasks => {
            const at = index ?? tasks.findIndex(rec => rec.id === issue.id);
            if (at < 0) {
                return tasks;
            }
            return [...tasks.slice(0, at), ...tasks.slice(at + 1)];
        });
    }

    public getPriority(value: ITask): string {
        const label = (value.labels ?? []).filter(l => l.name.indexOf('severity:') === 0);
        return label.length ? label[0].name.substring(10).toLowerCase() : 'low';
    }
}
