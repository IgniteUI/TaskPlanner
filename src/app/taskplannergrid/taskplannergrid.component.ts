import { Component, OnInit } from '@angular/core';
import { tasksData } from './taskData';
import { IgxColumnComponent } from 'igniteui-angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-taskplannergrid',
  templateUrl: './taskplannergrid.component.html',
  styleUrls: ['./taskplannergrid.component.scss']
})
export class TaskPlannerGridComponent implements OnInit {
  public localData: any[];
  title = 'TaskPlannerGrid';

  public columns: any[] = [
    // tslint:disable:max-line-length
    { field: 'id', header: 'ID', width: '90px', dataType: 'number'},
    { field: 'issue', header: 'Issue', width: '200px', dataType: 'string', sortable: true, filterable: true},
    { field: 'status', header: 'Status', width: '140px', dataType: 'string', sortable: true, filterable: true },
    { field: 'progress', header: 'Progress', width: '120px', dataType: 'string', sortable: true, filterable: true, hasSummary: false },
    { field: 'owner', header: 'Owner', width: '180px', dataType: 'string', groupable: true, sortable: true, filterable: true },
    { field: 'created_by', header: 'Created By', width: '180px', dataType: 'string', sortable: true, filterable: true },
    { field: 'started_on', header: 'Started on', width: '130px', dataType: 'date', sortable: true, filterable: true },
    { field: 'deadline', header: 'Deadline', width: '130px', dataType: 'date', sortable: true, filterable: true, hasSummary: false },
    { field: 'estimation', header: 'Estimation', width: '120px', dataType: 'number', sortable: true, filterable: true, hasSummary: false },
    { field: 'hours_spent', header: 'Hours Spent', width: '120px', dataType: 'number', sortable: true, filterable: true, hasSummary: false },
    { field: 'priority', header: 'Priority', width: '125px', dataType: 'string', sortable: true, filterable: true }
    // tslint:enable:max-line-length
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.localData = employeesData;
    this.dataService.getData().subscribe(data => this.localData = data);
  }

  public onColumnInit(column: IgxColumnComponent) {
    if (column.field === 'RegistererDate') {
      column.formatter = (date => date.toLocaleDateString());
    }
  }

  public getPic(cell: any) {
    return cell.row.rowData.picture;
  }
}
