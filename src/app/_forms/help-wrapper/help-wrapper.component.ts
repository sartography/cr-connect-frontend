import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FieldWrapper} from '@ngx-formly/core';
import {HelpDialogComponent} from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-help-wrapper',
  templateUrl: './help-wrapper.component.html',
  styleUrls: ['./help-wrapper.component.scss']
})
export class HelpWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matSuffix', {static: true}) matSuffix: TemplateRef<any>;
  expanded = false;

  constructor(
    public dialog: MatDialog
  ) {
    super();
  }

  ngAfterViewInit() {
    console.log('this.to', this.to);
    if (this.matSuffix) {
      Promise.resolve().then(() => {
        this.to.suffix = this.matSuffix;
        console.log('this.to.suffix', this.to.suffix);
      });
    }
  }

  openDialog($event: MouseEvent, title: string, text: string) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(HelpDialogComponent, {
      width: '600px',
      data: {title, text}
    });
  }
}
