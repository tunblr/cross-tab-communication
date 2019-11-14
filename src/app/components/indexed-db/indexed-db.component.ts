import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-indexed-db',
  templateUrl: './indexed-db.component.html',
  styleUrls: ['./indexed-db.component.scss']
})
export class IndexedDbComponent implements OnInit {
  inputFormControl = new FormControl('');
  message: string;
  private randomNum: number;
  private intervalTimer: number;

  constructor(
    private dbService: NgxIndexedDBService
  ) {
    dbService.currentStore = 'test';
  }

  ngOnInit() {
    this.intervalTimer = window.setInterval(() => {
      this.dbService.getAll().then((data: { randomNum: number; msg: string; }[]) => {
        if (!data || !data.length) {
          return;
        }
        if (this.randomNum === data[data.length - 1].randomNum) {
          return;
        }
        this.message = `Received message: ${data[data.length - 1].msg}`;
      });
    }, 1000);
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalTimer);
    this.dbService.clear();
  }

  send() {
    const msg = this.inputFormControl.value;
    this.randomNum = Math.random();
    this.dbService.add({
      msg,
      randomNum: this.randomNum,
    }).then(
      () => {
        this.message = `Sent message: ${msg}`;
        this.inputFormControl.setValue('');
      }
    );
  }
}
