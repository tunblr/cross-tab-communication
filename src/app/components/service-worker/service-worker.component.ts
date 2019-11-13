import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-service-worker',
  templateUrl: './service-worker.component.html',
  styleUrls: ['./service-worker.component.scss']
})
export class ServiceWorkerComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  randomCheck: number;

  constructor() { }

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' });
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (this.randomCheck === e.data.randomCheck) {
          return;
        }
        this.message = `Received message: ${e.data.msg}`;
      });
    }
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomCheck = Math.random();
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      serviceWorkerRegistration.active.postMessage({
        msg,
        randomCheck: this.randomCheck,
      });
      this.message = `Sent message: ${msg}`;
    });
    this.inputFormControl.setValue('');
  }
}
