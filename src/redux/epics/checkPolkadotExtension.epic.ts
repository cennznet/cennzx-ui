import {web3AccountsSubscribe, web3Enable} from '@polkadot/extension-dapp';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, switchMap} from 'rxjs/operators';
import {AppState} from '../reducers';
import action from './../actions';
import {setExtensionError, updateExAccounts, updateExConnected, updateExDetected} from './../actions/extension.action';

export const extensionDetectedEpic = (action$: Observable<Action<any>>, store$: Observable<AppState>) =>
    combineLatest([from(web3Enable('cennzx')), action$.pipe(ofType(action.GlobalActions.INIT_APP))]).pipe(
        switchMap(([polkadotInjectedGlobal]) => {
            const polkadotExtensionFetched = polkadotInjectedGlobal.find(ext => ext.name === 'polkadot-js');
            const polkadotExtensionDetected =
                typeof window !== 'undefined' ? (window as any).injectedWeb3['polkadot-js'] : false;
            if (polkadotExtensionFetched) {
                return of(updateExDetected(polkadotExtensionDetected, polkadotExtensionFetched));
            }
            return EMPTY;
        }),
        catchError(err => {
            return of(setExtensionError(err));
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
        checkAccountsObservable,
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

export default combineEpics(extensionDetectedEpic, observableAccountsEpic);