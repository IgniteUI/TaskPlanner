import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ITask } from '../interfaces';

// base URL for the API Server
const BASE_URL = 'https://localhost:44327/';
const ONE_HOUR_MS = 3600000;

@Injectable({ providedIn: 'root' })
export class TasksDataService {
    private readonly _http = inject(HttpClient);

    public getAllIssues(): Observable<ITask[]> {
        const stored = window.localStorage.getItem('lastUpdate');
        const lastUpdate = stored ? parseInt(stored, 10) : NaN;
        const now = new Date().getTime();

        // if less than one hour passed since last update, serve the cache
        const cached = window.localStorage.getItem('tp_issues_cache');
        const loadDataFromCache = !!lastUpdate && now - lastUpdate <= ONE_HOUR_MS && cached !== null;

        if (loadDataFromCache) {
            return new Observable((observer: Observer<ITask[]>) => {
                observer.next(JSON.parse(cached as string) as ITask[]);
                observer.complete();
            });
        }

        return this._http.get<ITask[]>(`${BASE_URL}getAllIssues`);
    }
}
