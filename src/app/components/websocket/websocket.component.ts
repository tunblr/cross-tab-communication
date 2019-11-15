import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import GoEasy from 'goeasy';

let goEasy = new GoEasy({
  host: 'hangzhou.goeasy.io',
  appkey: 'BC-e3a227f83cb645769494f4683a62647c',
  forceTLS: window.location.protocol === 'https:',
  onConnected: () => {
    console.log('连接成功！')
  },
  onDisconnected: () => {
    console.log('连接断开！')
  },
  onConnectFailed: error => {
    console.log('连接失败或错误！', error)
  }
});

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.scss']
})
export class WebsocketComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  private randomNum: number;

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    goEasy.subscribe({
      channel: 'test',
      onMessage: res => {
        try {
          let message = JSON.parse(res.content);
          if (this.randomNum === message.randomNum) {
            return;
          }
          this.message = `Received message: ${message.msg}`;
          this.cdr.detectChanges();
        } catch {}
      }
    });
  }

  send() {
    this.randomNum = Math.random();
    const message = {
      msg: this.inputFormControl.value,
      randomNum: this.randomNum,
    };
    goEasy.publish({
      channel: 'test',
      message: JSON.stringify(message)
    });
    this.message = `Sent message: ${message.msg}`;
    this.inputFormControl.setValue('');
  }
}
