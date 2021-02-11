// import {Extrinsic} from '@cennznet/types';
import BN from 'bn.js';
import {SubmittableResult} from '@cennznet/api';
import {Keyring} from '@polkadot/keyring';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, from, Observable, of} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {ExtrinsicFailed} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {resetTrade} from '../../actions/ui/exchange.action';
import {
    requestActualFee,
    RequestSubmitTransaction,
    RequestSubmitSend,
    RequestSubmitLiquidity,
    setDailogError,
    updateStage,
    UpdateStageAction,
    updateTxEvents,
    updateTxHash,
} from '../../actions/ui/txDialog.action';
import {Amount} from '../../../util/Amount';
import {AppState} from '../../reducers';
import {Stages} from '../../reducers/ui/txDialog.reducer';
import {
    web3AccountsSubscribe,
    web3Enable,
    web3Accounts,
    isWeb3Injected,
    web3FromSource,
} from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

const DECIMALS = 5;
export const submitTransactionEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType<RequestSubmitTransaction>(types.ui.TxDialog.TRANSACTION_SUBMIT_REQUEST)),
        // from(web3FromSource("polkadot-js"))
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, signingAccount, buffer},
                    },
                    // injector,
                ],
                store,
            ]): Observable<Action<any>> => {
                const [fromAsset, toAsset, amount] = extrinsic.params;
                const sellAmount = amount.asString(DECIMALS);
                let tx;
                if (extrinsic.method === 'sellAsset') {
                    // ### sellAsset(recipient: `Option<AccountId>`, asset_to_sell: `Compact<AssetId>`,
                    // asset_to_buy: `Compact<AssetId>`, sell_amount: `Compact<BalanceOf>`, minimum_buy: `Compact<BalanceOf>`)
                    const minSale = new Amount(amount.muln(1 - buffer)).asString(DECIMALS);
                    tx = api.tx.cennzx.sellAsset(null, fromAsset, toAsset, +sellAmount, 0.0001);
                } else {
                    // ### buyAsset(recipient: `Option<AccountId>`, asset_to_sell: `Compact<AssetId>`,
                    // asset_to_buy: `Compact<AssetId>`, buy_amount: `Compact<BalanceOf>`, maximum_sell: `Compact<BalanceOf>`)
                    const maxSale = new Amount(amount.muln(1 + buffer)).asString(DECIMALS);
                    tx = api.tx.cennzx.buyAsset(null, fromAsset, toAsset, +sellAmount, 1000000);
                }
                // alert(signingAccount);
                // const keyring = new Keyring({type: 'sr25519'});
                // const account = keyring.addFromUri('//Alice');
                // console.log('Signing Account::::', account);
                //import keyring from '@polkadot/ui-keyring';
                // const password = 'test';
                // const pair = keyring.getPair("5EYU7GzxsNkYY76qbdkbL2J1Z1HBstYKZt5ypDPSxdW4Mn8h");
                // pair.decodePkcs8(password);
                console.log('signingAccount::', signingAccount);
                const pair = keyring.getPair(signingAccount);
                if (pair.isLocked) {
                    pair.decodePkcs8('test');
                }
                console.log('Signing pair::::', pair);
                return tx.signAndSend(pair).pipe(
                    switchMap(({events, status}: SubmittableResult) => {
                        if (status.isBroadcast) {
                            return of(updateTxHash(tx.hash.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            const blockHash = status.asFinalized;
                            const extrinsicIndex = events[0].phase.asApplyExtrinsic;
                            return of(
                                updateTxEvents(events),
                                updateStage(Stages.Finalised),
                                requestActualFee({blockHash, extrinsicIndex})
                            );
                        } else {
                            return EMPTY;
                        }
                    }),
                    catchError((err: Error) => {
                        let extrinsicErr;
                        if (err.message === '1010: Invalid Transaction (3)') {
                            extrinsicErr = new ExtrinsicFailed(
                                "Sending account's balance is too low to execute this operation."
                            );
                        } else if (err.message === '1010: Invalid Transaction (0)') {
                            extrinsicErr = new ExtrinsicFailed('BadSignature fails the extrinsic');
                        } else if (err.message === '1010: Invalid Transaction (1)') {
                            extrinsicErr = new ExtrinsicFailed('Nonce too low.');
                        } else if (err.message === '1010: Invalid Transaction (2)') {
                            extrinsicErr = new ExtrinsicFailed('Nonce too high.');
                        } else if (err.message === '1010: Invalid Transaction (4)') {
                            extrinsicErr = new ExtrinsicFailed('Block is full, no more extrinsics can be applied.');
                        } else {
                            extrinsicErr = new ExtrinsicFailed(err.message);
                        }
                        return of(setDailogError(extrinsicErr));
                    })
                );
            }
        ),
        catchError((err: Error) => {
            const extrinsicErr = new ExtrinsicFailed(err.message);
            return of(setDailogError(extrinsicErr));
        })
    );

