import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DATA_KEY } from './config';

ReactDOM.render(<App />, document.getElementById('root'));

window.chrome.cookies.getAll({ name: 'centralauth_User' }, ([cookie]) => {
  if (!cookie) {
    window.chrome.tabs.create({ url: 'https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page' })
  }
});

window.chrome.runtime.onStartup.addListener(() => {
  localStorage.removeItem(DATA_KEY)
})

window.chrome.runtime.onInstalled.addListener(() => {
  localStorage.removeItem('allEntries')
})