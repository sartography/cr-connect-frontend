import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FieldWrapper} from '@ngx-formly/core';
import {MarkdownService} from 'ngx-markdown';
import {HelpDialogComponent} from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-help-wrapper',
  templateUrl: './help-wrapper.component.html',
  styleUrls: ['./help-wrapper.component.scss']
})
export class HelpWrapperComponent extends FieldWrapper implements OnInit, AfterViewInit {
  @ViewChild('matSuffix', {static: false}) matSuffix: TemplateRef<any>;
  expanded = false;

  constructor(
    public dialog: MatDialog,
    private markdownService: MarkdownService
  ) {
    super();
  }

  ngOnInit(): void {
    const linkRenderer = this.markdownService.renderer.link;
    this.markdownService.renderer.link = (href, title, text) => {
      const html = linkRenderer.call(this.markdownService.renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ')
    };
  }

  ngAfterViewInit() {
    if (this.matSuffix) {
      Promise.resolve().then(() => {
        this.to.suffix = this.matSuffix;
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
