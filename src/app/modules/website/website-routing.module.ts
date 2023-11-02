import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebsiteComponent } from 'src/app/a_website/website/website.component';
import { FaqComponent } from 'src/app/paths/faq/faq.component';
import { IndexComponent } from 'src/app/paths/index/index.component';
import { InvestComponent } from 'src/app/paths/invest/invest.component';
import { PawnComponent } from 'src/app/paths/pawn/pawn.component';
import { VentasComponent } from 'src/app/paths/ventas/ventas.component';

const routes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        component: IndexComponent
      },
      {
        path: 'pawn',
        component: PawnComponent
      },
      {
        path: 'invest',
        component: InvestComponent
      },
      {
        path: 'sellings',
        component: VentasComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }