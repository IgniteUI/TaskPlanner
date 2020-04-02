import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() themeChanged = new EventEmitter<any>();
    @Output() createIssueClicked = new EventEmitter<any>();

    public icon = 'palette';

    public ngOnInit(): void {
    }

    public onCreateIssueClicked() {
      this.createIssueClicked.emit();
    }

    onToggleTheme() {
      this.themeChanged.emit();
    }
}
