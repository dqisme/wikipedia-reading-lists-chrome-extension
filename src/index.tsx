import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

window.chrome.cookies.getAll({ name: 'centralauth_User' }, ([cookie]) => {
  if (!cookie) {
    window.chrome.tabs.create({ url: 'https://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=Main+Page' })
  }
});