import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';
import { ControlContainer, NgForm, FormsModule } from '@angular/forms';
import {
    DefaultSortingStrategy,
    IGridEditEventArgs,
    IgxDialogComponent,
    IgxDropDownComponent,
    IgxGridComponent,
    IgxToastComponent,
    ISelectionEventArgs,
    Transaction,
    OverlaySettings,
    IgxOverlayOutletDirective,
    IDropDroppedEventArgs,
    DateRangeType,
    FilteringStrategy,
    IgxColumnComponent,
    IFilteringExpressionsTree,
    IFilteringExpression,
    CellType,
    SortingDirection,
    ISortingOptions,
    IgxIconButtonDirective
} from 'igniteui-angular';
import { TasksDataService } from '../services/tasks.service';
import { MEMBERS, GITHUB_TASKS } from '../services/tasksData';
import { IgxLegendComponent } from 'igniteui-angular-charts';
import { BacklogComponent, IListItemAction } from '../backlog/backlog.component';
import { ITask, ITeamMember } from '../interfaces';
import { StatusLabelPipe, PriorityLabelPipe, MilestonePipe, PlaceholderPipe, DeadlinePipe, FilterTasksPipe } from '../pipes/taskplanner.pipes';
import { DatePipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { IgxGridComponent as IgxGridComponent_1, IgxDropDirective, IgxPaginatorComponent, IgxGridToolbarComponent, IgxGridToolbarTitleComponent, IgxGridToolbarActionsComponent, IgxGridToolbarHidingComponent, IgxGridToolbarPinningComponent, IgxGridToolbarExporterComponent, IgxButtonDirective, IgxIconComponent, IgxToggleActionDirective, IgxDropDownItemNavigationDirective, IgxDropDownComponent as IgxDropDownComponent_1, IgxDropDownItemComponent, IgxGridDetailTemplateDirective, IgxInputGroupComponent, IgxInputDirective, IgxCheckboxComponent, IgxGroupByRowTemplateDirective, IgxBadgeComponent, IgxColumnComponent as IgxColumnComponent_1, IgxColumnRequiredValidatorDirective, IgxColumnMinLengthValidatorDirective, IgxCellTemplateDirective, IgxCellEditorTemplateDirective, IgxSelectComponent, IgxSelectItemComponent, IgxAvatarComponent, IgxLinearProgressBarComponent, IgxSummaryTemplateDirective, IgxToastComponent as IgxToastComponent_1, IgxOverlayOutletDirective as IgxOverlayOutletDirective_1, IgxDialogComponent as IgxDialogComponent_1, IgxLabelDirective, IgxMaskDirective, IgxDatePickerComponent, IgxPrefixDirective } from '@infragistics/igniteui-angular';
import { HeaderComponent } from '../header/header.component';

export enum editMode {
    cellEditing = 0,
    rowEditing = 1,
    none = 2
}

// tslint:disable:max-line-length
// tslint:disable:member-ordering
@Component({
    providers: [TasksDataService, DatePipe, { provide: ControlContainer, useExisting: NgForm }],
    selector: 'app-taskplanner',
    templateUrl: './taskplanner.component.html',
    styleUrls: ['./taskplanner.component.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        BacklogComponent,
        IgxGridComponent_1,
        IgxDropDirective,
        IgxPaginatorComponent,
        IgxGridToolbarComponent,
        IgxGridToolbarTitleComponent,
        IgxGridToolbarActionsComponent,
        IgxGridToolbarHidingComponent,
        IgxGridToolbarPinningComponent,
        IgxGridToolbarExporterComponent,
        IgxButtonDirective,
        IgxIconComponent,
        IgxToggleActionDirective,
        IgxDropDownItemNavigationDirective,
        IgxDropDownComponent_1,
        NgFor,
        IgxDropDownItemComponent,
        IgxGridDetailTemplateDirective,
        IgxInputGroupComponent,
        FormsModule,
        IgxInputDirective,
        IgxCheckboxComponent,
        IgxGroupByRowTemplateDirective,
        IgxBadgeComponent,
        IgxColumnComponent_1,
        IgxColumnRequiredValidatorDirective,
        IgxColumnMinLengthValidatorDirective,
        NgIf,
        IgxCellTemplateDirective,
        IgxCellEditorTemplateDirective,
        IgxSelectComponent,
        IgxSelectItemComponent,
        IgxAvatarComponent,
        IgxLinearProgressBarComponent,
        IgxSummaryTemplateDirective,
        IgxToastComponent_1,
        IgxOverlayOutletDirective_1,
        IgxDialogComponent_1,
        IgxLabelDirective,
        IgxMaskDirective,
        IgxDatePickerComponent,
        IgxPrefixDirective,
        PercentPipe,
        DatePipe,
        StatusLabelPipe,
        PriorityLabelPipe,
        PlaceholderPipe,
        DeadlinePipe,
        FilterTasksPipe,
        IgxIconButtonDirective
    ],
})
export class TaskPlannerComponent implements OnInit {
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
    public unassignedTasks: ITask[];
    public teamMembers: ITeamMember[];
    public editMode = 0;
    public editModes = ['Cell Editing', 'Row Editing', 'No Editing'];
    public addTaskForm = {} as ITask;
    public editTaskForm = {} as ITask;
    public transactionsData: Transaction[] = [];
    public batchEditingData: ITask[];
    public inputType = 'material';
    public selectOptions = [5, 15, 20, 50];
    public disabledDates = [{
        dateRange: [new Date()],
        type: DateRangeType.Before
    }];
    public gridIsLoading = true;

    public statuses = [
        {
            value: 'in-review'
        },
        {
            value: 'in-development'
        },
        {
            value: 'resolved'
        },
        {
            value: 'not-a-bug'
        }
    ];

    public priority = [
        { value: 'low' },
        { value: 'medium' },
        { value: 'high' },
        { value: 'critical' }
    ];

    public dialogOverlaySettings: OverlaySettings = {
        modal: true,
        closeOnOutsideClick: true
    };

    public overlaySettings: OverlaySettings = {
        modal: false,
        closeOnOutsideClick: true
    };

    public sortingOptions: ISortingOptions = {
      mode: 'single'
    };

    public calcProgress = calcProgress;
    private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
    private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });

    /** IgxGrid cellClasses / cellStyles. */
    public isResolved = (rowData: ITask, columnKey: string): boolean => {
        return this.getStatusLabel(rowData.labels) === 'resolved';
    }

    public isNew = (rowData: ITask, columnKey: string): boolean => {
        return this.getStatusLabel(rowData.labels) === 'in-review';
    }

    public isInDevelopment = (rowData: ITask, columnKey: string): boolean => {
        return this.getStatusLabel(rowData.labels) === 'in-development';
    }

    public notABug = (rowData: ITask, columnKey: string): boolean => {
        return this.getStatusLabel(rowData.labels) === 'not-a-bug';
    }

    public isCritical = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey] === 'critical';
    }

    public isLow = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey] === 'low';
    }

    public isHigh = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey] === 'high';
    }

    public isDelayed = (rowData: ITask, columnKey: string): boolean => {
        return rowData.hours_spent > rowData.estimation;
    }

    public statusClasses = {
        resolved: this.isResolved,
        inreview: this.isNew,
        indevelopment: this.isInDevelopment,
        notabug: this.notABug
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
    public filterStrategy = LabelsFilteringStrategy.instance();
    public statusSort = StatusSortingStrategy.instance();
    public defaultSort = DefaultSortingStrategy.instance();

    public columns: any[] = [
        { field: 'pullRequest', header: 'Type', width: '120px', dataType: 'string', filterable: true, hidden: true, sortStrategy: this.defaultSort },
        { field: 'number', header: 'ID', width: '120px', dataType: 'number', formatter: this.formatID, sortable: false, sortStrategy: this.defaultSort },
        { field: 'title', header: 'Issue', width: '380px', dataType: 'string', filterable: true, editable: true, sortStrategy: this.defaultSort, required: true, minlength: 4 },
        { field: 'milestone', header: 'Milestone', width: '120px', dataType: 'string', editable: true, sortable: true, sortStrategy: this.milestoneSort, hidden: true, },
        { field: 'labels', header: 'Status', width: '130px', dataType: 'string', sortable: true, filterable: true, editable: true, cellClasses: this.statusClasses, sortStrategy: this.statusSort },
        { field: 'assignee.login', header: 'Assignee', width: '180px', dataType: 'string', editable: true, filterable: true, sortable: true, sortStrategy: this.defaultSort },
        { field: 'createdAt', header: 'Created', width: '130px', dataType: 'date', sortable: true, filterable: true, editable: false, sortStrategy: this.defaultSort, hasSummary: true  },
        { field: 'deadline', header: 'Deadline', width: '130px', dataType: 'date', sortable: true, filterable: true, editable: true, sortStrategy: this.defaultSort },
        { field: 'estimation', header: 'Estimation', width: '120px', dataType: 'number', editable: true, cellClasses: this.delayedClasses, sortStrategy: this.defaultSort },
        { field: 'hours_spent', header: 'Hours Spent', width: '120px', dataType: 'number', editable: true, cellClasses: this.delayedClasses, sortStrategy: this.defaultSort },
        { field: 'progress', header: 'Progress', width: '95px', dataType: 'number', sortable: true, sortStrategy: this.progressSort },
        { field: 'priority', header: 'Priority', width: '125px', dataType: 'string', sortable: true, filterable: true, editable: true, cellClasses: this.priorityClasses, sortStrategy: this.defaultSort }
    ];
    private _filteringStrategy = new FilteringStrategy();

    constructor(private datePipe: DatePipe) { }

    public ngOnInit() {
        this.overlaySettings.outlet = this.outlet;
        this.dialogOverlaySettings.outlet = this.outlet;
        // this.dataService.getAllIssues().subscribe({
        //     next: (data: ITask[]) => {
        //         // cache data
        //         window.localStorage.setItem('tp_issues_cache', JSON.stringify(data));
        //         const currentTime = new Date().getTime();
        //         window.localStorage.setItem(`lastUpdate`,  currentTime as any);
        //         this.populateDataComponents(data);
        //     },
        //     error: err => {
        //         console.log(err);
        //         // load local dummy data
        //         const data = GITHUB_TASKS;
        //         this.populateDataComponents(data);
        //     }
        // });
        const data = (GITHUB_TASKS as ITask[]).map(rec => {
            const milestone = new MilestonePipe().transform(rec);
            rec.milestone = milestone;
            return rec;
        })
        this.populateDataComponents(data);
        this.teamMembers = MEMBERS;

        this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
        this.grid.transactions.onStateUpdate.subscribe(() => {
            this.transactionsData = this.grid.transactions.getAggregatedChanges(true);
        });

        this.grid.groupingExpressions = [{
            dir: SortingDirection.Desc,
            fieldName: 'milestone',
            ignoreCase: false,
            strategy: this.milestoneSort
        }];

        const today = new Date();
        const ms = Math.floor(today.getMonth() / 3) + 1;
        const currentMilestone = `Q${ms} ${today.getFullYear()}`;
        this.grid.groupingExpansionState = [{
            expanded: true,
            hierarchy: [{ fieldName: 'milestone', value: currentMilestone }]
        }];
    }

    /** Formatters */
    public formatDate = (date: Date) => {
        return `${this.dayFormatter.format(date)}, ${date.getDate()} ${this.monthFormatter.format(date)}, ${date.getFullYear()}`;
    }

    public formatID(value: number): string {
        return '#' + value;
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

    public formatPieLabel(args): string {
        return args.item.Value + ' ' + args.item.Label;
    }

    public formatDateLabel(item): string {
        return item.date.toLocaleDateString(undefined, { month: 'short' });
    }

    /** CRUD actions */
    public undo() {
        this.grid.transactions.undo();
    }

    public redo() {
        this.grid.transactions.redo();
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

    public onEditingModeChanged(event: ISelectionEventArgs) {
        this.editMode = event.newSelection.index;
    }

    public isEditModeSelected(i: number): boolean {
        return i === this.editMode;
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
                const deadlineDate = this.grid.getRowByIndex(event.cellID.rowIndex).data.deadline;
                if (event.newValue > deadlineDate) {
                    event.cancel = true;
                    this.toast.open('Started date cannot exceed Deadline date !');
                }
                break;
            }
            case 'deadline': {
                const startedDate = this.grid.getRowByIndex(event.cellID.rowIndex).data.createdAt;
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast.open('Deadline date cannot be earlier than started date !');
                }
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast.open('Deadline date cannot be earlier than started date !');
                }
                break;
            }
            case 'status': {
                if (event.newValue === 'Completed') {
                    this.grid.getRowByKey(event.rowID).data.isActive = false;
                }
            }
        }
    }

    public addTask(event) {
        if (this.addTaskForm.title && this.addTaskForm.title !== undefined
            && this.addTaskForm.deadline) {
            this.addTaskForm.id = this.grid.data[this.grid.data.length - 1].id + 1;
            this.addTaskForm.number = this.grid.data[this.grid.data.length - 1].id + 1;
            this.addTaskForm.status = 'New';
            this.addTaskForm.estimation = null;
            this.addTaskForm.hours_spent = null;
            this.addTaskForm.createdAt = new Date().toDateString();
            this.grid.addRow(this.addTaskForm);
            this.grid.transactions.commit(this.grid.data);
            this.addTaskForm = {} as ITask;
            this.addTaskDialog.close();
        } else {
            this.emptyFieldMessage();
        }
    }

    public editTask(event) {
        if (this.editTaskForm.title !== '' && this.editTaskForm.deadline) {
            this.editTaskDialog.close();
        } else {
            this.emptyFieldMessage();
        }

    }

    public deleteTask(rowID) {
        this.grid.deleteRow(rowID);
    }

    public setAvatarUrl(assignee) {
        let avatar;
        if (!assignee) {
            return;
        }
        if (assignee.login) {
            avatar = MEMBERS.find(m => m.login === assignee.login).avatarUrl;
        } else {
            avatar = MEMBERS.find(m => m.login === assignee).avatarUrl;
        }

        return avatar;
    }

    public getValue(value) {
        let assigneeName;
        if (!value) {
            return;
        }
        if (value.login) {
            assigneeName = value.login;
        } else {
            assigneeName = value;
        }
        return assigneeName;
    }

    /** Open Dialogs */
    public openCommitDialog() {
        this.transactionsDialog.open(this.dialogOverlaySettings);
        this.transactionsGrid.reflow();
    }

    public openAddTaskDialog() {
        this.addTaskDialog.open(this.dialogOverlaySettings);
    }

    public openBatchEditDialog() {
        const selectedRows = this.grid.selectedRows;
        const selectedData = this.tasks.filter(rec => selectedRows.indexOf(rec.id) > -1);
        this.batchEditingData = selectedData;
        this.batchEditDialog.open(this.dialogOverlaySettings);
    }

    /** Methods and event handlers */
    /** Uses the fetched data to populate each component in the app
     * The main grid binds to `tasks`
     * Master Backlog binds to `unassignedTasks`
     */
    public populateDataComponents(data: ITask[]) {
        const issues = data.filter(task => task.pullRequest === null).map(rec => this.parseDate(rec));
        this.tasks = issues.filter(t => t.labels.filter(l => l.name.includes('status')).length > 0);
        this.gridIsLoading = false;
        this.unassignedTasks = issues.filter(t => t.labels.filter(l => l.name.includes('status')).length === 0);
    }

    public emptyFieldMessage() {
        this.toast.open('Please fill out all required fields (Issue and Deadline).');
    }

    public toggleTheme() {
        this.darkTheme = !this.darkTheme;
        this.inputType = this.darkTheme ? 'material' : 'fluent';
    }

    public onBacklogItemAction(event: IListItemAction) {
        switch (event.action) {
            case 'edit': {
                this.editTaskForm = event.issue;
                this.editTaskForm.deadline = null;
                this.editTaskForm.milestone = null;
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

    public onDropContainerEnterLeave(event: IDropDroppedEventArgs) {
        this.toggleGroupRowHighlight();
    }

    public toggleGroupRowHighlight() {
        const groupRows = this.grid.tbody.nativeElement.querySelectorAll('igx-grid-groupby-row');
        (groupRows as HTMLElement[]).forEach(element => {
            const labelElement = element.querySelector('.igx-group-label').firstElementChild as HTMLElement;
            if (labelElement.innerText === this.editTaskForm.milestone) {
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

    public deadlineChanged(event: Date, form: ITask) {
        const year = event.getFullYear();
        const quarter = Math.ceil((event.getMonth() + 1) / 3);
        const milestone = `Q${quarter} ${year}`;
        form.milestone = milestone;
    }

    public getDeadlineValue(cell: CellType): string {
        const pipeArgs = cell.column.pipeArgs;
        const deadline = new Date(cell.row.data);
        deadline.setMonth(deadline.getMonth() + 3);
        const val = this.datePipe.transform(deadline, pipeArgs.format, pipeArgs.timezone, cell.grid.locale);
        console.log(val);
        return val;
    }

    public getStatusLabel(labels: any[]) {
        const label = new StatusLabelPipe().transform(labels);
        return label;
    }

    public getAssignee(user: ITeamMember) {
        return user.login;
    }

    /** Getters */
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
        return this.grid.selectedRows.length > 0;
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

    /** Unique column values strategy for Excel Style Filtering */
    public columnValuesStrategy = (column: IgxColumnComponent,
        columnExprTree: IFilteringExpressionsTree,
        done: (uniqueValues: any[]) => void) => {
        // Get specific column data.
        this.getColumnData(column, columnExprTree, uniqueValues => done(uniqueValues));
    }

    public getColumnData(column: IgxColumnComponent,
        columnExprTree: IFilteringExpressionsTree,
        done: (colVals: any[]) => void) {
        setTimeout(() => {
            let columnValues = [];
            if (column.field === 'labels') {
                columnValues = this.statuses.map(rec => rec.value);
                done(columnValues);
                return;
            }
            if (column.field === 'assignee.login') {
                columnValues = this.teamMembers.map(rec => rec.login);
                done(columnValues);
                return;
            }
            if (column.field === 'priority') {
                columnValues = this.priority.map(rec => rec.value);
                done(columnValues);
                return;
            }
            const filteredData = this._filteringStrategy.filter(this.tasks, columnExprTree, null, null);
            columnValues = filteredData.map(record => record[column.field]);
            done(columnValues);
        }, 1000);
    }

    /** Help utils */
    private parseDate(obj) {
        obj.createdAt = obj.createdAt ? new Date(obj.createdAt) : null;
        return obj;
    }

    /**
     * Returns workload for corresponding team member.
     */
    // public getAssigneeWorkload(ownerID: number) {
    //     const workloadData = this.tasks.filter(rec => rec.owner.id === ownerID);
    //     const newTasks = workloadData.filter(rec => rec.status === 'New').length;
    //     const inprogressTasks = workloadData.filter(rec => rec.status === 'In Progress').length;
    //     const doneTasks = workloadData.filter(rec => rec.status === 'Done').length;

    //     return [
    //         { Label: 'In Progress', Value: inprogressTasks },
    //         { Label: 'Done', Value: doneTasks },
    //         { Label: 'New', Value: newTasks }];
    // }

    /**
     * Returns workload for the corrssponding team.
     */
    // public getTeamWorkload(team: string) {
    //     const workloadData = this.tasks.filter(rec => rec.owner.team === team);
    //     const newTasks = workloadData.filter(rec => rec.status === 'New').length;
    //     const inprogressTasks = workloadData.filter(rec => rec.status === 'In Progress').length;
    //     const doneTasks = workloadData.filter(rec => rec.status === 'Done').length;

    //     return [
    //         { Label: 'In Progress', Value: inprogressTasks },
    //         { Label: 'Done', Value: doneTasks },
    //         { Label: 'New', Value: newTasks }];
    // }
}

/** Sorting strategy for year quarters. */
export class MilestoneSortingStrategy extends DefaultSortingStrategy {
    protected compareObjects(obj1: ITask,
        obj2: ITask,
        key: string,
        reverse: number,
        ignoreCase: boolean,
        valueResolver: (obj: any, key: string) => string) {
        const objA = obj1[key].split(' ');
        const objB = obj2[key].split(' ');
        const yearA = objA[1];
        const yearB = objB[1];

        const quarterA = objA[0].slice(-1);
        const quarterB = objB[0].slice(-1);

        const milestoneA = parseInt(yearA + quarterA, 10);
        const milestoneB = parseInt(yearB + quarterB, 10);

        return reverse * this.compareValues(milestoneA, milestoneB);
    }
}

/** Sorting strategy for progress column. */
export class ProgressSortingStrategy extends DefaultSortingStrategy {
    protected compareObjects(obj1: ITask,
        obj2: ITask,
        key: string,
        reverse: number) {
        const progressA = calcProgress(obj1);
        const progressB = calcProgress(obj2);

        return reverse * this.compareValues(progressA, progressB);
    }
}

/** Sorting strategy for Status column. */
export class StatusSortingStrategy extends DefaultSortingStrategy {
    protected compareObjects(obj1: ITask,
        obj2: ITask,
        key: string,
        reverse: number) {
        const pipe = new StatusLabelPipe();
        const statusA = pipe.transform(obj1.labels);
        const statusB = pipe.transform(obj2.labels);

        return reverse * this.compareValues(statusA, statusB);
    }
}

/** Filtering strategy for Priority and Status columns. */
export class LabelsFilteringStrategy extends FilteringStrategy {
    public findMatchByExpression(rec: ITask, expr: IFilteringExpression): boolean {
        const cond = expr.condition;
        let val = this.getFieldValue(rec, expr.fieldName);
        if (expr.fieldName === 'labels') {
            val = new StatusLabelPipe().transform(val);
        }
        if (!val && expr.fieldName === 'priority') {
            val = new PriorityLabelPipe().transform(rec);
        }
        return cond.logic(val, expr.searchVal, expr.ignoreCase);
    }
}


/** Calculates task progress. */
export function calcProgress(task: ITask) {
    const hoursSpent = task.hours_spent ? task.hours_spent : 0;
    const estimation = task.estimation ? task.estimation : 0;
    const progress = (hoursSpent / estimation) * 100;
    return progress;
}
// tslint:enable:max-line-length
// tslint:enable:member-ordering
