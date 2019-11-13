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