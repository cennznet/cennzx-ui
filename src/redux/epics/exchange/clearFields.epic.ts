import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {from, Observable, of} from 'rxjs/index';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {filter, switchMap, withLatestFrom} from 'rxjs/operators';
import {EmptyPool} from '../../../error/error';
import {ExchangeFormData, IEpicDependency} from '../../../typings';
import {SWAP_INPUT, SWAP_OUTPUT} from '../../../util/extrinsicUtil';
import types from '../../actions';
import {
    SetExchangeErrorAction,
    updateExchangeRate,
    updateFromAssetAmount,
    updateToAssetAmount,
    updateTransactionFee,
} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const clearEstimatedAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$
        .pipe(
            ofType(
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.FROM_ASSET_AMOUNT_SET,
                types.ui.Exchange.TO_ASSET_AMOUNT_SET
            )
        )
        .pipe(
            withLatestFrom(store$),
            switchMap(([action, store]) => {
                const {extrinsic} = store.ui.exchange.form as ExchangeFormData;
                if (action.type === types.ui.Exchange.TO_ASSET_AMOUNT_SET) {
                    return of(updateFromAssetAmount(undefined));
                } else if (action.type === types.ui.Exchange.FROM_ASSET_AMOUNT_SET) {
                    return of(updateToAssetAmount(undefined));
                } else if (
                    (extrinsic === SWAP_INPUT && action.type === types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE) ||
                    (extrinsic === SWAP_OUTPUT && action.type === types.ui.Exchange.SELECTED_TO_ASSET_UPDATE)
                ) {
                    return from([updateFromAssetAmount(undefined), updateToAssetAmount(undefined)]);
                }
                return EMPTY;
            })
        );

export const clearExchangeRateAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$
        .pipe(
            ofType(
                types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
                types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Exchange.ASSET_SWAP
            )
        )
        .pipe(
            switchMap(() => {
                return of(updateExchangeRate(undefined));
            })
        );

export const clearAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(
        ofType<SetExchangeErrorAction>(types.ui.Exchange.ERROR_SET),
        filter(action => action.payload instanceof EmptyPool),
        switchMap(() => {
            return from([updateToAssetAmount(undefined), updateFromAssetAmount(undefined)]);
        })
    );

export const clearTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(
        ofType(
            types.ui.Exchange.SELECTED_TO_ASSET_UPDATE,
            types.ui.Exchange.SELECTED_FROM_ASSET_UPDATE,
            types.ui.Exchange.FROM_ASSET_AMOUNT_SET,
            types.ui.Exchange.TO_ASSET_AMOUNT_SET,
            types.ui.Exchange.ASSET_SWAP,
            types.ui.Exchange.SELECTED_ACCOUNT_UPDATE
        ),
        switchMap(() => {
            return of(updateTransactionFee(undefined));
        })
    );

export default combineEpics(clearEstimatedAmountEpic, clearExchangeRateAmountEpic, clearAmountEpic, clearTxFeeEpic);
