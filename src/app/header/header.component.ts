import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { IgxNavbarActionDirective, IgxNavbarComponent } from '@infragistics/igniteui-angular/navbar';
import { IgxButtonDirective, IgxIconButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IgxNavbarComponent, IgxNavbarActionDirective, IgxButtonDirective, IgxIconComponent, IgxIconButtonDirective]
})
export class HeaderComponent {
    public readonly themeChanged = output<void>();
    public readonly createIssueClicked = output<void>();

    /** Constant, never reassigned — a plain field, not state. */
    public readonly icon = 'palette';

    public onCreateIssueClicked(): void {
        this.createIssueClicked.emit();
    }

    public onToggleTheme(): void {
        this.themeChanged.emit();
    }
}
