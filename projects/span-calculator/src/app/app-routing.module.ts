import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PrintLayoutComponent } from './print-layout/print-layout.component';
// import { GraphPrintComponent } from './graph-print/graph-print.component';

const routes: Routes = [ 
  // {
  //   path: 'print',
  //   outlet: 'print',
  //   component: PrintLayoutComponent,
  //   children: [
  //     { path: 'graph-print', component: GraphPrintComponent}
  //   ] 
  // },
  // {
  //   path: '**', redirectTo: '/', pathMatch: 'full'
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}