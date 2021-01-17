import Layout from 'components/Layout';
import React, {FC} from 'react';
import {LocalizeProvider} from 'react-localize-redux';
import {Provider} from 'react-redux';
import {Root} from 'react-static';
import {ThemeProvider} from 'styled-components';
import './app.css';
import store from './redux/store';
import theme from './themes';

const App: FC = () => (
    <Provider store={store}>
        <Root>
            <ThemeProvider theme={theme}>
                <LocalizeProvider store={store}>
                    <Layout></Layout>
                </LocalizeProvider>
            </ThemeProvider>
        </Root>
    </Provider>
);

export default App;
