import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../interfaces';
import { CellType } from 'igniteui-angular';
import { DatePipe } from '@angular/common';

@Pipe({name: 'statusLabel'})
export class StatusLabelPipe implements PipeTransform {
    transform(value: any): string {
        if (!value) {return;}
        if (typeof value === 'string') {
            return value;
        }
        const label = value.filter(l => l.name.indexOf('status:') === 0);
        if (label.length) {
            return label[0].name.substring(8);
        }
    }
}

@Pipe({name: 'loginLabel'})
export class LoginLabelPipe implements PipeTransform {
    transform(value: any): string {
        if (typeof value === 'string') {
            return value;
        }
        return value.login;
    }
}

@Pipe({name: 'priorityLabel'})
export class PriorityLabelPipe implements PipeTransform {
    transform(cell: any): string {
        if (cell.value) {
            return cell.value;
        }
        const rowData = cell.row.data ? cell.row.data : cell;
        let label;
        if (typeof(rowData.labels.filter) === 'function'){
            label = rowData.labels.filter(l => l.name.indexOf('severity:') === 0);
        }
        
        if (label && label.length > 0) {
            if (label.length > 0){
                return label[0].name.substring(10);
            }
        }
    }
}

@Pipe({name: 'placeholder'})
export class PlaceholderPipe implements PipeTransform {
    transform(value: any): string {
        if (value) {
            return value + 'h';
        } else {
            return 'Enter value...';
        }
    }
}

@Pipe({name: 'progress'})
export class ProgressPipe implements PipeTransform {
    transform(value: any): string {
      if (value) {
          return value;
      } else {
          return 'Automatically updated...';
      }
    }
}

@Pipe({name: 'deadline'})
export class DeadlinePipe implements PipeTransform {
    transform(value: ITask, cell?: CellType): string {
        const pipe = new DatePipe(cell?.grid.locale);
        const pipeArgs = cell?.column.pipeArgs;
        const deadline = new Date(value.createdAt);
        deadline.setMonth(deadline.getMonth() + 3);
        return pipe.transform(deadline, pipeArgs?.format, pipeArgs?.timezone);
    }
}

@Pipe({name: 'milestone'})
export class MilestonePipe implements PipeTransform {
    transform(value: ITask): string {
        const deadline = new Date(value.createdAt);
        deadline.setMonth(deadline.getMonth() + 3);
        const year = deadline.getFullYear();
        const quarter = Math.floor(deadline.getMonth() / 3) + 1;
        return `Q${quarter} ${year}`;
    }
}

@Pipe({name: 'filterTasks'})
export class FilterTasksPipe implements PipeTransform {
    transform(data: ITask[], groupRowValue: string): ITask[] {
        const groupedData = data.filter(rec => rec.milestone === groupRowValue);
        return groupedData.reduce((acc, val) => {
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
