import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  private randomNum: number;

  constructor() { }

  ngOnInit() {
    window.addEventListener('message', e => {
      if (this.randomNum === e.data.randomNum) {
        return;
      }
      this.message = `Received message: ${e.data.msg}`;
    }, false);
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    window.frames[0].window.postMessage({
      msg,
      randomNum: this.randomNum,
    }, '*');
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');
  }
}
