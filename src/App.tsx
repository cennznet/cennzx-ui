import React, {FC} from 'react';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import {Root} from 'react-static';
import {ThemeProvider} from 'styled-components';
import './app.css';
import Layout from './components/Layout';
import store from './redux/store';
import theme from './themes';

const App: FC = () => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <LocalizeProvider store={store}>
                <Layout></Layout>
            </LocalizeProvider>
        </ThemeProvider>
    </Provider>
);

export default App;
