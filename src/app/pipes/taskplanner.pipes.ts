import { Pipe, PipeTransform } from '@angular/core';
import { ILabel, ITask, ITaskStatusBadge } from '../interfaces';
import { CellType } from '@infragistics/igniteui-angular/grids/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'statusLabel',
    standalone: true
})
export class StatusLabelPipe implements PipeTransform {
    transform(value: string | ILabel[] | undefined): string {
        if (!value) { return ''; }
        if (typeof value === 'string') {
            return value;
        }
        const labels = value.filter(l => l.name.includes('status:'));
        if (labels.length) {
            const labelName = labels[0].name;
            const indexOfStatus = labelName.indexOf('status:');
            return labelName.substring(indexOfStatus + 8);
        }
        return '';
    }
}

@Pipe({
    name: 'loginLabel',
    standalone: true
})
export class LoginLabelPipe implements PipeTransform {
    transform(value: string | { login: string }): string {
        if (typeof value === 'string') {
            return value;
        }
        return value.login;
    }
}

@Pipe({
    name: 'priorityLabel',
    standalone: true
})
export class PriorityLabelPipe implements PipeTransform {
    transform(cell: CellType | ITask): string {
        const asCell = cell as Partial<CellType>;
        if (typeof asCell.value === 'string' && asCell.value) {
            return asCell.value;
        }
        const rowData = (asCell.row?.data ?? cell) as ITask;
        const labels = rowData.labels;
        if (Array.isArray(labels)) {
            const label = labels.filter(l => l.name.indexOf('severity:') === 0);
            if (label.length > 0) {
                return label[0].name.substring(10);
            }
        }
        return '';
    }
}

@Pipe({
    name: 'placeholder',
    standalone: true
})
export class PlaceholderPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        if (value) {
            return value + 'h';
        } else {
            return 'Enter value...';
        }
    }
}

@Pipe({
    name: 'progress',
    standalone: true
})
export class ProgressPipe implements PipeTransform {
    transform(value: number | string | null | undefined): string {
        if (value) {
            return String(value);
        } else {
            return 'Automatically updated...';
        }
    }
}

@Pipe({
    name: 'deadline',
    standalone: true
})
export class DeadlinePipe implements PipeTransform {
    transform(value: ITask, cell?: CellType): string {
        const pipe = new DatePipe(cell?.grid.locale ?? 'en-US');
        const pipeArgs = cell?.column.pipeArgs;
        const deadline = new Date(value.createdAt ?? Date.now());
        deadline.setMonth(deadline.getMonth() + 3);
        return pipe.transform(deadline, pipeArgs?.format, pipeArgs?.timezone) ?? '';
    }
}

@Pipe({
    name: 'milestone',
    standalone: true
})
export class MilestonePipe implements PipeTransform {
    transform(value: ITask): string {
        const deadline = new Date(value.createdAt ?? Date.now());
        deadline.setMonth(deadline.getMonth() + 3);
        const year = deadline.getFullYear();
        const quarter = Math.floor(deadline.getMonth() / 3) + 1;
        return `Q${quarter} ${year}`;
    }
}

@Pipe({
    name: 'filterTasks',
    standalone: true
})
export class FilterTasksPipe implements PipeTransform {
    transform(data: ITask[], groupRowValue: string): ITaskStatusBadge[] {
        const groupedData = data.filter(rec => rec.milestone === groupRowValue);
        return groupedData.reduce<ITaskStatusBadge[]>((acc, val) => {
            // Return task status without whitespace in order to be used for class name
            const status = new StatusLabelPipe().transform(val.labels);
            const cssClass = status.replace(/\s/g, '').toLowerCase();
            const itemIndex = acc.findIndex(item => item.name === status);

            if (itemIndex === -1) {
                acc.push({
                    name: status,
                    items: 1,
                    cssClass
                });

                return acc;
            }

            acc[itemIndex].items = acc[itemIndex].items + 1;
            return acc;
        }, []);
    }
}
