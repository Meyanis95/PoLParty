import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <MoralisProvider serverUrl="https://vo50bhdz2kcw.usemoralis.com:2053/server" appId="OoO4KHOUxBWUWwasnScV3yTcIzlMhgHhJjRSV9h7">
    <App />
  </MoralisProvider >
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
