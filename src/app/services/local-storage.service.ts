import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from "rxjs";
import { share } from 'rxjs/operators';

@Injectable()
export class StorageService implements OnDestroy {
  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  constructor() {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  public getStorage() {
    let s = [];
    for (let i = 0; i < localStorage.length; i++) {
      s.push({
        key: localStorage.key(i),
        value: JSON.parse(localStorage.getItem(localStorage.key(i)))
      });
    }
    return s;
  }

  public store(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
    this.onSubject.next({ key: key, value: data })
  }

  public get(key: string) {
    let v;
    const value = localStorage.getItem(key);
    try {
      v = JSON.parse(value);
    } catch (e) {
      v = value;
    }
    return v;
  }

  public clear(key) {
    localStorage.removeItem(key);
    this.onSubject.next({ key: key, value: null });
  }

  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      let v;
      try {
        v = JSON.parse(event.newValue);
      } catch (e) {
        v = event.newValue;
      }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }
}