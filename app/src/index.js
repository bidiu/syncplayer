import './app/bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/bootstrap/store';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app/App';

import './index.css';

ReactDOM.render((
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  ), 
  document.getElementById('root')
);
