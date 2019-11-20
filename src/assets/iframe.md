## 嵌入 iframe 跨域通信

除了服务端消息推送，还可以通过在不同源的页面里嵌入 iframe 的方式来做跨域通信。
由于 iframe 与父页面间可以通过指定 origin 来忽略同源限制，因此可以在每个页面中嵌入一个 iframe，而这些 iframe 由于使用的是一个 url，因此属于同源页面，其通信方式可以使用上面提到的各种同源页面的方式。

父页面与 iframe 通信非常简单，首先需要在页面中监听 iframe 发来的消息，做相应的业务处理：

```javascript
/* 父页面代码 */
window.addEventListener('message', function (e) {
    // …… do something
});
```

然后，当父页面要与其他的同源或非同源的父页面通信时，会先给 iframe 发送消息：

```javascript
/* 父页面代码 */
window.frames[0].window.postMessage(mydata, '*');
```
其中为了简便此处将 postMessage 的第二个参数设为了'*'，你也可以设为 iframe 的 URL。
iframe 收到消息后，可以使用任意一种跨页面通信方式在所有 iframe 间同步消息，例如使用 Broadcast Channel：

```javascript
/* iframe 内代码 */
const bc = new BroadcastChannel('broadcast-channel');
// 收到来自父页面的消息后，在 iframe 间进行广播
window.addEventListener('message', function (e) {
    bc.postMessage(e.data);
});
```

其他 iframe 收到通知后，则会将该消息同步给所属的父页面：

```javascript
/* iframe 内代码 */
// 对于收到的来自 iframe 的广播消息，通知给所属的父页面
bc.onmessage = function (e) {
    window.parent.postMessage(e.data, '*');
};
```
