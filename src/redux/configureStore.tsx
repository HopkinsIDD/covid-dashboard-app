import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';


import rootReducer from './reducers'

export default function configureStore() {
    const middlewares: Array<any> = [thunkMiddleware];

    // This middleware will log all the state changes that happen in redux
    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware);

    return createStore(
        rootReducer,
        applyMiddleware(...middlewares),
    )
}