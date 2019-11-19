### BroadCast Channel
BroadCast Channel 可以创建一个用于广播的通信频道。当所有页面都监听同一频道时，其中一个页面通过它广播的消息就会被其他所有页面收到。

创建一个频道名称为broadcast-channel的频道：
```javascript
const broadcastChannel = new BroadcastChannel('broadcast-channel');
```

各个页面通过onmessage监听被广播的消息：
```javascript
broadcastChannel.onmessage = (e) => {
  this.message = `Received message: ${e.data.msg}`;
};
```

发送消息时只需要调用实例上的postMessage方法即可：
```javascript
broadcastChannel.postMessage({
  msg,
});
```

tips：

Safari 不支持 BroadcastChannel

BroadcastChannel 不会持久化，比 localStorage 方案更干净

参考：

https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API