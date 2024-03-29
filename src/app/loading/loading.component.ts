import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() showSpinner = true;
  @Input() message: string;
  @Input() size = 'lg';
  @Input() baseSize = 24;

  get diameter(): number {
    switch (this.size) {
      case 'xl':
        return this.baseSize * 4;
      case 'lg':
        return this.baseSize * 3;
      case 'med':
        return this.baseSize * 2;
      case 'sm':
        return this.baseSize;
      default:
        return this.baseSize * 3;
    }
  }

  constructor() { }

}
