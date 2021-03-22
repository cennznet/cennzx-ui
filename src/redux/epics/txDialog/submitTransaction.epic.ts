import {SubmittableResult} from '@cennznet/api';
import {web3Enable, web3FromSource} from '@polkadot/extension-dapp';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, from, Observable, of} from 'rxjs';
import {catchError, switchMap, withLatestFrom} from 'rxjs/operators';
import {ExtrinsicFailed, InsufficientBalanceForOperation} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {resetTrade} from '../../actions/ui/exchange.action';
import {
    requestActualFee,
    RequestSubmitLiquidity,
    RequestSubmitSend,
    RequestSubmitTransaction,
    setDailogError,
    updateStage,
    UpdateStageAction,
    updateTxEvents,
    updateTxHash,
} from '../../actions/ui/txDialog.action';
import {AppState} from '../../reducers';
import {Stages} from '../../reducers/ui/txDialog.reducer';

const DECIMALS = 4;
export const submitTransactionEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType<RequestSubmitTransaction>(types.ui.TxDialog.TRANSACTION_SUBMIT_REQUEST)),
        from(web3FromSource('polkadot-js')),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, signingAccount, buffer, password},
                    },
                    injector,
                ],
                store,
            ]): Observable<Action<any>> => {
                let tx;
                const [fromAsset, toAsset, fromAssetAmount, toAssetAmount] = extrinsic.params;
                if (extrinsic.method === 'sellAsset') {
                    const sellAmount = fromAssetAmount; //.asString(DECIMALS);
                    const minSale = new Amount(toAssetAmount.muln(1 - buffer)); /*.asString(DECIMALS);*/
                    tx = api.tx.cennzx.sellAsset(null, fromAsset, toAsset, sellAmount, minSale);
                } else {
                    const buyAmount = toAssetAmount; //.asString(DECIMALS);
                    const maxSale = new Amount(fromAssetAmount.muln(1 + buffer)); /*.asString(DECIMALS);*/
                    const recipient = null;
                    tx = api.tx.cennzx.buyAsset(recipient, fromAsset, toAsset, buyAmount, maxSale);
                }
                const signer = injector.signer;

                return tx.signAndSend(signingAccount, {signer}).pipe(
                    switchMap(({events, status}: SubmittableResult) => {
                        if (status.isInBlock) {
                            return of(updateTxHash(status.asInBlock.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            const blockHash = status.asFinalized;
                            const extrinsicIndex = events[0].phase.asApplyExtrinsic;
                            return of(updateTxEvents(events), updateStage(Stages.Finalised));
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
    combineLatest([
        api$,
        action$.pipe(ofType<RequestSubmitSend>(types.ui.TxDialog.TRANSACTION_SUBMIT_SEND)),
        from(web3FromSource('polkadot-js')),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, signingAccount, recipientAddress, buffer, password},
                    },
                    injector,
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
                const signer = injector.signer;

                return tx.signAndSend(signingAccount, {signer}).pipe(
                    switchMap(({events, status}: SubmittableResult) => {
                        if (status.isBroadcast) {
                            return of(updateTxHash(tx.hash.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            const blockHash = status.asFinalized;
                            const extrinsicIndex = events[0].phase.asApplyExtrinsic;
                            return of(updateTxEvents(events), updateStage(Stages.Finalised));
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
        from(web3FromSource('polkadot-js')),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([
                [
                    api,
                    {
                        payload: {extrinsic, signingAccount, add1Asset, add1Amount, add2Amount, buffer, password},
                    },
                    injector,
                ],
                store,
            ]): Observable<Action<any>> => {
                const [assetId, , assetAmount, coreAmount] = extrinsic.params;
                const currentExchangePool = store.ui.liquidity.exchangePool.find(ex => ex.assetId === assetId);
                const coreAssetReserve = currentExchangePool ? currentExchangePool.coreAssetBalance : new Amount(0);
                const tradeAssetReserve = currentExchangePool ? currentExchangePool.assetBalance : new Amount(0);
                const totalLiquidity = store.ui.liquidity.totalLiquidity;

                let tx;
                if (extrinsic.method === 'addLiquidity') {
                    const minLiquidity = totalLiquidity.isZero()
                        ? new Amount(coreAmount)
                        : new Amount(coreAmount).mul(totalLiquidity.div(coreAssetReserve));
                    let investmentAmount = totalLiquidity.isZero()
                        ? new Amount(assetAmount)
                        : new Amount(coreAmount).mul(tradeAssetReserve.div(coreAssetReserve)).iaddn(1);
                    if (investmentAmount.ltn(assetAmount)) {
                        investmentAmount = new Amount(assetAmount);
                    }
                    const maxAssetAmount = new Amount(assetAmount.muln(1 + buffer));
                    if (maxAssetAmount.lt(investmentAmount)) {
                        const err = new InsufficientBalanceForOperation(
                            maxAssetAmount,
                            new Amount(investmentAmount),
                            assetId
                        );
                        return of(setDailogError(err));
                    }
                    tx = api.tx.cennzx.addLiquidity(assetId, minLiquidity, investmentAmount, coreAmount);
                } else {
                    const min_asset_withdraw = new Amount(add1Amount.muln(1 - buffer));
                    const min_core_withdraw = new Amount(add2Amount.muln(1 - buffer));
                    tx = api.tx.cennzx.removeLiquidity(add1Asset, add1Amount, 0.00001, 0.00001);
                }
                const signer = injector.signer;

                return tx.signAndSend(signingAccount, {signer}).pipe(
                    switchMap(({events, status}) => {
                        if (status.isInBlock) {
                            return of(updateTxHash(status.asInBlock.toString()), updateStage(Stages.Broadcasted));
                        } else if (status.isFinalized && events) {
                            return of(updateTxEvents(events), updateStage(Stages.Finalised));
                        } else {
                            return EMPTY;
                        }
                    }),
                    catchError((err: Error) => {
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
