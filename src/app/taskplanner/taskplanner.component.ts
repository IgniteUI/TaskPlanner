import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnType, IgxTheme, IFilteringStrategy, DateRangeType, DefaultSortingStrategy, FilteringStrategy, IFilteringExpression, IFilteringExpressionsTree, ISortingOptions, IgxOverlayOutletDirective, IgxOverlayOutletDirective as IgxOverlayOutletDirective_1, IgxSummaryOperand, IgxSummaryResult, OverlaySettings, SortingDirection, Transaction } from '@infragistics/igniteui-angular/core';
import { CellType, IGridEditEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IgxToastComponent } from '@infragistics/igniteui-angular/toast';
import { IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { TasksDataService } from '../services/tasks.service';
import { MEMBERS, GITHUB_TASKS } from '../services/tasksData';
import { BacklogComponent, IListItemAction } from '../backlog/backlog.component';
import { ILabel, ITask, ITaskColumn, ITeamMember } from '../interfaces';
import { StatusLabelPipe, PriorityLabelPipe, MilestonePipe, PlaceholderPipe, DeadlinePipe, FilterTasksPipe } from '../pipes/taskplanner.pipes';
import { DatePipe, PercentPipe } from '@angular/common';
import { IgxGridComponent as IgxGridComponent_1 } from '@infragistics/igniteui-angular/grids/grid';
import { IgxButtonDirective, IgxDropDirective, IgxMaskDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxPaginatorComponent } from '@infragistics/igniteui-angular/paginator';
import { IgxCellEditorTemplateDirective, IgxCellTemplateDirective, IgxColumnComponent as IgxColumnComponent_1, IgxColumnMinLengthValidatorDirective, IgxColumnRequiredValidatorDirective, IgxGridDetailTemplateDirective, IgxGridToolbarActionsComponent, IgxGridToolbarComponent, IgxGridToolbarExporterComponent, IgxGridToolbarHidingComponent, IgxGridToolbarPinningComponent, IgxGridToolbarTitleComponent, IgxGroupByRowTemplateDirective, IgxSummaryTemplateDirective } from '@infragistics/igniteui-angular/grids/core';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxDropDownComponent as IgxDropDownComponent_1, IgxDropDownItemComponent, IgxDropDownItemNavigationDirective } from '@infragistics/igniteui-angular/drop-down';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective, IgxPrefixDirective } from '@infragistics/igniteui-angular/input-group';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IgxSelectComponent, IgxSelectItemComponent } from '@infragistics/igniteui-angular/select';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxLinearProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxToastComponent as IgxToastComponent_1 } from '@infragistics/igniteui-angular/toast';
import { IgxDialogComponent as IgxDialogComponent_1 } from '@infragistics/igniteui-angular/dialog';
import { IgxDatePickerComponent } from '@infragistics/igniteui-angular/date-picker';
import { HeaderComponent } from '../header/header.component';

export enum editMode {
    cellEditing = 0,
    rowEditing = 1,
    none = 2
}

@Component({
    providers: [TasksDataService, DatePipe],
    selector: 'app-taskplanner',
    templateUrl: './taskplanner.component.html',
    styleUrls: ['./taskplanner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { 'class': 'tp-app' },
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
]
})
export class TaskPlannerComponent implements OnInit, AfterViewInit {
    private datePipe = inject(DatePipe);

    // `editModeDropdown` and `legend` were declared but never read in TypeScript
    // (the template drives the dropdown through its own #editModeDropdown ref),
    // so they are deleted rather than converted.
    public readonly grid = viewChild.required('tasksGrid', { read: IgxGridComponent });
    public readonly toast = viewChild.required(IgxToastComponent, { read: IgxToastComponent });
    public readonly addTaskDialog = viewChild.required<IgxDialogComponent>('addTaskDialog');
    public readonly editTaskDialog = viewChild.required<IgxDialogComponent>('editTaskDialog');
    public readonly transactionsDialog = viewChild.required<IgxDialogComponent>('transactionsDialog');
    public readonly transactionsGrid = viewChild.required<IgxGridComponent>('transactionsGrid');
    public readonly batchEditingGrid = viewChild.required<IgxGridComponent>('batchEditingGrid');
    public readonly batchEditDialog = viewChild.required<IgxDialogComponent>('batchEditDialog');

