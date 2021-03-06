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
  private randomNum: number;

  constructor() { }

  ngOnInit() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' });
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (this.randomNum === e.data.randomNum) {
          return;
        }
        this.message = `Received message: ${e.data.msg}`;
      });
    }
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      serviceWorkerRegistration.active.postMessage({
        msg,
        randomNum: this.randomNum,
      });
      this.message = `Sent message: ${msg}`;
    });
    this.inputFormControl.setValue('');
  }
}
