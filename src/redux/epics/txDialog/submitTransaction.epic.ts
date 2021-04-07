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
import {resetLiquidity, updateExtrinsic} from '../../actions/ui/liquidity.action';
import {
    RequestSubmitLiquidity,
    RequestSubmitTransaction,
    setDialogError,
    updateStage,
    UpdateStageAction,
    updateTxEvents,
    updateTxHash,
} from '../../actions/ui/txDialog.action';
import {AppState} from '../../reducers';
import {Stages} from '../../reducers/ui/txDialog.reducer';

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
                    const sellAmount = fromAssetAmount;
                    const minSale = new Amount(toAssetAmount.muln(1 - buffer));
                    tx = api.tx.cennzx.sellAsset(null, fromAsset, toAsset, sellAmount, minSale);
                } else {
                    const buyAmount = toAssetAmount;
                    const maxSale = new Amount(fromAssetAmount.muln(1 + buffer));
                    const recipient = null;
                    tx = api.tx.cennzx.buyAsset(recipient, fromAsset, toAsset, buyAmount, maxSale);
                }
                const signer = injector.signer;

                return tx.signAndSend(signingAccount, {signer}).pipe(
                    switchMap(({events, status}: SubmittableResult) => {
                        if (status.isInBlock) {
                            return of(updateTxHash(status.asInBlock.toString()), updateStage(Stages.InBlock));
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
                        return of(setDialogError(extrinsicErr));
                    })
                );
            }
        ),
        catchError((err: Error) => {
            const extrinsicErr = new ExtrinsicFailed(err.message);
            return of(setDialogError(extrinsicErr));
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
                const [assetId, , coreAmount, assetAmount] = extrinsic.params;
                const currentExchangePool = store.ui.liquidity.exchangePool.find(ex => ex.assetId === assetId);
                const coreAssetReserve = currentExchangePool ? currentExchangePool.coreAssetBalance : new Amount(0);
                const totalLiquidity = store.ui.liquidity.totalLiquidity;
                let tx;
                if (extrinsic.method === 'addLiquidity') {
                    const minLiquidity = totalLiquidity.isZero()
                        ? new Amount(coreAmount)
                        : new Amount(coreAmount).mul(totalLiquidity.div(coreAssetReserve));

                    const maxAssetAmount = totalLiquidity.isZero()
                        ? new Amount(assetAmount)
                        : new Amount(assetAmount.muln(1 + buffer));
                    tx = api.tx.cennzx.addLiquidity(assetId, minLiquidity, maxAssetAmount, coreAmount);
                } else {
                    const minAssetWithdraw = new Amount(assetAmount.muln(1 - buffer));
                    const minCoreWithdraw = new Amount(coreAmount.muln(1 - buffer));
                    const liquidityToWithdraw = store.ui.liquidity.liquidityToWithdraw;
                    tx = api.tx.cennzx.removeLiquidity(assetId, liquidityToWithdraw, minAssetWithdraw, minCoreWithdraw);
                }
                const signer = injector.signer;

                return tx.signAndSend(signingAccount, {signer}).pipe(
                    switchMap(({events, status}) => {
                        if (status.isInBlock) {
                            return of(
                                updateTxHash(status.asInBlock.toString()),
                                updateStage(Stages.InBlock),
                                resetLiquidity(),
                                updateExtrinsic(extrinsic.method)
                            );
                        } else if (status.isFinalized && events) {
                            return of(updateTxEvents(events), updateStage(Stages.Finalised));
                        } else {
                            return EMPTY;
                        }
                    }),
                    catchError((err: Error) => {
                        let extrinsicErr;
                        if (err.message) extrinsicErr = new ExtrinsicFailed(err.message);
                        return of(setDialogError(extrinsicErr));
                    })
                );
            }
        ),
        catchError((err: Error) => {
            const extrinsicErr = new ExtrinsicFailed(err.message);
            return of(setDialogError(extrinsicErr));
        })
    );

export const resetTradeOnInBlockCastedStage = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    action$.pipe(
        ofType<UpdateStageAction>(types.ui.TxDialog.STAGE_UPDATE),
        switchMap(action => {
            if (action.payload === Stages.InBlock) {
                return of(resetTrade());
            } else {
                return EMPTY;
            }
        })
    );

export default combineEpics(submitTransactionEpic, submitLiquidityEpic, resetTradeOnInBlockCastedStage);
