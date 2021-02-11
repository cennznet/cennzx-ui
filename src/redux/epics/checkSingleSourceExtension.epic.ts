import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, from, Observable, of, timer} from 'rxjs';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {NodeConnectionTimeOut} from '../../error/error';
import {IAccounts, IEpicDependency, PolkadotInjectedGlobal} from '../../typings';
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
import {
    web3AccountsSubscribe,
    web3Enable,
    web3Accounts,
    isWeb3Injected,
    web3FromSource,
} from '@polkadot/extension-dapp';

const stream$ = timer(1000);

web3Enable('cennzx');

export const ssExtensionDetectedEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(ofType(action.GlobalActions.INIT_APP)).pipe(
        switchMap(() => {
            return stream$.pipe(
                withLatestFrom(store$),
                // from(web3Enable('cennzx')),
                switchMap(([sec, store]) => {
                    // console.log('Sec::', sec);
                    // console.log('Store::', store);
                    // const injectedPromise =  web3Enable('cennzx');
                    // console.log('**********::::::', injectedPromise);
                    const {
                        extension: {extensionDetected},
                    } = store;
                    // if (isWeb3Injected && window.injectedWeb3['polkadot-js']) {
                    //     //alert(window.injectedWeb3);
                    // }
                    // alert('####',window.injectedWeb3);
                    const ssExtensionAvailable =
                        typeof window !== 'undefined' ? (window as any).injectedWeb3['polkadot-js'] : false;
                    if (extensionDetected !== ssExtensionAvailable) {
                        return of(updateSSDetected(ssExtensionAvailable, (window as any).injectedWeb3['polkadot-js']));
                    }

                    // return EMPTY;
                })
            );
        })
    );

// export const updateExtensionInformationEpic = (
//     action$: Observable<Action<any>>,
//     store$: Observable<AppState>,
//     {api$}: IEpicDependency
// ) => {
//     return combineLatest([api$, action$.pipe(ofType<UpdateSSDetectedAction>(types.DETECTION_UPDATE))]).pipe(
//         switchMap(
//             ([api, action]): Observable<Action<any>> => {
//                 console.log('***********INSIDE*********');
//                 const {polkadotInjected} = action.payload;
//                 console.log('polkadotInjected.accounts::',polkadotInjected.accounts);
//                 // const SS = 'singleSource';
//                 // return from(polkadotInjected.accounts).pipe(
//                 //     switchMap((SingleSource: SingleSourceInjected) => {
//                         const retObservable: Action<any>[] = [];
//                         let ssExtensionConnected: boolean = null;
//                         return polkadotInjected.accounts.pipe(
//                             withLatestFrom(store$),
//                             switchMap(([ssAccounts, store]) => {
//                                 const {
//                                     extension: {accounts},
//                                 } = store;
//                                 if (ssAccounts.length === 0 && accounts.length !== 0) {
//                                     ssExtensionConnected = false;
//                                 } else if (accounts.length < ssAccounts.length) {
//                                     ssExtensionConnected = true;
//                                     // NEED TO MOVE THIS TO DETECTION EPIC ONCE SS EXTENSION IS FIXED
//                                     // api.setSigner(SingleSource.signer);
//                                     api.setSigner(polkadotInjected.signer);
//                                 }
//                                 if (ssExtensionConnected !== null) {
//                                     retObservable.push(updateSSConnected(ssExtensionConnected));
//                                 }
//                                 if (JSON.stringify(accounts) !== JSON.stringify(ssAccounts)) {
//                                     // TODO modify check
//                                     const accountList = ssAccounts.map((account: IAccounts) => ({
//                                         name: account.name,
//                                         address: account.address,
//                                     }));
//                                     retObservable.push(updateSSAccounts(accountList));
//                                 }
//                                 return from(retObservable);
//                             })
//                         )
//             }),
//                      // .}),
//                     // catchError(err => {
//                     //     return of(setExtensionError(err));
//                     // })
//                 // );
//         //     }
//         // ),
//         catchError(err => {
//             if (err.message === 'Connection fail') {
//                 // return of({type: 'ERROR IN API connection', payload: new NodeConnectionTimeOut('Connection from node failed').message});
//                 return of(setExtensionError(new NodeConnectionTimeOut()));
//             }
//             return of(setExtensionError(err));
//         })
//     );
// };

export const updateExtensionInformationEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) => {
    return combineLatest([api$, action$.pipe(ofType<UpdateSSDetectedAction>(types.DETECTION_UPDATE))]).pipe(
        switchMap(
            ([api, action]): Observable<Action<any>> => {
                // const {polkadotInjected} = action.payload;
                // const SS = 'singleSource';
                return from(web3Enable('cennzx')).pipe(
                    switchMap(polkadotInjectedGlobal => {
                        // console.log('polkadotInjectedGlobal:',polkadotInjectedGlobal);
                        const retObservable: Action<any>[] = [];
                        let ssExtensionConnected: boolean = null;
                        return from(web3Accounts()).pipe(
                            withLatestFrom(store$),
                            switchMap(([ssAccounts, store]) => {
                                // console.log('ssAccounts::',ssAccounts);
                                const {
                                    extension: {accounts},
                                } = store;
                                if (ssAccounts.length === 0 && accounts.length !== 0) {
                                    ssExtensionConnected = false;
                                } else if (accounts.length < ssAccounts.length) {
                                    ssExtensionConnected = true;
                                    // NEED TO MOVE THIS TO DETECTION EPIC ONCE SS EXTENSION IS FIXED
                                    // api.setSigner(polkadotInjectedGlobal.signer);
                                }
                                if (ssExtensionConnected !== null) {
                                    retObservable.push(updateSSConnected(ssExtensionConnected));
                                }
                                if (JSON.stringify(accounts) !== JSON.stringify(ssAccounts)) {
                                    // TODO modify check
                                    const accountList = ssAccounts.map(account => ({
                                        name: account.meta.name,
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
        // switchMap(
        //     ([api, action]): Observable<Action<any>> => {
        //         // const {polkadotInjected} = action.payload;
        //         // const SS = 'singleSource';
        //         return from(web3FromSource("polkadot-js")).pipe(
        //             switchMap((injected) => {
        //                 api.setSigner(injected.signer);
        //                 return of(updateSSDetectionCompleted());
        //             }),
        //             catchError(err => {
        //                 return of(setExtensionError(err));
        //             })
        //         );
        //     }
        // ),
        map(() => {
            return updateSSDetectionCompleted();
        })
    );

export default combineEpics(ssExtensionDetectedEpic, updateExtensionInformationEpic, ssExtensionDetectionCompleted);
