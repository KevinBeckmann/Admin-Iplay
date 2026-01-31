importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDZPIYOFtfmYEeeHGOCqzHsV1a206n0-cQ",
  authDomain: "iplay-65220.firebaseapp.com",
  projectId: "iplay-65220",
  storageBucket: "iplay-65220.firebasestorage.app",
  messagingSenderId: "264955612573",
  appId: "1:264955612573:web:f5a8b2c548962f6b7d7374",
  measurementId: "G-7MC7673WPH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Lidar com mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida em background:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-512.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'iplay-admin-v1';
const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
  '/imagem.logo.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