export const submitSendEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType<RequestSubmitSend>(types.ui.TxDialog.TRANSACTION_SUBMIT_SEND))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, recipientAddress, buffer},
                    },
                ],
                store,
            ]): Observable<Action<any>> => {
                const [fromAsset, toAsset, amount] = extrinsic.params;
                const sellAmount = amount.asString(DECIMALS);
                let tx;
                if (extrinsic.method === 'sellAsset') {
                    const minSale = new Amount(amount.muln(1 - buffer)).asString(DECIMALS);
                    tx = api.tx.cennzx.sellAsset(recipientAddress, fromAsset, toAsset, +sellAmount, 0.0001);
                } else {
                    const maxSale = new Amount(amount.muln(1 + buffer)).asString(DECIMALS);
                    tx = api.tx.cennzx.buyAsset(recipientAddress, fromAsset, toAsset, +sellAmount, 1000000);
                }
                const keyring = new Keyring({type: 'sr25519'});
                const account = keyring.addFromUri('//Alice');
                // const pair = keyring.getPair(signingAccount);
                return tx.signAndSend(account).pipe(
                    switchMap(({events, status}: SubmittableResult) => {
                        if (status.isBroadcast) {
                            return of(updateTxHash(tx.hash.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            const blockHash = status.asFinalized;
                            const extrinsicIndex = events[0].phase.asApplyExtrinsic;
                            return of(
                                updateTxEvents(events),
                                updateStage(Stages.Finalised),
                                requestActualFee({blockHash, extrinsicIndex})
                            );
                        } else {
                            return EMPTY;
                        }
                    }),
                    catchError((err: Error) => {
                        let extrinsicErr;
                        if (err.message === '1010: Invalid Transaction (3)') {
                            extrinsicErr = new ExtrinsicFailed(
                                "Sending account's balance is too low to execute this operation."
                            );
                        } else if (err.message === '1010: Invalid Transaction (0)') {
                            extrinsicErr = new ExtrinsicFailed('BadSignature fails the extrinsic');
                        } else if (err.message === '1010: Invalid Transaction (1)') {
                            extrinsicErr = new ExtrinsicFailed('Nonce too low.');
                        } else if (err.message === '1010: Invalid Transaction (2)') {
                            extrinsicErr = new ExtrinsicFailed('Nonce too high.');
                        } else if (err.message === '1010: Invalid Transaction (4)') {
                            extrinsicErr = new ExtrinsicFailed('Block is full, no more extrinsics can be applied.');
                        } else {
                            extrinsicErr = new ExtrinsicFailed(err.message);
                        }
                        return of(setDailogError(extrinsicErr));
                    })
                );
            }
        ),
        catchError((err: Error) => {
            const extrinsicErr = new ExtrinsicFailed(err.message);
            return of(setDailogError(extrinsicErr));
        })
    );

export const submitLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType<RequestSubmitLiquidity>(types.ui.TxDialog.TRANSACTION_SUBMIT_LIQUIDITY)),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, add1Asset, add1Amount, add2Amount, buffer},
                    },
                ],
                store,
            ]): Observable<Action<any>> => {
                let tx;
                if (extrinsic.method === 'addLiquidity') {
                    const min_liquidity = new Amount(add1Amount.muln(1 - buffer));
                    const max_asset_amount = new Amount(add1Amount.muln(1 + buffer));
                    tx = api.tx.cennzx.addLiquidity(add1Asset, 0.00001, 100000000, add2Amount);
                } else {
                    const min_asset_withdraw = new Amount(add1Amount.muln(1 - buffer));
                    const min_core_withdraw = new Amount(add2Amount.muln(1 - buffer));
                    tx = api.tx.cennzx.removeLiquidity(add1Asset, add1Amount, 0.00001, 0.00001);
                }
                const keyring = new Keyring({type: 'sr25519'});
                const account = keyring.addFromUri('//Alice');
                return tx.signAndSend(account).pipe(
                    switchMap(({events, status}) => {
                        if (status.isBroadcast) {
                            return of(updateTxHash(tx.hash.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            const blockHash = status.asFinalized;
                            const extrinsicIndex = events[0].phase.asApplyExtrinsic;
                            return of(
                                updateTxEvents(events),
                                updateStage(Stages.Finalised),
                                requestActualFee({blockHash, extrinsicIndex})
                            );
                        } else {
                            return EMPTY;
                        }
                    }),
                    catchError((err: Error) => {
                        console.log('err', err);
                        let extrinsicErr;
                        if (err.message) extrinsicErr = new ExtrinsicFailed(err.message);
                        return of(setDailogError(extrinsicErr));
                    })
                );
            }
        ),
        catchError((err: Error) => {
            const extrinsicErr = new ExtrinsicFailed(err.message);
            return of(setDailogError(extrinsicErr));
        })
    );

export const resetTradeOnBroadCastedStage = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    action$.pipe(
        ofType<UpdateStageAction>(types.ui.TxDialog.STAGE_UPDATE),
        switchMap(action => {
            if (action.payload === Stages.Broadcasted) {
                return of(resetTrade());
            } else {
                return EMPTY;
            }
        })
    );

export default combineEpics(submitTransactionEpic, submitSendEpic, submitLiquidityEpic, resetTradeOnBroadCastedStage);
