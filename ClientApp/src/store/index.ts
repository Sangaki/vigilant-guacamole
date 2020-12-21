import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import {rootReducer} from './reducers'

export default function configureAppStore(preloadedState?: RootStateI) {
    return configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware()],
        preloadedState,
    })
}

export type RootStateI = ReturnType<typeof rootReducer>;