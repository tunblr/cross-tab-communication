### Shared Worker
Shared Worker 本身并不是为了解决通讯需求的，它的设计初衷应该是类似总控。普通的 Worker 之间是独立运行、数据互不相通，而多个标签页注册的 Shared Worker 则可以实现数据共享。
Shared Worker 可以被多个 window 共同使用，但必须保证这些标签页都是同源的。
Shared Worker 无法主动通知所有页面，所以还是采用轮询的方式来获取数据。思路如下：

让 Shared Worker 支持两种消息。一种是 post，Shared Worker 收到后会将该数据保存下来；另一种是 get，Shared Worker 收到该消息后会将保存的数据通过 postMessage 传给注册它的页面。也就是让页面通过 get 来同步消息。

具体实现如下：

首先，我们会在页面中启动一个 Shared Worker，启动方式非常简单：

```javascript
// 构造函数的第二个参数是 Shared Worker 名称，也可以留空
const worker = new SharedWorker('/shared.js');
```
然后，在该 Shared Worker 中支持 get 与 post 形式的消息：

```javascript
/* /shared.js: Shared Worker 代码 */
let data = null;

self.addEventListener('connect', function (e) {
    const port = e.ports[0];
    port.addEventListener('message', function (event) {
        if (event.data.get) {
            data && port.postMessage(data);
        }
        else {
            data = event.data;
        }
    });
    port.start();
});
```
之后，页面定时发送 get 指令的消息给 Shared Worker，轮询最新的消息数据，并在页面监听返回信息：

```javascript
// 定时轮询，发送 get 指令的消息
this.intervalTimer = window.setInterval(() => {
  worker.port.postMessage({ get: true });
}, 1000);
```

```javascript
// 监听 get 消息的返回数据
worker.port.addEventListener('message', e => {
  if (this.randomNum === e.data.randomNum) {
    return;
  }
  this.message = `Received message: ${e.data.msg}`;
}, false);
worker.port.start();
```
最后，当要跨页面通信时，只需给 Shared Worker postMessage即可：

```javascript
const msg = this.inputFormControl.value;
this.randomNum = Math.random();
worker.port.postMessage({
  msg,
  randomNum: this.randomNum,
});
this.message = `Sent message: ${msg}`;
```
注意，如果使用addEventListener来添加 Shared Worker 的消息监听，需要显式调用MessagePort.start方法，即上文中的sharedWorker.port.start()；如果使用onmessage绑定监听则不需要。