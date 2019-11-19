### Cookie

Cookie 只能同域使用，而且污染 Cookie 后还额外增加 AJAX 的请求头内容。由于 Cookie 的改变没有事件通知，所以只能采取轮询脏检查来实现业务逻辑。

### IndexedDB

使用 IndexedDB 的思路很简单：消息发送方将消息存至 IndexedDB 中；接收方则通过轮询去获取最新的信息。

打开数据库连接：
```javascript
function openStore() {
    const storeName = 'test';
    return new Promise(function (resolve, reject) {
        if (!('indexedDB' in window)) {
            return reject('IndexedDB not supported');
        }
        // 调用 open 方法打开 DB， 参数是 DB 名称和 DB 的版本号
        const DBOpenRequest = indexedDB.open('testDB', 1);
        DBOpenRequest.onerror = reject;
        // DB 打开成功 resolve 数据库连接 IDBDatabase
        DBOpenRequest.onsuccess =  e => resolve(e.target.result);
        // 创建一个新的 DB ，或者增加已存在数据库的版本号时，onupgradeneeded 事件会被触发
        // 在回调函数中定义数据库的结构
        DBOpenRequest.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (e.oldVersion === 0 && !db.objectStoreNames.contains(storeName)) {
                // 创建一个对象存储空间，设置 keyPath 为 tag
                // 存储在这个 store 中的 js 对象必须有一个名为 tag 的属性， 且每个 js 对象的 tag 属性都唯一
                const store = db.createObjectStore(storeName, { keyPath: 'tag' });
            }
        }
    });
}
```
存储数据

```javascript
function saveData(db, data) {
    const storeName = 'test';
    return new Promise(function (resolve, reject) {
        // 开启一个 readwrite 模式的事务
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        // 写入 js 对象
        const request = store.put({ tag: 'tag_0', data });
        request.onsuccess = () => resolve(db);
        request.onerror = reject;
    });
}
```
查询/读取数据
```javascript
function query(db) {
    const storeName = 'test';
    return new Promise(function (resolve, reject) {
        try {
            // 开启一个 readonly 模式的事务
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            // 读取 js 对象
            const dbRequest = store.get('tag_0');
            dbRequest.onsuccess = e => resolve(e.target.result);
            dbRequest.onerror = reject;
        }
        catch (err) {
            reject(err);
        }
    });
}
```
下面就可以使用 IndexedDB 了。

首先打开数据连接，并初始化数据：

```javascript
openStore().then(db => saveData(db, null))
```

对于消息读取，可以在连接与初始化后轮询：

```javascript
openStore().then(db => saveData(db, null)).then(function (db) {
    setInterval(function () {
        query(db).then(function (res) {
            if (!res || !res.data) {
                return;
            }
            this.message = `Received message: ${res.data.msg}`;
        });
    }, 1000);
});
```
最后，要发送消息时，只需向 IndexedDB 存储数据即可：

```javascript
openStore().then(db => saveData(db, null)).then(function (db) {
    saveData(db, {
        msg: 'test message'
    });
});
```

demo中采用了封装好的[ngx-indexed-db](https://www.npmjs.com/package/ngx-indexed-db)

参考：

https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB
