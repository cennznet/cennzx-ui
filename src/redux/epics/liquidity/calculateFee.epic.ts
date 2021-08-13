import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {BaseError, InsufficientFeeForOperation} from '../../../error/error';
import {IEpicDependency, IFee} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import {observableEstimatedFee} from '../../../util/feeUtil';
import types from '../../actions';
import {setLiquidityError, updateTransactionFee} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const calculateTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.TRANSACTION_FEE_PARAMS_UPDATE))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const {txFee, extrinsicParams} = store.ui.liquidity;
                const {
                    extrinsic,
                    signingAccount,
                    feeAssetId,
                    assetId,
                    coreAmount,
                    buffer,
                    assetAmount,
                } = store.ui.liquidity.form;
                if (!coreAmount || !assetAmount) return EMPTY;
                // const minSale = new Amount(amount.muln(1 - buffer)).asString(DECIMALS)
                let tx;
                if (extrinsic === 'addLiquidity') {
                    const min_liquidity = new Amount(assetAmount.muln(1 - (buffer as number)));
                    const max_asset_amount = new Amount(assetAmount.muln(1 + (buffer as number)));
                    tx = api.tx.cennzx.addLiquidity(assetId, min_liquidity, max_asset_amount, coreAmount);
                } else {
                    const min_asset_withdraw = new Amount(assetAmount.muln(1 - (buffer as number)));
                    const min_core_withdraw = new Amount(coreAmount.muln(1 - (buffer as number)));
                    tx = api.tx.cennzx.removeLiquidity(assetId, assetAmount, min_asset_withdraw, min_core_withdraw);
                }
                return observableEstimatedFee(tx, signingAccount as string, feeAssetId as number, api).pipe(
                    switchMap(([cpayFee, feeAssetFee]) => {
                        const feeInCpay = new Amount(cpayFee.toString(), AmountUnit.UN);
                        const feeInFeeAsset = feeAssetFee ? new Amount(feeAssetFee.toString(), AmountUnit.UN) : null;
                        const fee = {feeInCpay, feeInFeeAsset};
                        if (
                            !txFee ||
                            !fee.feeInCpay.eq(txFee.feeInCpay) ||
                            (fee.feeInFeeAsset === null && txFee.feeInFeeAsset !== null) ||
                            (fee.feeInFeeAsset !== null && txFee.feeInFeeAsset === null) ||
                            (fee.feeInFeeAsset && txFee.feeInFeeAsset && !fee.feeInFeeAsset.eq(txFee.feeInFeeAsset))
                        ) {
                            return of(updateTransactionFee(fee as IFee));
                        }
                        return EMPTY;
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Liquidity.LIQUIDITY_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            // In case if the fee asset pool balance is low, then converting the fee from CPAY to feeAsset will result in 'Pool balance is low'
                            // TODO need to check on how to handle it
                            const err = new InsufficientFeeForOperation(
                                'Insufficient amount in fee asset of selected account'
                            );
                            return of(setLiquidityError(err));
                        }
                        return of(setLiquidityError(err));
                    })
                );
            }
        )
    );

export default combineEpics(calculateTxFeeEpic);
