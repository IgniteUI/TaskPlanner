import { Component, OnInit, ViewChild, AfterViewInit, HostBinding } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import {
    DefaultSortingStrategy,
    IGridEditEventArgs,
    IgxDialogComponent,
    IgxDropDownComponent,
    IgxGridComponent,
    IgxToastComponent,
    ISelectionEventArgs,
    SortingDirection,
    Transaction,
    OverlaySettings,
    IgxOverlayOutletDirective,
    IDropDroppedEventArgs
} from 'igniteui-angular';
import { TasksDataService } from '../services/tasks.service';
import { TASKS_DATA, MEMBERS } from '../services/tasksData';
import { IgxLegendComponent } from 'igniteui-angular-charts';
import { BacklogComponent, IListItemAction } from '../backlog/backlog.component';

export enum editMode {
    cellEditing = 0,
    rowEditing = 1,
    none = 2
}

export interface ITask {
    id: number;
    issue?: string;
    isActive?: boolean;
    priority?: string;
    milestone?: string;
    description?: string;
    status?: string;
    owner?: {
      id: number;
      name: string;
      sex: string;
      team: string;
      avatar: string;
    };
    created_by?: string;
    started_on?: Date;
    deadline?: Date;
    estimation?: number;
    hours_spent?: number;
}

// tslint:disable:max-line-length
// tslint:disable:member-ordering
@Component({
    providers: [TasksDataService, { provide: ControlContainer, useExisting: NgForm }],
    selector: 'app-taskplanner',
    templateUrl: './taskplanner.component.html',
    styleUrls: ['./taskplanner.component.scss'],
})
export class TaskPlannerComponent implements OnInit, AfterViewInit {
    @HostBinding('class.tp-app')

    @ViewChild('tasksGrid', { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
    @ViewChild('editModeDropdown', { read: IgxDropDownComponent, static: true }) public editModeDropdown: IgxDropDownComponent;
    @ViewChild('legend', { static: true }) public legend: IgxLegendComponent;
    @ViewChild(IgxToastComponent, { read: IgxToastComponent, static: true }) public toast: IgxToastComponent;
    @ViewChild('addTaskDialog', { static: true }) public addTaskDialog: IgxDialogComponent;
    @ViewChild('editTaskDialog', { static: true }) public editTaskDialog: IgxDialogComponent;
    @ViewChild('transactionsDialog', { static: true }) public transactionsDialog: IgxDialogComponent;
    @ViewChild('transactionsGrid', { static: true }) public transactionsGrid: IgxGridComponent;
    @ViewChild('batchEditingGrid', { static: true }) public batchEditingGrid: IgxGridComponent;
    @ViewChild('batchEditDialog', { static: true }) public batchEditDialog: IgxDialogComponent;

    @ViewChild(IgxOverlayOutletDirective, { static: true }) public outlet: IgxOverlayOutletDirective;
    @ViewChild(BacklogComponent, { read: BacklogComponent, static: true }) public backlog: BacklogComponent;

    public darkTheme = true;
    public tasks: ITask[];
    public teamMembers: any[];
    public editMode = 0;
    public editModes = ['Cell Editing', 'Row Editing', 'No Editing'];
    public addTaskForm = {} as ITask;
    public editTaskForm = {} as ITask;
    public transactionsData: Transaction[] = [];
    public allTasks = TASKS_DATA;
    public batchEditingData: any[];
    public inputType = 'material';

    public statuses = [
        {
            value: 'New'
        },
        {
            value: 'In Progress'
        },
        {
            value: 'Done'
        },
        {
            value: 'Delayed'
        }
    ];

    public priority = [
        { value: 'Low' },
        { value: 'Normal' },
        { value: 'High' },
        { value: 'Critical' }
    ];

    public dialogOverlaySettings: OverlaySettings = {
        modal: true,
        closeOnOutsideClick: true
    };

    public overlaySettings: OverlaySettings = {
        modal: false,
        closeOnOutsideClick: true
    };

    /**
     * Calculates task progress.
     */
    public calcProgress = calcProgress;

    private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
    private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });

    public toggleTheme() {
      this.darkTheme = !this.darkTheme;
      this.inputType = this.darkTheme ? 'material' : 'fluent';
    }

