import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import '@PUBLIC/less/reset.less';
import './less/main.less';
import AppRouter from './router';
import AppStore from './modules/store'

import Promise from 'promise-polyfill';

window.Promise = Promise;


ReactDOM.render(
    <Provider store={AppStore}>
        <AppRouter />
    </Provider>,
    document.getElementById('app')
);
