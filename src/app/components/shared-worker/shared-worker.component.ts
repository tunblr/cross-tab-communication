import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

const worker = new SharedWorker('/shared.js');

@Component({
  selector: 'app-shared-worker',
  templateUrl: './shared-worker.component.html',
  styleUrls: ['./shared-worker.component.scss']
})
export class SharedWorkerComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  private randomNum: number;

  constructor() { }

  ngOnInit() {
    worker.port.addEventListener('message', e => {
      if (!e.data || this.randomNum === e.data.randomNum) {
        return;
      }
      this.message = `Received message: ${e.data.msg}`;
    }, false);
    worker.port.start();
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
