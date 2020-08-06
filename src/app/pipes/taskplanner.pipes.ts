import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../interfaces';

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

@Pipe({name: 'priorityLabel'})
export class PriorityLabelPipe implements PipeTransform {
  transform(value: ITask): string {
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
  transform(value: ITask): Date {
    const started = new Date(value.createdAt);
    const deadlineMonth = started.getMonth() + 3;
    const deadline = new Date(started).setMonth(deadlineMonth);
    return new Date(deadline);
  }
}
