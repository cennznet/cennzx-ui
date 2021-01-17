import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {NodeConnectionTimeOut} from '../../error/error';
import {IAccounts, IEpicDependency, SingleSourceInjected} from '../../typings';
import {AppState} from '../reducers';
import action from './../actions';
import types, {
    setExtensionError,
    updateSSAccounts,
    updateSSConnected,
    updateSSDetected,
    UpdateSSDetectedAction,
    updateSSDetectionCompleted,
} from './../actions/extension.action';

const stream$ = timer(0, 5000);

export const ssExtensionDetectedEpic = (
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
                    const ssExtensionAvailable =
                        typeof window !== 'undefined' ? window.hasOwnProperty('cennznetInjected') : false;
                    if (window.cennznetInjected && extensionDetected !== ssExtensionAvailable) {
                        return of(updateSSDetected(ssExtensionAvailable, window.cennznetInjected));
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
    return combineLatest([api$, action$.pipe(ofType<UpdateSSDetectedAction>(types.DETECTION_UPDATE))]).pipe(
        switchMap(
            ([api, action]): Observable<Action<any>> => {
                const {cennznetInjected} = action.payload;
                const SS = 'singleSource';
                return from(cennznetInjected[SS].enable()).pipe(
                    switchMap((SingleSource: SingleSourceInjected) => {
                        const retObservable: Action<any>[] = [];
                        let ssExtensionConnected: boolean = null;
                        return SingleSource.accounts$.pipe(
                            withLatestFrom(store$),
                            switchMap(([ssAccounts, store]) => {
                                const {
                                    extension: {accounts},
                                } = store;
                                if (ssAccounts.length === 0 && accounts.length !== 0) {
                                    ssExtensionConnected = false;
                                } else if (accounts.length < ssAccounts.length) {
                                    ssExtensionConnected = true;
                                    // NEED TO MOVE THIS TO DETECTION EPIC ONCE SS EXTENSION IS FIXED
                                    api.setSigner(SingleSource.signer);
                                }
                                if (ssExtensionConnected !== null) {
                                    retObservable.push(updateSSConnected(ssExtensionConnected));
                                }
                                if (JSON.stringify(accounts) !== JSON.stringify(ssAccounts)) {
                                    // TODO modify check
                                    const accountList = ssAccounts.map((account: IAccounts) => ({
                                        name: account.name,
                                        address: account.address,
                                    }));
                                    retObservable.push(updateSSAccounts(accountList));
                                }
                                return from(retObservable);
                            })
                        );
                    }),
                    catchError(err => {
                        return of(setExtensionError(err));
                    })
                );
            }
        ),
        catchError(err => {
            if (err.message === 'Connection fail') {
                // return of({type: 'ERROR IN API connection', payload: new NodeConnectionTimeOut('Connection from node failed').message});
                return of(setExtensionError(new NodeConnectionTimeOut()));
            }
            return of(setExtensionError(err));
        })
    );
};

export const ssExtensionDetectionCompleted = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(ofType<UpdateSSDetectedAction>(types.DETECTION_UPDATE)).pipe(
        map(() => {
            return updateSSDetectionCompleted();
        })
    );

export default combineEpics(ssExtensionDetectedEpic, updateExtensionInformationEpic, ssExtensionDetectionCompleted);
