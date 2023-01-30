import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// base URL for the API Server
const BASE_URL = 'https://localhost:44327/';

@Injectable()
export class TasksDataService {

  constructor(private _http: HttpClient) {
  }

    public getAllIssues(): Observable<any> {
      let loadDataFromCache = false;
      const lastUpdate = parseInt(window.localStorage.getItem('lastUpdate'), 10);
      const now = new Date().getTime();

      // if more than one hour passed since last update, fetch data from source
      if (lastUpdate && now - lastUpdate <= 3600000) {
        loadDataFromCache = true;
      }

      let data$: Observable<any>;
      if (loadDataFromCache) {
          data$ = Observable.create(observer => {
          const data = window.localStorage.getItem('tp_issues_cache');
          const tasks = JSON.parse(data);
          observer.next(tasks);
          observer.complete();
        });
      } else {
        data$ = this._http.get(`${BASE_URL}getAllIssues`);
      }

      return data$;
    }

    public getAllPrs(): any {
    //   return of(GITHUB_TASKS.filter(task => task.pullRequest !== null));
    //   // return this._http.get(`${BASE_URL}getAllIssues`)
    //     .pipe(
    //     map(data => {
    //       (data as any[]).filter(task => (task as any).pullRequest !== null);
    //     }));
    }
}