    // TODO Make Pipe from the filterTasks function
    public filterTasks(groupRowValue: string) {
        const groupedData = this.grid.data.filter(rec => rec.milestone === groupRowValue);
        return groupedData.reduce((acc, val) => {
            // Return task status without whitespace in order to be used for class name
            const cssClass = val.status.replace(/\s/g, '').toLowerCase();
            const itemIndex = acc.findIndex(item => item.name === val.status);

            if (itemIndex === -1) {
                acc.push({
                    name: val.status,
                    items: 1,
                    cssClass
                });

                return acc;
            }

            acc[itemIndex].items = acc[itemIndex].items + 1;
            return acc;
        }, []);
    }

    public isDone = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'Done';
    }

    public isNew = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'New';
    }

    public isInProgress = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'In Progress';
    }

    public isLate = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'Delayed';
    }

    public isCritical = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'Critical';
    }

    public isLow = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'Low';
    }

    public isHigh = (rowData: any, columnKey: any): boolean => {
        return rowData[columnKey] === 'High';
    }

    public isDelayed = (rowData: ITask, columnKey: string): boolean => {
        return rowData.hours_spent > rowData.estimation;
    }

    public statusClasses = {
        done: this.isDone,
        new: this.isNew,
        inprogress: this.isInProgress,
        delayed: this.isLate
    };

    public priorityClasses = {
        critical: this.isCritical,
        low: this.isLow,
        high: this.isHigh
    };

    public delayedClasses = {
        delayed: this.isDelayed
    };

    public milestoneSort = MilestoneSortingStrategy.instance();
    public progressSort = ProgressSortingStrategy.instance();

    public columns: any[] = [
        { field: 'id', header: 'ID', width: '120px', dataType: 'number', formatter: this.formatID },
        { field: 'milestone', header: 'Milestone', width: '120px', dataType: 'string', resizable: true, groupable: false, editable: true, sortable: true, sortStrategy: this.milestoneSort},
        { field: 'issue', header: 'Issue', width: '380px', dataType: 'string', resizable: true, filterable: false, editable: true},
        { field: 'status', header: 'Status', width: '130px', dataType: 'string', resizable: true, sortable: true, filterable: false, editable: true, cellClasses: this.statusClasses, sortStrategy: this.progressSort },
        { field: 'progress', header: 'Progress', width: '95px', dataType: 'number', resizable: true, sortable: false },
        { field: 'owner', header: 'Owner', width: '180px', dataType: 'string', resizable: true, editable: true, sortable: true, filterable: true },
        { field: 'created_by', header: 'Created By', width: '180px', dataType: 'string', resizable: true, sortable: true, filterable: true, editable: false, hidden: true },
        { field: 'started_on', header: 'Started on', width: '130px', dataType: 'date', resizable: true, sortable: true, filterable: true, editable: true },
        { field: 'deadline', header: 'Deadline', width: '130px', dataType: 'date', resizable: true, sortable: false, filterable: true, editable: true },
        { field: 'estimation', header: 'Estimation', width: '120px', dataType: 'number', resizable: true, sortable: false, filterable: false, editable: true, columnGroup: true, formatter: this.formatHours, cellClasses: this.delayedClasses },
        { field: 'hours_spent', header: 'Hours Spent', width: '120px', dataType: 'number', resizable: true, sortable: false, filterable: false, editable: true, columnGroup: true, formatter: this.formatHours, cellClasses: this.delayedClasses },
        { field: 'priority', header: 'Priority', width: '125px', dataType: 'string', resizable: true, sortable: true, filterable: true, editable: true, cellClasses: this.priorityClasses }
    ];

    constructor(private dataService: TasksDataService) {  }

    public ngOnInit() {
        this.overlaySettings.outlet = this.outlet;
        this.dialogOverlaySettings.outlet = this.outlet;
        this.dataService.getAssignedTasks().subscribe(data => this.tasks = data);
        this.teamMembers = MEMBERS;

        this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
        this.grid.transactions.onStateUpdate.subscribe(() => {
            this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
        });

        this.grid.groupingExpressions = [{
            dir: SortingDirection.Asc,
            fieldName: 'milestone',
            ignoreCase: false,
            strategy: this.milestoneSort
        }];

        this.grid.groupingExpansionState = [{
            expanded: false,
            hierarchy: [{ fieldName: 'milestone', value: 'Q2 2020'}]
        }, {
            expanded: true,
            hierarchy: [{ fieldName: 'milestone', value: 'Q1 2020'}]
        }, {
            expanded: false,
            hierarchy: [{ fieldName: 'milestone', value: 'Q4 2019'}]
        }];
    }

    public ngAfterViewInit() {
        this.grid.hideGroupedColumns = true;
        this.editMode = 0;
    }

    public addTask(event: any) {
        this.addTaskForm.id = this.grid.data[this.grid.data.length - 1].id + 1;
        this.addTaskForm.status = 'New';
        this.addTaskForm.estimation = null;
        this.addTaskForm.hours_spent = null;
        this.grid.addRow(this.addTaskForm);
        this.addTaskDialog.close();
    }

    public editTask(event: any) {
        this.addBacklogItem(this.editTaskForm);
        this.editTaskDialog.close();
    }

    public getStartedOn(dataItem: ITask): boolean {
        return !!dataItem.started_on;
    }

    public deleteTask(rowID) {
        this.grid.deleteRow(rowID);
    }

    public formatDate = (date: Date) => {
        return `${this.dayFormatter.format(date)}, ${date.getDate()} ${this.monthFormatter.format(date)}, ${date.getFullYear()}`;
      }

    public formatID(value: number): string {
        return '#' + value;
    }

    public undo() {
        this.grid.transactions.undo();
    }

    public redo() {
        this.grid.transactions.redo();
    }

    public openCommitDialog() {
        this.transactionsDialog.open(this.dialogOverlaySettings);
        this.transactionsGrid.reflow();
    }

    public commit() {
        this.grid.transactions.commit(this.tasks);
        this.transactionsDialog.close();
    }

    public commitBatchEdits() {
        const editedData = this.batchEditingGrid.data;
        // transfer edited data to this.grid
        for (let i = 0; i < editedData.length; i++) {
            const id = editedData[i].id;
            this.grid.updateRow(editedData[i], id);
        }
        this.batchEditDialog.close();
    }

    public cancel() {
        this.transactionsDialog.close();
    }

    public discard() {
        this.grid.transactions.clear();
        this.transactionsDialog.close();
    }

    public stateFormatter(value) {
        return JSON.stringify(value);
    }

    public typeFormatter(value) {
        return value.toUpperCase();
    }

    public classFromType(type: string): string {
        return `transaction--${type.toLowerCase()}`;
    }

    public formatHours(value: number): string {
        return value ? value + 'h' : '';
    }

    public onEditingModeChanged(event: ISelectionEventArgs) {
       this.editMode = event.newSelection.index;
    }

    public isEditModeSelected(i: number): boolean {
        return i === this.editMode;
    }

    public openAddTaskDialog() {
        this.addTaskDialog.open(this.dialogOverlaySettings);
    }

    public onBacklogItemAction(event: IListItemAction) {
        switch (event.action) {
            case 'edit': {
                this.editTaskForm = event.issue;
                this.editTaskDialog.open(this.dialogOverlaySettings);
                break;
            }
             case 'drag':
             case 'release': {
                this.editTaskForm = event.issue;
                this.toggleGridBodyHighlight();
                break;
             }
         }
    }

    /**
     * Returns workload for corresponding team member.
     */
    public getAssigneeWorkload(ownerID: number) {
        const workloadData = this.tasks.filter(rec => rec.owner.id === ownerID);
        const newTasks = workloadData.filter(rec => rec.status === 'New').length;
        const inprogressTasks = workloadData.filter(rec => rec.status === 'In Progress').length;
        const doneTasks = workloadData.filter(rec => rec.status === 'Done').length;

        return [
            { Label: 'In Progress', Value: inprogressTasks },
            { Label: 'Done', Value: doneTasks },
            { Label: 'New', Value: newTasks }];
    }

    /**
     * Returns workload for the corrssponding team.
     */
    public getTeamWorkload(team: string) {
        const workloadData = this.tasks.filter(rec => rec.owner.team === team);
        const newTasks = workloadData.filter(rec => rec.status === 'New').length;
        const inprogressTasks = workloadData.filter(rec => rec.status === 'In Progress').length;
        const doneTasks = workloadData.filter(rec => rec.status === 'Done').length;

        return [
            { Label: 'In Progress', Value: inprogressTasks },
            { Label: 'Done', Value: doneTasks },
            { Label: 'New', Value: newTasks }];
    }

    public formatPieLabel(args): string {
        return args.item.Value + ' ' + args.item.Label;
    }

    public formatDateLabel(item: any): string {
        return item.date.toLocaleDateString(undefined, { month: 'short' });
    }

    public editStart(event: IGridEditEventArgs) {
        const field = this.grid.columnList.find(c => c.index === event.cellID.columnID).field;
        if (field === 'started_on' && !!event.oldValue) {
            event.cancel = true;
        }
    }

    public onCellEdit(event: IGridEditEventArgs) {
        const field = this.grid.columnList.find(c => c.index === event.cellID.columnID).field;
        switch (field) {
            case 'started_on': {
                const deadlineDate = this.grid.getRowByKey(event.rowID).rowData.deadline;
                if (event.newValue > deadlineDate) {
                    event.cancel = true;
                    this.toast.message = 'Started date cannot exceed Deadline date !';
                    this.toast.show();
                }
                break;
            }
            case 'deadline': {
                const startedDate = this.grid.getRowByKey(event.rowID).rowData.started_on;
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast.message = 'Deadline date cannot be earlier than started date !';
                    this.toast.show();
                }
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast.message = 'Deadline date cannot be earlier than started date !';
                    this.toast.show();
                }
                break;
            }
            case 'status': {
                if (event.newValue === 'Completed') {
                    this.grid.getRowByKey(event.rowID).rowData.isActive = false;
                }
            }
        }
    }

    public openBatchEditDialog() {
        const selectedRows = this.grid.selectedRows();
        const selectedData = this.tasks.filter(rec => selectedRows.indexOf(rec.id) > -1);
        this.batchEditingData = selectedData;
        this.batchEditDialog.open(this.dialogOverlaySettings);
    }

    public onDropContainerEnterLeave(event: IDropDroppedEventArgs) {
        this.toggleGroupRowHighlight();
    }

    public toggleGroupRowHighlight() {
        const groupRows = this.grid.tbody.nativeElement.querySelectorAll('igx-grid-groupby-row');
        (groupRows as HTMLElement[]).forEach(element => {
            const childEl = element.children[1].children[0].children[0] as HTMLElement;
            if (childEl.innerText === this.editTaskForm.milestone) {
                element.classList.toggle('tp-app__groupby-row-highlight');
            }
        });
    }

    public toggleGridBodyHighlight() {
        this.grid.tbody.nativeElement.classList.toggle('tp-app__drop-area-entered');
    }

    public onItemDropped(ev) {
        this.toggleGridBodyHighlight();
        this.addBacklogItem(this.editTaskForm);
    }

    public addBacklogItem(item: ITask) {
        this.grid.addRow(item);
        this.backlog.deleteItem(item);
    }

    public get undoEnabled(): boolean {
        return this.grid.transactions.canUndo;
    }

    public get redoEnabled(): boolean {
        return this.grid.transactions.canRedo;
    }

    public get hasTransactions(): boolean {
        return this.grid.transactions.getAggregatedChanges(false).length > 0;
    }

    public get hasSelection(): boolean {
        return this.grid.selectedRows().length > 0;
    }

    public get isRowEditingEnabled() {
        return this.editMode === editMode.rowEditing;
    }

    public get isEditingEnabled() {
        return this.editMode !== editMode.none;
    }

    public get selectedEditMode() {
        return this.editModes[this.editMode];
    }

    private monthsLength(startDate, endDate): number {
        const monthsDelta = (endDate.getFullYear()
            - startDate.getFullYear()) * 12
            + (endDate.getMonth() - startDate.getMonth());
        return monthsDelta;
    }
}

