import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PostCreateComponent } from '../components/post-create/post-create.component';
import { PostListComponent } from '../components/post-list/post-list.component';
import { AngularMaterialModule } from './angular-material.module';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent
    ],

    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostsModule {}