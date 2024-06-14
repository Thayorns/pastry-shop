import React from 'react';
import ReactDOM from 'react-dom/client';
import App  from './app/App'
import { Provider } from 'react-redux';
import store from './app/store/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>  
)
