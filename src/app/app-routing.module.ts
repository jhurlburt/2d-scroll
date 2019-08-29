import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FabricComponent } from './fabric/fabric.component';

const routes: Routes = [
  { path: 'fabric', component: FabricComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
