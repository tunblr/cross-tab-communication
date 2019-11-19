import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BroadcastChannelComponent } from './components/broadcast-channel/broadcast-channel.component';
import { ServiceWorkerComponent } from './components/service-worker/service-worker.component';
import { SharedWorkerComponent } from './components/shared-worker/shared-worker.component';
import { LocalStorageComponent } from './components/local-storage/local-storage.component';
import { IndexedDbComponent } from './components/indexed-db/indexed-db.component';
import { WindowOpenerComponent } from './components/window-opener/window-opener.component';
import { WebsocketComponent } from './components/websocket/websocket.component';
import { IframeComponent } from './components/iframe/iframe.component';
import { StorageService } from './services/local-storage.service';

const dbConfig: DBConfig = {
  name: 'MessageDb', version: 1, objectStoresMeta: [
    {
      store: 'test',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'msg', keypath: 'msg', options: { unique: false } },
        { name: 'randomNum', keypath: 'randomNum', options: { unique: false } }
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    BroadcastChannelComponent,
    ServiceWorkerComponent,
    SharedWorkerComponent,
    LocalStorageComponent,
    IframeComponent,
    IndexedDbComponent,
    WindowOpenerComponent,
    WebsocketComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    NgxIndexedDBModule.forRoot(dbConfig),
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
