import React from 'react'
import { BrowserRouter, HashRouter, Route, Switch, Redirect } from 'react-router-dom'

import Home from '../containers/home';
import Detail from '../containers/detail';
import User from '../containers/user';
import Error from '../containers/error';

export default () => (
    <HashRouter>
        <div>
            <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/detail' component={Detail}/>
                <Route path='/user' component={User}/>
                <Route component={Error}/>
            </Switch>
        </div>
    </HashRouter>
)
