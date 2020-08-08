import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger';


import rootReducer from './reducers'

export default function configureStore() {
    const middlewares: Array<any> = [thunkMiddleware];

    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware);

    return createStore(
        rootReducer,
        applyMiddleware(...middlewares),
    )
}