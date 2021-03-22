import {web3Accounts, web3Enable} from '@polkadot/extension-dapp';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {NodeConnectionTimeOut} from '../../error/error';
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

const stream$ = timer(1000, 10000);

export const extensionDetectedEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(ofType(action.GlobalActions.INIT_APP)).pipe(
        switchMap(() => {
            return stream$.pipe(
                withLatestFrom(store$),
                switchMap(([, store]) => {
                    const {
                        extension: {extensionDetected},
                    } = store;
                    const polkadotExtensionAvailable =
                        typeof window !== 'undefined' ? (window as any).injectedWeb3['polkadot-js'] : false;
                    if (extensionDetected !== polkadotExtensionAvailable) {
                        return of(
                            updateExDetected(polkadotExtensionAvailable, (window as any).injectedWeb3['polkadot-js'])
                        );
                    }
                    return EMPTY;
                })
            );
        })
    );

export const updateExtensionInformationEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) => {
    return combineLatest([api$, action$.pipe(ofType(action.GlobalActions.INIT_APP))]).pipe(
        switchMap(([api]) => {
            return stream$.pipe(
                // After every ten second check if a new account is created/extension is uninstalled
                switchMap(() => {
                    return from(web3Enable('cennzx')).pipe(
                        switchMap(polkadotInjectedGlobal => {
                            const polkadotExtensionFetched = polkadotInjectedGlobal.find(
                                ext => ext.name === 'polkadot-js'
                            );
                            const retObservable: Action<any>[] = [];
                            let polkadotExtensionConnected: boolean = null;
                            return from(web3Accounts()).pipe(
                                withLatestFrom(store$),
                                switchMap(([exAccounts, store]) => {
                                    const {
                                        extension: {accounts, polkadotExtension},
                                    } = store;
                                    if (exAccounts.length === 0 && accounts.length !== 0) {
                                        polkadotExtensionConnected = false;
                                    } else if (accounts.length < exAccounts.length) {
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
                                    if (
                                        JSON.stringify(polkadotExtension) !== JSON.stringify(polkadotExtensionFetched)
                                    ) {
                                        retObservable.push(updatePolkadotExtension(polkadotExtensionFetched));
                                    }
                                    return from(retObservable);
                                })
                            );
                        }),
                        catchError(err => {
                            return of(setExtensionError(err));
                        })
                    );
                }),
                catchError(err => {
                    if (err.message === 'Connection fail') {
                        return of(setExtensionError(new NodeConnectionTimeOut()));
                    }
                    return of(setExtensionError(err));
                })
            );
        })
    );
};

export default combineEpics(extensionDetectedEpic, updateExtensionInformationEpic);
