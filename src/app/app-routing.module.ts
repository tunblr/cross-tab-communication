import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BroadcastChannelComponent } from './components/broadcast-channel/broadcast-channel.component';
import { ServiceWorkerComponent } from './components/service-worker/service-worker.component';
import { SharedWorkerComponent } from './components/shared-worker/shared-worker.component';
import { LocalStorageComponent } from './components/local-storage/local-storage.component';
import { IndexedDbComponent } from './components/indexed-db/indexed-db.component';
import { WindowOpenerComponent } from './components/window-opener/window-opener.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'broadcast-channel',
  },
  {
    path: 'broadcast-channel',
    component: BroadcastChannelComponent,
  },
  {
    path: 'service-worker',
    component: ServiceWorkerComponent,
  },
  {
    path: 'shared-worker',
    component: SharedWorkerComponent,
  },
  {
    path: 'local-storage',
    component: LocalStorageComponent,
  },
  {
    path: 'indexed-db',
    component: IndexedDbComponent,
  },
  {
    path: 'window-opener',
    component: WindowOpenerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
