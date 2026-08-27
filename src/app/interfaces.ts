import { ISortingStrategy } from '@infragistics/igniteui-angular/core';

export interface ITask {
    createdAt?: Date | string;
    assignee?: ITeamMember;
    labels?: ILabel[];
    body?: string;
    title?: string;
    number?: number;
    url?: string;
    id?: number;
    /** The GitHub payload carries `null` on plain issues. */
    pullRequest?: string | null;
    priority?: string;
    /** Cleared to `null` when a task is reset in the edit dialog. */
    milestone?: string | null;
    status?: string;
    /** Cleared to `null` when a task is reset in the edit dialog. */
    deadline?: Date | null;
    estimation?: number;
    hours_spent?: number;
    /** Set by the app when a task's status moves to Completed. */
    isActive?: boolean;
}

export interface ITeamMember {
    id: number;
    /** GitHub omits the address on private profiles. */
    email: string | null;
    login: string;
    url: string;
    avatarUrl: string;
}

export interface ILabel {
  id: number;
  /** Present in the GitHub payload; unused by the app. */
  nodeId?: string;
  url: string;
  name: string;
  color: string;
  description: string;
  default: boolean;
}

/** Aggregated status badge shown on a group-by row. */
export interface ITaskStatusBadge {
    name: string;
    items: number;
    cssClass: string;
}

/**
 * Column metadata driving the grid's `@for` column definitions.
 * Defaults are supplied in the template, so the optional members are widened
 * to the input types IgxColumnComponent actually accepts.
 */
export interface ITaskColumn {
    field: string;
    header: string;
    width: string;
    dataType: 'string' | 'number' | 'date' | 'boolean';
    sortable?: boolean;
    filterable?: boolean;
    editable?: boolean | string;
    resizable?: boolean | string;
    groupable?: boolean | string;
    pinned?: boolean;
    hidden?: boolean;
    hasSummary?: boolean;
    required?: boolean;
    minlength?: number | string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- IgxColumnComponent.formatter signature
    formatter?: (value: any, rowData?: any) => string;
    summaries?: unknown;
    cellClasses?: Record<string, unknown>;
    sortStrategy?: ISortingStrategy;
}
