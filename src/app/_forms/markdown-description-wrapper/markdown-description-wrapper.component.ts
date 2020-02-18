import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';

@Component({
  selector: 'app-markdown-description-wrapper',
  templateUrl: './markdown-description-wrapper.component.html',
  styleUrls: ['./markdown-description-wrapper.component.scss']
})
export class MarkdownDescriptionWrapperComponent extends FieldWrapper implements AfterViewInit {
  ngAfterViewInit(): void {
    console.log('this.to.markdownDescription', this.to.markdownDescription);
  }
}

