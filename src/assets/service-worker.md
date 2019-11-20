## Service Worker
Service Worker 是 PWA （渐进式Web应用）中的核心技术之一，不过在这里用它来做页面间通信。

Service Worker 是一个可以长期运行在后台的 Worker，能够实现与页面的双向通信。多页面注册的同一个 Service Worker 可以共享，将 Service Worker 作为消息中转站即可实现广播效果。

首先，在页面注册 Service Worker：

```javascript
/* 页面的代码 */
navigator.serviceWorker.register('/sw.js', { scope: '/' });
```
Service Worker 本身并不具备“广播”的功能，添加一些代码，将其改造成消息中转站：

```javascript
/* Service Worker 的代码 */
self.addEventListener('message', function (e) {
  e.waitUntil(
    clients.matchAll({ includeUncontrolled: true }).then(clients => {
      if (!clients || clients.length === 0) {
        return;
      }
      clients.forEach(client => {
        client.postMessage(e.data);
      });
    })
  );
});
```

我们在 Service Worker 中监听了 message 事件，获取页面（从 Service Worker 的角度叫 client ）发送的信息。
然后通过 clients.matchAll() 获取当前注册了该 Service Worker 的所有页面，通过调用 client.postMessage() 方法，向页面发送消息。这样就把从某个 client 收到的消息通知给了其他 client 。

注：[waitUntil](https://developer.mozilla.org/zh-CN/docs/Web/API/ExtendableEvent/waitUntil)：在 Worker 工作线程中，延长事件的寿命从而阻止浏览器在事件中的异步操作完成之前终止 Worker 工作线程。

然后需要在页面监听 Service Worker 发送来的消息：
```javascript
/* 页面的代码 */
navigator.serviceWorker.addEventListener('message', (e) => {
  if (this.randomNum === e.data.randomNum) {
    return;
  }
  this.message = `Received message: ${e.data.msg}`;
});
```

当需要广播消息时，可以调用 postMessage 方法把消息发送给 Service Worker ：
```javascript
/* 页面的代码 */
const msg = this.inputFormControl.value;
this.randomNum = Math.random();
navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
  serviceWorkerRegistration.active.postMessage({
    msg,
    randomNum: this.randomNum,
  });
  this.message = `Sent message: ${msg}`;
});
```

参考：

https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker

https://developer.mozilla.org/zh-CN/docs/Web/API/Clients