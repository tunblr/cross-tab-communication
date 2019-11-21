let data = null;

self.addEventListener('connect', function (e) {
    const port = e.ports[0];
    setInterval(() => {
        port.postMessage(data);
    }, 1000)
    port.addEventListener('message', function (event) {
        data = event.data;
    });
    port.start();
});
