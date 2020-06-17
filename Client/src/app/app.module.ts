import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatBadgeModule } from '@angular/material/badge'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductComponent } from './product/product.component';
import { BigvaluePipe } from './bigvalue.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    BigvaluePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
