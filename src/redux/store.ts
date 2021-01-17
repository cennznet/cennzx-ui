import {ApiRx} from '@cennznet/api';
import {applyMiddleware, compose, createStore} from 'redux';
import {createEpicMiddleware} from 'redux-observable';
import {EMPTY} from 'rxjs';
import {IEpicDependency} from '../typings';
import actions from './actions';
import {getDevToolsExt} from './devTools';
import {hotReloadingEpic} from './epics/hotReloadingEpic';
import reducer, {AppState} from './reducers';

const cennzNetApi = typeof window !== 'undefined' ? ApiRx.create({provider: window.config.ENDPOINT}) : EMPTY;
const epicMiddleware = createEpicMiddleware<any, any, AppState, IEpicDependency>({
    dependencies: {api$: cennzNetApi},
});

const store = createStore(
    reducer,
    compose(
        applyMiddleware(epicMiddleware),
        ...getDevToolsExt()
    )
);

epicMiddleware.run(hotReloadingEpic);
store.dispatch({type: actions.GlobalActions.INIT_APP});

export default store;
