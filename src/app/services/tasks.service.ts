import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TASKS_DATA } from './tasksData';
import { ITask } from '../taskplanner/taskplanner.component';

@Injectable()
export class TasksDataService {

    constructor() {
    }

    public getAssignedTasks(): Observable<ITask[]> {
        return of(TASKS_DATA.filter(rec => rec.owner.id).map(rec => this.parseDate(rec)));
    }

    public getUnassignedTasks(): Observable<ITask[]> {
        return of(TASKS_DATA.filter(rec => !rec.owner.id).map(rec => this.parseDate(rec)));
    }

    private parseDate(obj) {
        const record = {};

        obj.started_on = obj.started_on ? new Date(obj.started_on) : null;
        obj.deadline = obj.deadline ? new Date(obj.deadline) : null;
        return obj;
    }
}