/**
 * Sorting strategy for year quarters.
 */
export class MilestoneSortingStrategy extends DefaultSortingStrategy {
    protected compareObjects(obj1: object,
                             obj2: object,
                             key: string,
                             reverse: number,
                             ignoreCase: boolean,
                             valueResolver: (obj: any, key: string) => any) {

        const objA = valueResolver(obj1, key).split(' ');
        const objB = valueResolver(obj2, key).split(' ');

        const yearA = objA[1];
        const yearB = objB[1];

        const quarterA = objA[0].slice(-1);
        const quarterB = objB[0].slice(-1);

        const milestoneA = parseInt(yearA + quarterA, 10);
        const milestoneB = parseInt(yearB + quarterB, 10);

        return reverse * this.compareValues(milestoneA, milestoneB);
    }
}

/**
 * Sorting strategy for prorgess columns.
 */
export class ProgressSortingStrategy extends DefaultSortingStrategy {
    protected compareObjects(obj1: object,
                             obj2: object,
                             key: string,
                             reverse: number,
                             ignoreCase: boolean,
                             valueResolver: (obj: any, key: string) => any) {

        const progressA = calcProgress(obj1);
        const progressB = calcProgress(obj2);

        return reverse * this.compareValues(progressA, progressB);
    }
}

/**
 * Calculates task progress.
 */
export function calcProgress(task: ITask) {
    const progress = (task.hours_spent / task.estimation) * 100;
    return progress;
}
// tslint:enable:max-line-length
// tslint:enable:member-ordering
