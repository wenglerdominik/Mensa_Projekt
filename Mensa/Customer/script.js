
//Erkennen ob Browser SW unterstützt

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js', {
        scope: './'
    }).then(() => console.log('Service Worker registriert.'));

}