    public readonly outlet = viewChild.required(IgxOverlayOutletDirective);
    public readonly backlog = viewChild.required(BacklogComponent, { read: BacklogComponent });

    public readonly darkTheme = signal(true);
    public readonly tasks = signal<ITask[]>([]);
    public readonly unassignedTasks = signal<ITask[]>([]);
    public readonly teamMembers = signal<ITeamMember[]>([]);
    public readonly editMode = signal(0);
    public editModes = ['Cell Editing', 'Row Editing', 'No Editing'];
    public addTaskForm = {} as ITask;
    public editTaskForm = {} as ITask;
    public readonly transactionsData = signal<Transaction[]>([]);
    public readonly batchEditingData = signal<ITask[]>([]);
    /** IgxTheme, not IgxInputGroupType - see the [theme] bindings in the template. */
    public readonly inputTheme = signal<IgxTheme>('material');
    public selectOptions = [5, 15, 20, 50];
    public disabledDates = [{
        dateRange: [new Date()],
        type: DateRangeType.Before
    }];
    public readonly gridIsLoading = signal(true);

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
    public isResolved = (rowData: ITask): boolean => {
        return this.getStatusLabel(rowData.labels ?? []) === 'resolved';
    }

    public isNew = (rowData: ITask): boolean => {
        return this.getStatusLabel(rowData.labels ?? []) === 'in-review';
    }

    public isInDevelopment = (rowData: ITask): boolean => {
        return this.getStatusLabel(rowData.labels ?? []) === 'in-development';
    }

    public notABug = (rowData: ITask): boolean => {
        return this.getStatusLabel(rowData.labels ?? []) === 'not-a-bug';
    }

