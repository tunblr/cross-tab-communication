import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StorageService } from 'src/app/services/local-storage.service';

const LOCAL_STORAGE_KEY = 'local-storage-key';

@Component({
  selector: 'app-local-storage',
  templateUrl: './local-storage.component.html',
  styleUrls: ['./local-storage.component.scss']
})
export class LocalStorageComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;

  constructor(
    private readonly storageService: StorageService,
  ) { }

  ngOnInit() {
    this.storageService.changes.subscribe(method => {
      if (method.key === LOCAL_STORAGE_KEY) {
        this.message = `Received message: ${method.value.msg}`;
      }
    });
  }

  send() {
    const msg = this.inputFormControl.value;
    this.storageService.store(LOCAL_STORAGE_KEY, {
      msg,
      ts: +(new Date)
    });
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');
  }
}
