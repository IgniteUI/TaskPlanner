import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Output() createIssueClicked = new EventEmitter<any>();

    public ngOnInit(): void {
    }

    public onCreateIssueClicked() {
      this.createIssueClicked.emit();
    }

}
