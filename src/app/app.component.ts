import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from './services/local-storage.service';

const SELECTED_METHOD_KEY = 'selected-method';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cross-tab-communication';
  selectedMethod = 'broadcast-channel';
  methods: {
    key: string;
    value: string;
  }[] = [
    {key: 'broadcast-channel', value: 'Broadcast Channel'},
    {key: 'service-worker', value: 'Service Worker'},
    {key: 'shared-worker', value: 'Shared Worker'},
    {key: 'local-storage', value: 'localStorage'},
    {key: 'indexed-db', value: 'IndexedDB / Cookie'},
    {key: 'window-opener', value: 'window.postMessage()'},
    {key: 'websocket', value: '服务端消息推送'},
    {key: 'iframe', value: '嵌入 iframe 跨域通信'},
  ];

  methodChanged = method => {
    this.storageService.store(SELECTED_METHOD_KEY, method.value);
    this.router.navigate([method.value], {
      relativeTo: this.activatedRoute,
    });
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly storageService: StorageService,
  ) {}

  ngOnInit() {
    this.selectedMethod = this.storageService.get(SELECTED_METHOD_KEY);
    this.router.navigate([this.selectedMethod], {
      relativeTo: this.activatedRoute,
    });
    this.storageService.changes.subscribe(method => {
      if (method.key === SELECTED_METHOD_KEY && this.selectedMethod !== method.value) {
        this.selectedMethod = method.value;
        this.router.navigate([method.value], {
          relativeTo: this.activatedRoute,
        });
      }
    });
  }
}
