import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';

const broadcastChannel = new BroadcastChannel('broadcast-channel');

@Component({
  selector: 'app-broadcast-channel',
  templateUrl: './broadcast-channel.component.html',
  styleUrls: ['./broadcast-channel.component.scss']
})
export class BroadcastChannelComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;

  constructor(
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    broadcastChannel.onmessage = (e) => {
      this.message = `Received message: ${e.data.msg}`;
      this.cdr.detectChanges();
    };
    broadcastChannel.onmessageerror = (e) => {
      console.log(e);
    };
  }

  send() {
    const msg = this.inputFormControl.value;
    broadcastChannel.postMessage({
      msg,
    });
    this.message = `Sent message: ${msg}`;
    this.inputFormControl.setValue('');
  }
}
