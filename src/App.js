// 应用的根组件
import React,{ Component } from 'react'
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                  <Route path="/login" component={Login}></Route>
                  <Route path="/" component={Admin}></Route>
                </Switch>
            </Router>
        )
    }
}