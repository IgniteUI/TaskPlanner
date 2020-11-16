import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../interfaces';
import { IgxGridCellComponent } from 'igniteui-angular';

@Pipe({name: 'statusLabel'})
export class StatusLabelPipe implements PipeTransform {
  transform(value: any): string {
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
  transform(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    const label = value.labels.filter(l => l.name.indexOf('severity:') === 0);
    if (label.length) {
        return label[0].name.substring(10);
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
  transform(value: ITask, cell: IgxGridCellComponent): string {
    const pipeArgs = cell.column.pipeArgs;
    const deadline = new Date(value.createdAt);
    deadline.setMonth(deadline.getMonth() + 3);
    return cell.grid.datePipe.transform(deadline, pipeArgs.format, pipeArgs.timezone, cell.grid.locale);
  }
}
