import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BroadcastChannelComponent } from './components/broadcast-channel/broadcast-channel.component';
import { ServiceWorkerComponent } from './components/service-worker/service-worker.component';
import { SharedWorkerComponent } from './components/shared-worker/shared-worker.component';
import { LocalStorageComponent } from './components/local-storage/local-storage.component';
import { IndexedDbComponent } from './components/indexed-db/indexed-db.component';
import { WindowOpenerComponent } from './components/window-opener/window-opener.component';
import { StorageService } from './services/local-storage.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BroadcastChannelComponent,
    ServiceWorkerComponent,
    SharedWorkerComponent,
    LocalStorageComponent,
    IndexedDbComponent,
    WindowOpenerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
