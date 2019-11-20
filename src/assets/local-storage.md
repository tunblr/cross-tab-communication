## LocalStorage

当 LocalStorage 变化时，会触发 storage 事件。利用这个特性，我们可以在发送消息时，把消息写入到某个 LocalStorage 中；然后在各个页面内，通过监听 storage 事件即可收到通知。

```javascript
const LOCAL_STORAGE_KEY = 'local-storage-key';

// 监听 storage 事件
window.addEventListener('storage', function (e) {
    if (e.key === LOCAL_STORAGE_KEY) {
        const data = JSON.parse(e.newValue);
        console.log('data: ', data);
    }
});

// 发送消息
const msg = this.inputFormControl.value;
window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
    msg,
    ts: +(new Date)
}));
```
需要注意的是：我们在setItem的value上添加了一个当前毫秒时间戳的ts字段。因为 storage 事件只有在值改变时才会触发。

如果两次调用setItem时存储的value一致，那么第二次不会触发 storage 事件。

tips：
+ 调用setItem方法的页面下的 storage 事件不会被触发
+ storage 事件只有在发生改变的时候才会触发，即重复设置相同值不会触发事件
+ Safari 隐身模式下无法设置 localStorage 值
