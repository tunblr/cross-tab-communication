### 服务端消息推送（跨域）

对于跨域的页面间通信，可以直接通过服务器与浏览器之间的消息推送来完成。

#### Server-sent events
顾名思义，就是使用服务器发送事件，浏览器负责监听。
EventSource 接口用于接收服务器发送的事件。它通过 HTTP 连接到一个服务器，以 text/event-stream 格式接收事件流, 不关闭连接。

事件流格式
事件流是一个简单的文本数据流，使用 UTF- 8 格式的编码。每条消息后面都由一个空行（\n）作为分隔符。以冒号开头的行为注释行，会被忽略。
每条消息由多个字段组成，每个字段后面也由一个空行（\n）作为分隔符，单个字段的格式为： ${key}:${value} 。
其中key有以下四种：
+ event 事件类型
+ data  消息的数据
+ id    事件ID
+ retry 重新连接的时间

```javascript
// 浏览器
// 创建EventSource对象
const es = new EventSource('/register')

// 监听所有没有指定【事件类型】的消息
es.onmessage = e => {
	console.log(e.data)
}

// 监听【事件类型】为 close 的消息
es.addEventListener('close', e => {
	console.log(e.data)
	es.close()
}, false)
```

```javascript
// 服务端（express.js）
const clients = []

// 浏览器和服务器建立连接
app.get('/register', (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream')
	clients.push(res)
  req.on('aborted', () => {
    // 浏览器连接断开后，清理clients
  })
})

// 浏览器广播数据
app.get('/broadcast', (req, res) => {
	clients.forEach(client => {
		client.write('data:hello\n\n')
  	// client.write('event:close\ndata:close\n\n')
	})
	res.status(200).end()
})
```

#### Websocket
可以采用第三方提供的消息推送方案，demo里采用了GoEasy

```javascript
// 浏览器订阅消息
goEasy.subscribe({
	channel: 'test',
	onMessage: res => {
		try {
			let message = JSON.parse(res.content);
			this.message = `Received message: ${message.msg}`;
		} catch {}
	}
});

// 浏览器发布消息
goEasy.publish({
	channel: 'test',
	message: JSON.stringify(message)
});
```

参考：

https://developer.mozilla.org/zh-CN/docs/Server-sent_events/EventSource

https://developer.mozilla.org/zh-CN/docs/Server-sent_events/Using_server-sent_events

http://www.goeasy.io/cn/doc/main.html
