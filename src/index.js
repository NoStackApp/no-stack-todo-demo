import React from 'react';
import ReactDOM from 'react-dom';
import { NoStackProvider, Console } from '@nostack/no-stack';

import { PLATFORM_ID } from './config';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import client from './client';

ReactDOM.render(
  <NoStackProvider client={client} platformId={PLATFORM_ID}>
    <App />
    <Console />
  </NoStackProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
