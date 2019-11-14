import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

let childWins = [];

@Component({
  selector: 'app-window-opener',
  templateUrl: './window-opener.component.html',
  styleUrls: ['./window-opener.component.scss']
})
export class WindowOpenerComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  disabled = false;
  private randomNum: number;

  constructor() { }

  ngOnInit() {
    if (!childWins.length && !window.opener) {
      this.inputFormControl.disable();
      this.disabled = true;
    }
    window.addEventListener('message', e => {
      if (this.randomNum === e.data.randomNum) {
        return;
      }
      this.message = `Received message: ${e.data.msg}`;

      // do not send message back
      if (window.opener && !window.opener.closed && e.data.fromOpenner) {
        window.opener.postMessage(e.data);
      }

      // release reference when window closed
      childWins = childWins.filter(w => !w.closed);
      // do not send message back
      if (childWins && !e.data.fromOpenner) {
        childWins.forEach(w => w.postMessage(e.data));
      }
    });

    if (childWins.length === 0 && !window.opener) {
      this.inputFormControl.disable();
      this.disabled = true;
    }
  }

  open() {
    const win = window.open('./?new=1');
    childWins.push(win);
    this.inputFormControl.enable();
    this.disabled = false;
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');

    // release reference when window closed
    childWins = childWins.filter(w => !w.closed);

    if (childWins.length > 0) {
      childWins.forEach(w => w.postMessage({
        msg,
        randomNum: this.randomNum,
        fromOpenner: false
      }));
    }

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        msg,
        randomNum: this.randomNum,
        fromOpenner: true
      });
    }
  }
}
