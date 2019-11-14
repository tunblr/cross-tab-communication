import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

const worker = new SharedWorker('/shared.js');

@Component({
  selector: 'app-shared-worker',
  templateUrl: './shared-worker.component.html',
  styleUrls: ['./shared-worker.component.scss']
})
export class SharedWorkerComponent implements OnInit, OnDestroy {
  inputFormControl = new FormControl('');
  message: string;
  private randomNum: number;
  private intervalTimer: number;

  constructor() { }

  ngOnInit() {
    this.intervalTimer = window.setInterval(() => {
      worker.port.postMessage({ get: true });
    }, 1000);

    worker.port.addEventListener('message', e => {
      if (this.randomNum === e.data.randomNum) {
        return;
      }
      this.message = `Received message: ${e.data.msg}`;
    }, false);
    worker.port.start();
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalTimer);
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    worker.port.postMessage({
      msg,
      randomNum: this.randomNum,
    });
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');
  }
}
