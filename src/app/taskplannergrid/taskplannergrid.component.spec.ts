import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskPlannerGridComponent } from './taskplannergrid.component';
import { IgxGridModule } from 'igniteui-angular';

describe('TaskPlannerGridComponent', () => {
  let component: TaskPlannerGridComponent;
  let fixture: ComponentFixture<TaskPlannerGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPlannerGridComponent ],
      imports: [ NoopAnimationsModule, IgxGridModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPlannerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
