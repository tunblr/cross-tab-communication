## Shared Worker

普通的 Worker 之间是独立运行、数据互不相通，而多个标签页注册的 Shared Worker 则可以实现数据共享。我们使用 [Channel Messaging API](https://developer.mozilla.org/zh-CN/docs/Web/API/Channel_Messaging_API) 与 Worker 通信。

在Shared Worker 中定义一个 data 对象保存需要共享的数据，并且通过定时器的不断定时向主线程发送 data 对象。
主线程需要发送消息时，只需调用 postMessage 方法向 Worker 发送消息，Worker 接收到消息后更新 data 对象。这样其他页面也就能同步收到最新的消息。

具体实现如下：

首先，我们会在页面中启动一个 Shared Worker，启动方式非常简单：

```javascript
// 构造函数的第二个参数是 Shared Worker 名称，也可以留空
const worker = new SharedWorker('/shared.js');
```

```javascript
/* /shared.js: Shared Worker 代码 */
let data = null;

self.addEventListener('connect', function (e) {
    const port = e.ports[0];
    setInterval(() => {
      port.postMessage(data);
    }, 1000)；
    port.addEventListener('message', function (event) {
      data = event.data;
    });
    port.start();
});
```
之后，页面监听 Worker 返回的消息：

```javascript
worker.port.addEventListener('message', e => {
  if (this.randomNum === e.data.randomNum) {
    return;
  }
  this.message = `Received message: ${e.data.msg}`;
}, false);
worker.port.start();
```
最后，当要跨页面通信时，只需给 Shared Worker postMessage 即可：

```javascript
const msg = this.inputFormControl.value;
this.randomNum = Math.random();
worker.port.postMessage({
  msg,
  randomNum: this.randomNum,
});
this.message = `Sent message: ${msg}`;
```
注意，如果使用 addEventListener 来添加 Shared Worker 的消息监听，需要显式调用 MessagePort.start 方法，即上文中的sharedWorker.port.start()；如果使用 onmessage 绑定监听则不需要。