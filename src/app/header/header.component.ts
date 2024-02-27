import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IgxNavbarComponent, IgxNavbarActionDirective, IgxButtonDirective, IgxIconComponent, IgxIconButtonDirective } from '@infragistics/igniteui-angular';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [IgxNavbarComponent, IgxNavbarActionDirective, IgxButtonDirective, IgxIconComponent, IgxIconButtonDirective]
})
export class HeaderComponent implements OnInit {
    @Output() themeChanged = new EventEmitter();
    @Output() createIssueClicked = new EventEmitter();

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
