import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { DeskTable } from './desk-table'
import { Desk } from './desk'

export const RouterService = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/desk/:id' component={Desk} />
          <Route exact path='/' component={DeskTable} />
        </Switch>
      </div>
    </Router>
  )
}
