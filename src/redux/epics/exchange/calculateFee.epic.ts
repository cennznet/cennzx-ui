import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {BaseError, InsufficientFeeForOperation} from '../../../error/error';
import {IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import {observableEstimatedFee} from '../../../util/feeUtil';
import types from '../../actions';
import {setExchangeError, updateTransactionFee} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const calculateTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Exchange.TRANSACTION_FEE_PARAMS_UPDATE))]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const {txFee, extrinsicParams} = store.ui.exchange;
                const {extrinsic, signingAccount, feeAssetId} = store.ui.exchange.form;
                const [assetToSell, assetToBuy, sellAmount, buyAmount] = extrinsicParams;
                const tx = api.tx.cennzx[extrinsic](null, assetToSell, assetToBuy, sellAmount, 1);
                return observableEstimatedFee(tx, signingAccount, feeAssetId, api).pipe(
                    switchMap(([cpayFee, feeAssetFee]) => {
                        const feeInCpay = new Amount(cpayFee.toString(), AmountUnit.UN);
                        const feeInFeeAsset = feeAssetFee ? new Amount(feeAssetFee.toString(), AmountUnit.UN) : null;
                        const fee = {feeInCpay: feeInCpay, feeInFeeAsset: feeInFeeAsset};
                        if (
                            !txFee ||
                            !fee.feeInCpay.eq(txFee.feeInCpay) ||
                            (fee.feeInFeeAsset === null && txFee.feeInFeeAsset !== null) ||
                            (fee.feeInFeeAsset !== null && txFee.feeInFeeAsset === null) ||
                            (fee.feeInFeeAsset && txFee.feeInFeeAsset && !fee.feeInFeeAsset.eq(txFee.feeInFeeAsset))
                        ) {
                            return of(updateTransactionFee(fee));
                        }
                        return EMPTY;
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            // In case if the fee asset pool balance is low, then converting the fee from CPAY to feeAsset will result in 'Pool balance is low'
                            // TODO need to check on how to handle it
                            const err = new InsufficientFeeForOperation(
                                'Insufficient amount in fee asset of selected account'
                            );
                            return of(setExchangeError(err));
                        }
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export default combineEpics(calculateTxFeeEpic);
