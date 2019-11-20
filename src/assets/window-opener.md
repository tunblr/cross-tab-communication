## window的postMessage方法

只要获取了对应窗口的 window 对象，如执行 window.open() 返回的窗口引用、子页面通过 window.opener 获取的窗口引用、iframe 的 contentWindow 属性、或者是命名过或数值索引的 window.frames ，就可以调用 window.postMessage() 。

父页面通过 window.open(url, name) 获取打开的子页面的窗口引用，然后通过 postMessage 发送消息到子页面。

子页面通过 window.opener 获取到父页面的引用，然后通过 postMessage 发送消息到父页面。

首先，我们把 window.open() 打开的子页面的 window 对象收集起来：
```javascript
let childWindows = [];
open() {
    const win = window.open('./window-opener');
    childWindows.push(win);
}
```

在需要发送消息的时候，一个页面需要同时发送消息给它的父页面和子页面：
```javascript
send() {
    // 根据 window.closed 属性过滤已经关闭的窗口
    childWindows = childWindows.filter(w => !w.closed);

    // 发送给子页面
    if (childWindows.length > 0) {
        childWindows.forEach(w => w.postMessage({
            msg,
            fromOpenner: false
        }));
    }

    // 发送给父页面
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
            msg,
            fromOpenner: true
        });
    }
}
```

在接收消息时，每个页面还需要把消息传递给除了它的发送方的其他父页面和子页面：
```javascript
window.addEventListener('message', e => {
    this.message = `Received message: ${e.data.msg}`;

    // 如果这条消息是从父页面发送来的，那么 data.fromOpenner 值为 false，不再向父页面发送消息
    if (window.opener && !window.opener.closed && e.data.fromOpenner) {
        window.opener.postMessage(e.data);
    }

    // 过滤已经关闭的窗口
    childWindows = childWindows.filter(w => !w.closed);
    // 如果这条消息是从子页面发送来的，那么 data.fromOpenner 值为 true，不再向子页面发送消息（如果有多个子页面，那么其他子页面也接收不到消息）
    if (childWindows && !e.data.fromOpenner) {
        childWindows.forEach(w => w.postMessage(e.data));
    }
});
```

这里有两个问题：
1. 如果a页面打开b页面，b页面打开c页面，然后b页面被关闭了，那么a和c页面之间的联系就被打断了。
2. 如果直接在地址栏输入地址，或从其他网站的链接跳转进来，这个新的页面不会被其他页面关联上。

但是在只打开一个子页面的情况下，或者父页面中嵌入了一个或多个 iframe ，这个方案还是有用武之地的。

postMessage 方法本身兼容性较好，可以跨域传递消息，但需要获取到目标窗口引用才行，而使用 window.open() 打开跨域的页面之后，子页面无法获取 window.opener 的引用。
此外 postMessage 发送的数据不能是 Function、html DOM 元素或对象的某些属性，这是因为发送的数据经过[结构化克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)拷贝，而该算法不支持以上三种类型。

参考：

https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage

