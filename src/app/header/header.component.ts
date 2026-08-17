import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { IgxNavbarActionDirective, IgxNavbarComponent } from '@infragistics/igniteui-angular/navbar';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [IgxNavbarComponent, IgxNavbarActionDirective, IgxButtonDirective, IgxIconComponent, IgxIconButtonDirective, IgxRippleDirective]
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
