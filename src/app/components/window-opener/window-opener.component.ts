import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-window-opener',
  templateUrl: './window-opener.component.html',
  styleUrls: ['./window-opener.component.scss']
})
export class WindowOpenerComponent implements OnInit {
  inputFormControl = new FormControl({ value: [''], disabled: true });
  message: string;
  disabled = true;
  private childWins = [];
  private randomNum: number;

  constructor() { }

  ngOnInit() {
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
      this.childWins = this.childWins.filter(w => !w.closed);
      // do not send message back
      if (this.childWins && !e.data.fromOpenner) {
        this.childWins.forEach(w => w.postMessage(e.data));
      }
    });

    if (this.childWins.length === 0 && !window.opener) {
      this.inputFormControl.disable();
      this.disabled = true;
    }
  }

  open() {
    const win = window.open('./?new=1');
    this.childWins.push(win);
    this.inputFormControl.enable();
    this.disabled = false;
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');

    // release reference when window closed
    this.childWins = this.childWins.filter(w => !w.closed);

    if (this.childWins.length > 0) {
      this.childWins.forEach(w => w.postMessage({
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
