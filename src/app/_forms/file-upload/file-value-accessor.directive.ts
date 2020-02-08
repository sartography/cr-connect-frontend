import { Directive } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


/** Enables file fields to be triggered by change events */
@Directive({
  selector: '[appFileValueAccessor], input[type=file]',
  // tslint:disable-next-line
  host: {
    '(change)': 'onChange($event.target.files)',
    '(blur)': 'onTouched()',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true },
  ],
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  value: any;
  onChange = (_) => { };
  onTouched = () => { };

  writeValue(value) { }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}
