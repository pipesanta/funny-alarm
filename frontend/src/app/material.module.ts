import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatInputModule} from '@angular/material/input';


const MODULES = [ MatButtonModule, MatIconModule, MatMenuModule, MatSlideToggleModule, MatExpansionModule, MatInputModule];

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class MaterialModule { }