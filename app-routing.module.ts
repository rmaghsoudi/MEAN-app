import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from 'src/app/posts/post-list/post-list.component';
import { PostCreateComponent } from 'src/app/posts/post-create/post-create.component';
import { LoginComponent } from 'src/app/auth/login/login.component';


const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent},
  { path: 'edit/:postId', component: PostCreateComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
