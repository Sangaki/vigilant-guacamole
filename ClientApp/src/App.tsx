import React from 'react';
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {AppLayout} from "./Pages/Layout/Layout";
import configureAppStore from "./store";

const store = configureAppStore();

export default () => (
    <Provider store={store}>
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    </Provider>
);
