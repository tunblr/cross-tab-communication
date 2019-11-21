## 跨标签页通信的场景

- A 页面中通过 window.open() 打开 B 页面，或者 B 页面通过 iframe 嵌入至 A 页面

- 同时打开多个Tab页，每个Tab页直接共享状态

## 方案思路

- 将需要共享的数据存储到某一位置，所有页面通过事件回调或者轮询读取数据

- 使用浏览器提供的 Web API 进行通信

## 同源策略

Web浏览器允许第一个网页中包含的脚本访问第二个网页中的数据，但前提是两个网页的来源相同。来源定义为URI方案，主机名和端口号的组合。此策略可防止一个页面上的恶意脚本通过该页面的文档对象模型来访问另一网页上的敏感数据。

## 同源页面间的通信方案

1. LocalStorage

2. BroadCast Channel

  BroadCast Channel 用于浏览器上下文（window、标签页、iframe）间的通信，这些上下文需要同源。

3. Shared Worker

  Web Worker 为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。

  Web Worker 分为两种类型，一个是专用线程 Dedicated Worker，一个是共享线程 Shared Worker。

  - Dedicated Worker 直接使用 new Worker() 创建，这种 Worker 是创建这个 Worker 的页面专有的。
  - SharedWorker 可以被多个 window、标签页、iframe 共用，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)。

4. Service Worker

  与 Web Worker 类似，都是在 JS 主线程外创建新线程。

  不同之处在于：
  - Service Worker 会常驻在浏览器中，即便注册它的页面已经关闭，Service Worker 也不会停止。本质上它是一个后台线程，只有你主动终结，或者浏览器回收，这个线程才会结束。
  - 生命周期、可调用的 API 不同，有一些用于操纵浏览器网络和缓存的 API 和事件。

5. IndexedDB / Cookie

6. 获取对应窗口的引用，调用 window.postMessage()

## 非同源页面间的通信方案

1. 基于服务端 - websocket 或者 SSE

2. 每个非同源页面各嵌入一个 iframe 作为 “桥”

3. 前端定期保存修改的数据到服务器，然后通过 `onvisibilitychange`、`window.onpageshow` 等事件回调时重新获取数据，更新页面数据内容

参考：

https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers

https://github.com/youngwind/blog/issues/113