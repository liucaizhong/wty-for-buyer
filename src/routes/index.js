// configure router
import React from 'react'
import { BrowserRouter as Router,
  Route, Switch, Redirect } from 'react-router-dom'
import AsyncComponent from '../components/AsyncComponent'

const AsyncScheduleManagement = AsyncComponent(
  () => import('../components/ScheduleManagement'),
)

const App = () => (
  <Router>
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          return (
            <Redirect
              to={{
                pathname: '/schedule-m',
              }}
            />
          )
        }}
      />
      <Route path="/schedule-m" component={AsyncScheduleManagement} />
    </Switch>
  </Router>
)

export default App
