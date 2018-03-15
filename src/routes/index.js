// configure router
import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import AsyncComponent from '../components/AsyncComponent'

const AsyncScheduleManagement = AsyncComponent(
  () => import('../containers/CScheduleManagement'),
)

const AsyncCreateEvent = AsyncComponent(
  () => import('../components/CreateEvent'),
)

const App = ({ history }) => (
  <ConnectedRouter history={history}>
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
      <Route path="/create-e" component={AsyncCreateEvent} />
    </Switch>
  </ConnectedRouter>
)

App.propTypes = {
  history: PropTypes.object.isRequired,
}

export default App
