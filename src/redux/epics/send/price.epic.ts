import BN from 'bn.js';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {catchError, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {SendFormData, IEpicDependency} from '../../../typings';
import {Amount, AmountUnit} from '../../../util/Amount';
import types from '../../actions';
import {
    setExchangeError,
    SetFromAssetAmountAction,
    SetToAssetAmountAction,
    updateFromAssetAmount,
    UpdateSelectedFromAssetAction,
    UpdateSelectedToAssetAction,
    updateToAssetAmount,
} from '../../actions/ui/send.action';
import {AppState} from '../../reducers';

// tslint:disable:no-magic-numbers
// FIXME
export const getInputPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType<SetFromAssetAmountAction | UpdateSelectedToAssetAction>(
                types.ui.Send.FROM_ASSET_AMOUNT_SET,
                types.ui.Send.SELECTED_TO_ASSET_UPDATE,
                types.ui.Send.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.send.form.fromAsset && store.ui.send.form.toAsset && !!store.ui.send.form.fromAssetAmount
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAssetAmount, fromAsset, toAsset, toAssetAmount} = store.ui.send.form as SendFormData;
                return api.rpc.cennzx.sellPrice(toAsset, fromAssetAmount, fromAsset).pipe(
                    filter((value: BN) => !toAssetAmount || !new Amount(value.toString()).eq(toAssetAmount)),
                    map((estimatedToAssetAmount: BN) => {
                        const amount = new Amount(estimatedToAssetAmount.toString(), AmountUnit.UN);
                        return updateToAssetAmount(amount);
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Send.TRADE_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            return EMPTY;
                        }
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export const getOutputPriceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(
            ofType<SetToAssetAmountAction | UpdateSelectedFromAssetAction>(
                types.ui.Send.TO_ASSET_AMOUNT_SET,
                types.ui.Send.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Send.ASSET_SWAP
            )
        ),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.send.form.fromAsset && store.ui.send.form.toAsset && !!store.ui.send.form.toAssetAmount
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {fromAssetAmount, fromAsset, toAsset, toAssetAmount} = store.ui.send.form as SendFormData;
                return api.rpc.cennzx.buyPrice(fromAsset, toAssetAmount, toAsset).pipe(
                    filter((value: BN) => !fromAssetAmount || !new Amount(value.toString()).eq(fromAssetAmount)),
                    map((estimatedFromAsset: BN) => {
                        const amount = new Amount(estimatedFromAsset.toString(), AmountUnit.UN);
                        return updateFromAssetAmount(amount);
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Send.TRADE_RESET))),
                    catchError((err: any) => {
                        if (err.message === 'Pool balance is low') {
                            return EMPTY;
                        }
                        return of(setExchangeError(err));
                    })
                );
            }
        )
    );

export default combineEpics(getInputPriceEpic, getOutputPriceEpic);