    public isCritical = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey as keyof ITask] === 'critical';
    }

    public isLow = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey as keyof ITask] === 'low';
    }

    public isHigh = (rowData: ITask, columnKey: string): boolean => {
        return rowData[columnKey as keyof ITask] === 'high';
    }

    public isDelayed = (rowData: ITask): boolean => {
        return (rowData.hours_spent ?? 0) > (rowData.estimation ?? 0);
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

    public columns: ITaskColumn[] = [
        { field: 'pullRequest', header: 'Type', width: '120px', dataType: 'string', filterable: true, hidden: true, sortStrategy: this.defaultSort },
        { field: 'number', header: 'ID', width: '120px', dataType: 'number', formatter: this.formatID, sortable: false, sortStrategy: this.defaultSort },
        { field: 'title', header: 'Issue', width: '380px', dataType: 'string', filterable: true, editable: true, sortStrategy: this.defaultSort, required: true, minlength: 4 },
        { field: 'milestone', header: 'Milestone', width: '120px', dataType: 'string', editable: true, sortable: true, sortStrategy: this.milestoneSort, hidden: true, },
        { field: 'labels', header: 'Status', width: '200px', dataType: 'string', sortable: true, filterable: true, editable: true, summaries: StatusSummary, cellClasses: this.statusClasses, hasSummary: true, sortStrategy: this.statusSort },
        { field: 'assignee.login', header: 'Assignee', width: '180px', dataType: 'string', editable: true, filterable: true, sortable: true, sortStrategy: this.defaultSort },
        { field: 'createdAt', header: 'Created', width: '220px', dataType: 'date', sortable: true, filterable: true, editable: false, sortStrategy: this.defaultSort, hasSummary: true  },
        { field: 'deadline', header: 'Deadline', width: '130px', dataType: 'date', sortable: true, filterable: true, editable: true, sortStrategy: this.defaultSort },
        { field: 'estimation', header: 'Estimation', width: '120px', dataType: 'number', editable: true, cellClasses: this.delayedClasses, sortStrategy: this.defaultSort },
        { field: 'hours_spent', header: 'Hours Spent', width: '120px', dataType: 'number', editable: true, cellClasses: this.delayedClasses, sortStrategy: this.defaultSort },
        { field: 'progress', header: 'Progress', width: '95px', dataType: 'number', sortable: true, sortStrategy: this.progressSort },
        { field: 'priority', header: 'Priority', width: '125px', dataType: 'string', sortable: true, filterable: true, editable: true, cellClasses: this.priorityClasses, sortStrategy: this.defaultSort }
    ];
    private _filteringStrategy: IFilteringStrategy = new FilteringStrategy();

    public ngOnInit() {
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
        this.teamMembers.set(MEMBERS);

    }

    /**
     * Signal view queries resolve with this component's own view, i.e. after
     * ngOnInit. Everything that reads grid() or outlet() lives here.
     */
    public ngAfterViewInit(): void {
        this.overlaySettings.outlet = this.outlet();
        this.dialogOverlaySettings.outlet = this.outlet();

        const grid = this.grid();

        this.transactionsData.set(grid.transactions.getAggregatedChanges(true));
        grid.transactions.onStateUpdate?.subscribe(() => {
            // Writing a signal notifies Angular; the previous plain-field
            // assignment relied on a change-detection pass it never scheduled.
            this.transactionsData.set(grid.transactions.getAggregatedChanges(true));
        });

        grid.groupingExpressions = [{
            dir: SortingDirection.Desc,
            fieldName: 'milestone',
            ignoreCase: false,
            strategy: this.milestoneSort
        }];

        const today = new Date();
        const ms = Math.floor(today.getMonth() / 3) + 1;
        const currentMilestone = `Q${ms} ${today.getFullYear()}`;
        grid.groupingExpansionState = [{
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

    public stateFormatter(value: unknown): string {
        return JSON.stringify(value);
    }

    public typeFormatter(value: string): string {
        return value.toUpperCase();
    }

    public classFromType(type: string): string {
        return `transaction--${type.toLowerCase()}`;
    }
    public formatHours(value: number): string {
        return value ? value + 'h' : '';
    }

    public formatPieLabel(args: { item: { Value: string; Label: string } }): string {
        return args.item.Value + ' ' + args.item.Label;
    }

    public formatDateLabel(item: { date: Date }): string {
        return item.date.toLocaleDateString(undefined, { month: 'short' });
    }

    /** CRUD actions */
    public undo() {
        this.grid().transactions.undo();
    }

    public redo() {
        this.grid().transactions.redo();
    }

    public commit() {
        this.grid().transactions.commit(this.tasks());
        this.transactionsDialog().close();
    }

    public commitBatchEdits() {
        const editedData = (this.batchEditingGrid().data ?? []) as ITask[];
        // transfer edited data to this.grid()
        for (const edited of editedData) {
            this.grid().updateRow(edited, edited.id);
        }
        this.batchEditDialog().close();
    }

    public cancel() {
        this.transactionsDialog().close();
    }

    public discard() {
        this.grid().transactions.clear();
        this.transactionsDialog().close();
    }

    public onEditingModeChanged(event: ISelectionEventArgs) {
        this.editMode.set(event.newSelection.index);
    }

    public isEditModeSelected(i: number): boolean {
        return i === this.editMode();
    }

    public editStart(event: IGridEditEventArgs): void {
        const field = this.grid().columnList.find(c => c.index === event.cellID?.columnID)?.field;
        if (field === 'started_on' && !!event.oldValue) {
            event.cancel = true;
        }
    }

    public onCellEdit(event: IGridEditEventArgs): void {
        const cellID = event.cellID;
        if (!cellID) {
            return;
        }
        const field = this.grid().columnList.find(c => c.index === cellID.columnID)?.field;
        switch (field) {
            case 'started_on': {
                const deadlineDate = this.grid().getRowByIndex(cellID.rowIndex).data.deadline;
                if (event.newValue > deadlineDate) {
                    event.cancel = true;
                    this.toast().open('Started date cannot exceed Deadline date !');
                }
                break;
            }
            case 'deadline': {
                const startedDate = this.grid().getRowByIndex(cellID.rowIndex).data.createdAt;
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast().open('Deadline date cannot be earlier than started date !');
                }
                if (event.newValue < startedDate) {
                    event.cancel = true;
                    this.toast().open('Deadline date cannot be earlier than started date !');
                }
                break;
            }
            case 'status': {
                if (event.newValue === 'Completed') {
                    this.grid().getRowByKey(event.rowID).data.isActive = false;
                }
            }
        }
    }

    public addTask(): void {
        if (this.addTaskForm.title && this.addTaskForm.deadline) {
            const rows = (this.grid().data ?? []) as ITask[];
            const nextId = (rows.length ? (rows[rows.length - 1].id ?? 0) : 0) + 1;
            this.addTaskForm.id = nextId;
            this.addTaskForm.number = nextId;
            this.addTaskForm.status = 'New';
            this.addTaskForm.estimation = undefined;
            this.addTaskForm.hours_spent = undefined;
            this.addTaskForm.createdAt = new Date().toDateString();
            this.grid().addRow(this.addTaskForm);
            this.grid().transactions.commit(rows);
            this.addTaskForm = {} as ITask;
            this.addTaskDialog().close();
        } else {
            this.emptyFieldMessage();
        }
    }

    public editTask(): void {
        if (this.editTaskForm.title !== '' && this.editTaskForm.deadline) {
            this.editTaskDialog().close();
        } else {
            this.emptyFieldMessage();
        }

    }

    public deleteTask(rowID: unknown): void {
        this.grid().deleteRow(rowID);
    }

    public setAvatarUrl(assignee: ITeamMember | string | null | undefined): string {
        if (!assignee) {
            return '';
        }
        const login = typeof assignee === 'string' ? assignee : assignee.login;
        return MEMBERS.find(m => m.login === login)?.avatarUrl ?? '';
    }

    public getValue(value: ITeamMember | string | null | undefined): string | undefined {
        let assigneeName;
        if (!value) {
            return;
        }
        if (typeof value !== 'string') {
            assigneeName = value.login;
        } else {
            assigneeName = value;
        }
        return assigneeName;
    }

    /** Open Dialogs */
    public openCommitDialog() {
        this.transactionsDialog().open(this.dialogOverlaySettings);
        this.transactionsGrid().reflow();
    }

    public openAddTaskDialog() {
        this.addTaskDialog().open(this.dialogOverlaySettings);
    }

    public openBatchEditDialog() {
        const selectedRows = this.grid().selectedRows;
        const selectedData = this.tasks().filter(rec => selectedRows.indexOf(rec.id) > -1);
        this.batchEditingData.set(selectedData);
        this.batchEditDialog().open(this.dialogOverlaySettings);
    }

    /** Methods and event handlers */
    /** Uses the fetched data to populate each component in the app
     * The main grid binds to `tasks`
     * Master Backlog binds to `unassignedTasks`
     */
    public populateDataComponents(data: ITask[]) {
        const issues = data.filter(task => task.pullRequest === null).map(rec => this.parseDate(rec));
        this.tasks.set(issues.filter(t => (t.labels ?? []).filter(l => l.name.includes('status')).length > 0));
        this.gridIsLoading.set(false);
        this.unassignedTasks.set(issues.filter(t => (t.labels ?? []).filter(l => l.name.includes('status')).length === 0));
    }

    public emptyFieldMessage() {
        this.toast().open('Please fill out all required fields (Issue and Deadline).');
    }

    public toggleTheme() {
        this.darkTheme.set(!this.darkTheme());
        this.inputTheme.set(this.darkTheme() ? 'material' : 'fluent');
    }

    public onBacklogItemAction(event: IListItemAction) {
        switch (event.action) {
            case 'edit': {
                this.editTaskForm = event.issue;
                this.editTaskForm.deadline = null;
                this.editTaskForm.milestone = null;
                this.editTaskDialog().open(this.dialogOverlaySettings);
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

    public onDropContainerEnterLeave(): void {
        this.toggleGroupRowHighlight();
    }

    public toggleGroupRowHighlight() {
        const groupRows = this.grid().tbody.nativeElement.querySelectorAll('igx-grid-groupby-row');
        (groupRows as HTMLElement[]).forEach(element => {
            const labelElement = element.querySelector('.igx-group-label')?.firstElementChild as HTMLElement | null;
            if (labelElement && labelElement.innerText === this.editTaskForm.milestone) {
                element.classList.toggle('tp-app__groupby-row-highlight');
            }
        });
    }

    public toggleGridBodyHighlight() {
        this.grid().tbody.nativeElement.classList.toggle('tp-app__drop-area-entered');
    }

    public onItemDropped(): void {
        if (Object.keys(this.editTaskForm).length) {
            this.toggleGridBodyHighlight();
            this.addBacklogItem(this.editTaskForm);
        }
    }

    public addBacklogItem(item: ITask) {
        this.grid().addRow(item);
        this.backlog().deleteItem(item);
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
        return this.datePipe.transform(deadline, pipeArgs.format, pipeArgs.timezone, cell.grid.locale) ?? '';
    }

    public getStatusLabel(labels: ILabel[] | string | undefined): string {
        return new StatusLabelPipe().transform(labels);
    }

    public getAssignee(user: ITeamMember) {
        return user.login;
    }

    /** Getters */
    public get undoEnabled(): boolean {
        return this.grid().transactions.canUndo;
    }

    public get redoEnabled(): boolean {
        return this.grid().transactions.canRedo;
    }

    public get hasTransactions(): boolean {
        return this.grid().transactions.getAggregatedChanges(false).length > 0;
    }

    public get hasSelection(): boolean {
        return this.grid().selectedRows.length > 0;
    }

    public get isRowEditingEnabled() {
        return this.editMode() === editMode.rowEditing;
    }

    public get isEditingEnabled() {
        return this.editMode() !== editMode.none;
    }

    public get selectedEditMode() {
        return this.editModes[this.editMode()];
    }

    /** Unique column values strategy for Excel Style Filtering */
    public columnValuesStrategy = (column: ColumnType,
        columnExprTree: IFilteringExpressionsTree,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors IgxGrid uniqueColumnValuesStrategy
        done: (uniqueValues: any[]) => void) => {
        // Get specific column data.
        this.getColumnData(column, columnExprTree, uniqueValues => done(uniqueValues));
    }

    public getColumnData(column: ColumnType,
        columnExprTree: IFilteringExpressionsTree,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors IgxGrid uniqueColumnValuesStrategy
        done: (colVals: any[]) => void) {
        setTimeout(() => {
            let columnValues: unknown[];
            if (column.field === 'labels') {
                columnValues = this.statuses.map(rec => rec.value);
                done(columnValues);
                return;
            }
            if (column.field === 'assignee.login') {
                columnValues = this.teamMembers().map(rec => rec.login);
                done(columnValues);
                return;
            }
            if (column.field === 'priority') {
                columnValues = this.priority.map(rec => rec.value);
                done(columnValues);
                return;
            }
            const filteredData = this._filteringStrategy.filter(this.tasks(), columnExprTree);
            columnValues = filteredData.map(record => (record as Record<string, unknown>)[column.field]);
            done(columnValues);
        }, 1000);
    }

    /** Help utils */
    private parseDate(obj: ITask): ITask {
        obj.createdAt = obj.createdAt ? new Date(obj.createdAt) : undefined;
        return obj;
    }

    /**
     * Returns workload for corresponding team member.
     */
    // public getAssigneeWorkload(ownerID: number) {
    //     const workloadData = this.tasks().filter(rec => rec.owner.id === ownerID);
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
    //     const workloadData = this.tasks().filter(rec => rec.owner.team === team);
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
    protected override compareObjects(obj1: ITask,
        obj2: ITask,
        key: string,
        reverse: number,
        _ignoreCase: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches DefaultSortingStrategy
        _valueResolver: (obj: any, key: string) => string) {
        const objA = String(obj1[key as keyof ITask] ?? '').split(' ');
        const objB = String(obj2[key as keyof ITask] ?? '').split(' ');
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
    protected override compareObjects(obj1: ITask,
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
    protected override compareObjects(obj1: ITask,
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
    public override findMatchByExpression(rec: ITask, expr: IFilteringExpression): boolean {
        const cond = expr.condition;
        if (!cond) {
            return false;
        }
        let val = this.getFieldValue(rec, expr.fieldName);
        if (expr.fieldName === 'labels') {
            val = new StatusLabelPipe().transform(val);
        }
        if (!val && expr.fieldName === 'priority') {
            val = new PriorityLabelPipe().transform(rec);
        }
        return !!cond.logic?.(val, expr.searchVal, expr.ignoreCase);
    }
}

/**  */
export class StatusSummary extends IgxSummaryOperand {
    constructor () {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches IgxSummaryOperand.operate
    public override operate(data: any[] = []): IgxSummaryResult[] {
        const result = super.operate(data);
        const sl = new StatusLabelPipe();
        result.push({
            key: 'in-progress',
            label: 'in-development',
            summaryResult: data.filter(rec => sl.transform(rec) === 'in-development').length
        });
        result.push({
            key: 'resolved',
            label: 'resolved',
            summaryResult: data.filter(rec => sl.transform(rec) === 'resolved').length
        })
        return result;
    }
}


/** Calculates task progress. */
export function calcProgress(task: ITask) {
    const hoursSpent = task.hours_spent ? task.hours_spent : 0;
    const estimation = task.estimation ? task.estimation : 0;
    const progress = (hoursSpent / estimation) * 100;
    return progress;
}
