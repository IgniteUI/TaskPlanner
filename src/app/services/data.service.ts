import { Injectable } from '@angular/core';
import { tasksData } from '../taskplannergrid/taskData';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

interface IServiceResponse {
    results: any[];
}

@Injectable()
export class DataService {
    private rndUsr: any[];

    constructor() {
    }

    public getData(): Observable<any[]> {
        return of(tasksData.map(rec => this.parseDate(rec)));
    }

    private parseDate(obj) {
        const record = {};
        obj['started_on'] = new Date(obj.started_on);
        obj['deadline'] = new Date(obj.deadline);
        return obj;
    }

    // TODO

    // this.dataService.getData().then((json: any) => {
    //     let idx = 0;
    //     const data = [];

    //     for (const i of athletesData) {
    //       i.CountryFlag = i.CountryFlag.toLocaleLowerCase();
    //       i.Avatar = json[idx].picture.large;
    //       i.Name = json[idx].name.first + ' ' + json[idx].name.last;
    //       idx++;
    //       data.push(i);
    //     }

    //     this.localData = data;
    //   });
}


// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
// import { tasksData } from '../taskplannergrid/taskData';


// @Injectable()
// export class RemoteDataService {
//     public remoteData: Observable<any[]>;
//     private _remoteData: BehaviorSubject<any[]>;
//     public localData = tasksData;

//     constructor(private _http: HttpClient) {
//         this._remoteData = new BehaviorSubject([]);
//         this.remoteData = this._remoteData.asObservable();
//     }

//     /**
//      *
//      */
//     public getData(): any {
//         return this.localData;
//     }

//     /**
//      * Edit record data for record with same primary key as passed object.
//      */
//     public editData(table: string, body: any): any {
//         return this._http.put(`${BASE_URL}/${table}`, body, HTTP_OPTIONS)
//             .pipe(
//                 catchError(this.handleError)
//             );
//     }

//     /**
//      * Adds new record
//      */
//     public addData(table: string, body: any): any {
//         return this._http.post(`${BASE_URL}/${table}`, body, HTTP_OPTIONS)
//             .pipe(
//                 catchError(this.handleError)
//             );
//     }

//     /**
//      * Deletes record with primary key === index
//      */
//     public deleteData(table: string, index: string): any {
//         return this._http.delete(`${BASE_URL}/${table}/${index}`, HTTP_OPTIONS)
//             .pipe(
//                 catchError(this.handleError)
//             );
//     }

//     /**
//      * Builds the URL to fetch metadata from, by attaching the `$metadata?@json` parameter to the URL
//      */
//     private _buildMetadataUrl(table: string): string {
//         const baseQueryString = `${BASE_URL}/${table}/$metadata?@json`;
//         return baseQueryString;
//     }

//     /**
//      * Builds the URL to fetch data from, attaching all passed arguments for $select and $expand queries
//      */
//     private buildDataUrl(table: string, fields?: string[], expandRel?: string): string {
//         let baseQueryString = `${BASE_URL}/${table}?$count=true`;
//         let selectQuery = EMPTY_STRING;
//         let expandQuery = EMPTY_STRING;
//         let query = EMPTY_STRING;
//         let select = EMPTY_STRING;

//         if (expandRel) {
//             expandQuery = `$expand=${expandRel}`;
//         }

//         if (fields) {
//             fields.forEach((field) => {
//                 if (field !== EMPTY_STRING) {
//                     select += `${field}, `;
//                 }
//             });
//             if (expandRel) {
//                 select += `${expandRel}`;
//             }
//             selectQuery = `$select=${select}`;
//         }

//         query += (selectQuery !== EMPTY_STRING) ? `&${selectQuery}` : EMPTY_STRING;
//         query += (expandQuery !== EMPTY_STRING) ? `&${expandQuery}` : EMPTY_STRING;

//         baseQueryString += query;

//         return baseQueryString;
//     }

//     /**
//      * Helper method that normalizes the metadata returned from API Server
//      */
//     private prepareColumnsData(fields: string[], types: string[], cb) {
//         const columns = [];

//         for (let i = 0; i < fields.length; i++) {
//             columns.push({ field: fields[i], type: (types[i] === 'string' ? 'string' : 'number') });
//         }

//         if (cb) {
//             cb(columns);
//         }
//     }

//     /**
//      * Logs if the server responded with an error.
//      */
//     private handleError(error: HttpErrorResponse) {
//         return throwError(
//             'Server is not accesible: ' + error);
//     }
// }
