export function register(config) {
    if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('service-worker.js').then(function (registration) {
            console.log('Worker registration successful', registration.scope);
        }, function (err) {
            console.log('Worker registration failed', err);
        }).catch(function (err) {
            console.log(err);
        });

    }

}

