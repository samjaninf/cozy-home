import { compose, createStore, applyMiddleware } from 'redux'
import { cozyMiddleware } from 'redux-cozy-client'
import { createLogger } from 'redux-logger'
import konnectorsI18nMiddleware from 'lib/middlewares/konnectorsI18n'
import thunkMiddleware from 'redux-thunk'

import CollectStore from 'lib/CollectStore'
import flag from 'cozy-flags'
import getReducers from 'reducers'

const configureStore = (legacyClient, cozyClient, context, options = {}) => {
  // Enable Redux dev tools
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose

  const reduxStore = createStore(
    getReducers(),
    composeEnhancers(
      applyMiddleware.apply(
        this,
        [
          cozyMiddleware(legacyClient),
          konnectorsI18nMiddleware(options.lang),
          thunkMiddleware,
          flag('redux-logger') ? createLogger() : null
        ].filter(Boolean)
      )
    )
  )

  return Object.assign(
    new CollectStore(context, cozyClient, options),
    reduxStore
  )
}

export default configureStore
