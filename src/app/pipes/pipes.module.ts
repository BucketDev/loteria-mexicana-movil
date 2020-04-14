import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UriStyleSanitizerPipe} from './uri-style-sanitizer.pipe';
import { WinnerDiffPipe } from './winner-diff.pipe';
import { LastElementsPipe } from './last-elements.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UriStyleSanitizerPipe,
    WinnerDiffPipe,
    LastElementsPipe
  ],
  exports: [
    UriStyleSanitizerPipe,
    WinnerDiffPipe,
    LastElementsPipe
  ]
})
export class PipesModule { }
