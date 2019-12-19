import { NgModule } from "@angular/core";

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from "@angular/material";

@NgModule({
  exports: [
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule {}
