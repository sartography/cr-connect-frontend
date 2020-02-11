import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ToFormlyPipe} from './to-formly.pipe';


@NgModule({
  declarations: [ToFormlyPipe],
  imports: [
    CommonModule
  ],
  exports: [ToFormlyPipe]
})
export class PipesModule {
}
