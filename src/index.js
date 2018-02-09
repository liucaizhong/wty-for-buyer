import React from 'react'
import ReactDOM from 'react-dom'
import { addLocaleData, IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'
import App from './routes/index'
import configureStore from './configureStore'
import configureAppLocale from './configureAppLocale'
import registerServiceWorker from './registerServiceWorker'
import './index.less'

// set root font-size and make rem effective immediately
(function (doc, win) {

  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window
      ? 'orientationchange'
      : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) 
        return
      docEl.style.fontSize = 100 * (clientWidth / 640) + 'px'
    }
  if (!doc.addEventListener) 
    return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

// initialize ms-icons
initializeIcons(undefined, {
  disableWarnings: true,
})

// set locale langage data
const appLocale = configureAppLocale()
addLocaleData(appLocale.data)

// declare a redux store
const store = configureStore()

ReactDOM.render(
  <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
    <Provider store={store}>
      <App />
    </Provider>
  </IntlProvider>,
  document.getElementById('root'))
registerServiceWorker()
