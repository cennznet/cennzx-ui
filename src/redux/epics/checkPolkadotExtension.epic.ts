import {web3AccountsSubscribe, web3Enable} from '@polkadot/extension-dapp';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {bindCallback, combineLatest, from, Observable, of, timer} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import {AppState} from '../reducers';
import action from './../actions';
import {
    setExtensionError,
    updateExAccounts,
    updateExConnected,
    updateExDetected,
    updatePolkadotExtension,
} from './../actions/extension.action';

export const extensionDetectedEpic = (action$: Observable<Action<any>>, store$: Observable<AppState>) =>
    combineLatest([from(web3Enable('cennzx')), action$.pipe(ofType(action.GlobalActions.INIT_APP))]).pipe(
        withLatestFrom(store$),
        switchMap(([[polkadotInjectedGlobal], store]) => {
            const {
                extension: {extensionDetected},
            } = store;
            const polkadotExtensionFetched = polkadotInjectedGlobal.find(ext => ext.name === 'polkadot-js');
            const polkadotExtensionDetected =
                typeof window !== 'undefined' ? (window as any).injectedWeb3['polkadot-js'] : false;
            if (extensionDetected !== polkadotExtensionDetected) {
                return of(updateExDetected(polkadotExtensionDetected, polkadotExtensionFetched));
            }
            return EMPTY;
        }),
        catchError(err => {
            return of(setExtensionError(err));
        })
    );

export const updateExtensionInformationEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) => {
    const getWeb3AccountsSubscribe = bindCallback(web3AccountsSubscribe);
    const result = getWeb3AccountsSubscribe();
    return result.pipe(
        withLatestFrom(store$),
        switchMap(([exAccounts, store]) => {
            const retObservable: Action<any>[] = [];
            let polkadotExtensionConnected: boolean = null;
            const {
                extension: {accounts},
            } = store;
            if (exAccounts.length === 0 && accounts.length !== 0) {
                polkadotExtensionConnected = false;
            } else if (accounts.length <= exAccounts.length) {
                polkadotExtensionConnected = true;
            }
            if (polkadotExtensionConnected !== null) {
                retObservable.push(updateExConnected(polkadotExtensionConnected));
            }
            const accountList = exAccounts.map(account => ({
                name: account.meta.name,
                address: account.address,
            }));
            if (JSON.stringify(accounts) !== JSON.stringify(accountList)) {
                retObservable.push(updateExAccounts(accountList));
            }
            return from(retObservable);
        }),
        catchError(err => {
            return of(setExtensionError(err));
        })
    );
};

export default combineEpics(extensionDetectedEpic, updateExtensionInformationEpic);
