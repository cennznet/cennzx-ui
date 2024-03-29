import {InjectedAccountWithMeta, InjectedExtension} from '@polkadot/extension-inject/types';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {IEpicDependency} from '../../typings';
import types from '../actions';
import {updateSelectedAccount as updateSelectedExchangeAccount} from '../actions/ui/exchange.action';
import {updateSelectedAccount as updateSelectedLiquidityAccount} from '../actions/ui/liquidity.action';
import {AppState} from '../reducers';
import action from './../actions';
import {setExtensionError, updateExAccounts, updateExConnected, updateExDetected} from './../actions/extension.action';
let web3AccountsSubscribe = null;
let web3Enable = null;

if (typeof window !== 'undefined') {
    web3Enable = require('@polkadot/extension-dapp').web3Enable;
    web3AccountsSubscribe = require('@polkadot/extension-dapp').web3AccountsSubscribe;
}

const stream$ = timer(500);

// Updated the extension detected epic to wait for a half second before calling web3Enable as it needs sometime load
export const extensionDetectedEpic = (action$: Observable<Action<any>>, store$: Observable<AppState>) =>
    action$.pipe(ofType(action.GlobalActions.INIT_APP)).pipe(
        switchMap(() => {
            return stream$.pipe(
                switchMap(() => {
                    return from(web3Enable('cennzx')).pipe(
                        switchMap((polkadotInjectedGlobal: InjectedExtension[]) => {
                            const cennznetExtensionFetched = polkadotInjectedGlobal.find(
                                ext => ext.name === 'cennznet-extension' || ext.name === 'polkadot-js'
                            );
                            let cennznetExtensionDetected = false;
                            if (typeof window !== 'undefined') {
                                let injected = (window as any).injectedWeb3['cennznet-extension'];
                                if (!injected) {
                                    injected = (window as any).injectedWeb3['polkadot-js'];
                                }
                                cennznetExtensionDetected = injected ? true : false;
                            }
                            if (cennznetExtensionFetched) {
                                return of(updateExDetected(cennznetExtensionDetected, cennznetExtensionFetched));
                            }
                            return EMPTY;
                        }),
                        catchError(err => {
                            return of(setExtensionError(err));
                        })
                    );
                })
            );
        })
    );

// This observable will keep an eyes on callback and add the account to its subscription
function checkAccountsObservable(): Observable<any> {
    return new Observable(observer => {
        web3AccountsSubscribe((accounts: InjectedAccountWithMeta[]) => {
            observer.next(accounts);
        });
    });
}

// This observable will waits till detection update is triggered and then switch the observation to the account list changes
export const observableAccountsEpic = action$ => {
    return action$.pipe(ofType(action.ExtensionActions.DETECTION_UPDATE)).pipe(
        switchMap(() => {
            return checkAccountsObservable().pipe(
                switchMap(accounts => {
                    const retObservable: Action<any>[] = [];
                    retObservable.push(updateExConnected(true));
                    const accountList = accounts.map(account => ({
                        name: account.meta.name,
                        address: account.address,
                    }));
                    retObservable.push(updateExAccounts(accountList));
                    return from(retObservable);
                })
            );
        }),
        catchError(err => {
            const retObservable: Action<any>[] = [];
            retObservable.push(updateExConnected(false));
            retObservable.push(setExtensionError(err));
            return from(retObservable);
        })
    );
};

export const updateSelectedAccountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ExtensionActions.ACCOUNTS_UPDATE))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                const accounts = store.extension.accounts;
                if (accounts.length) {
                    return from([
                        updateSelectedLiquidityAccount(accounts[0].address),
                        updateSelectedExchangeAccount(accounts[0].address),
                    ]);
                } else {
                    return from([updateSelectedLiquidityAccount(undefined), updateSelectedExchangeAccount(undefined)]);
                }
            }
        )
    );

export default combineEpics(updateSelectedAccountEpic, extensionDetectedEpic, observableAccountsEpic);
