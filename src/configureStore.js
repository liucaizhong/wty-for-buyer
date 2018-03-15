import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import sagas from './sagas'

export default function configureStore(preloadedState) {
  // advanced use of redux dev tools
  // eslint-disable-next-line
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const sagaMiddleware = createSagaMiddleware()
  const history = createHistory()
  const routeMiddleware = routerMiddleware(history)

  const store = createStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware,
        routeMiddleware,
      ),
    ),
  )
  sagaMiddleware.run(sagas)

  return {
    store,
    history,
  }
}
