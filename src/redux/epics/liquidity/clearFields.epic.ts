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
    updateAddAsset1Amount,
    updateAddAsset2Amount,
    // SetExchangeErrorAction,
    updateExchangeRate,
    // updateFromAssetAmount,
    // updateToAssetAmount,
    updateTransactionFee,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

// export const clearEstimatedAmountEpic = (
//     action$: Observable<Action<any>>,
//     store$: Observable<AppState>,
//     {api$}: IEpicDependency
// ) =>
//     action$
//         .pipe(
//             ofType(
//                 types.ui.Liquidity.SELECTED_TO_ASSET_UPDATE,
//                 types.ui.Liquidity.SELECTED_FROM_ASSET_UPDATE,
//                 types.ui.Liquidity.FROM_ASSET_AMOUNT_SET,
//                 types.ui.Liquidity.TO_ASSET_AMOUNT_SET
//             )
//         )
//         .pipe(
//             withLatestFrom(store$),
//             switchMap(([action, store]) => {
//                 const {extrinsic} = store.ui.liquidity.form as ExchangeFormData;
//                 if (action.type === types.ui.Liquidity.TO_ASSET_AMOUNT_SET) {
//                     return of(updateFromAssetAmount(undefined));
//                 } else if (action.type === types.ui.Exchange.FROM_ASSET_AMOUNT_SET) {
//                     return of(updateToAssetAmount(undefined));
//                 } else if (
//                     (extrinsic === SWAP_INPUT && action.type === types.ui.Liquidity.SELECTED_FROM_ASSET_UPDATE) ||
//                     (extrinsic === SWAP_OUTPUT && action.type === types.ui.Liquidity.SELECTED_TO_ASSET_UPDATE)
//                 ) {
//                     return from([updateFromAssetAmount(undefined), updateToAssetAmount(undefined)]);
//                 }
//                 return EMPTY;
//             })
//         );

export const clearExchangeRateAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$
        .pipe(
            ofType(
                types.ui.Liquidity.SELECTED_TO_ASSET_UPDATE,
                types.ui.Liquidity.SELECTED_FROM_ASSET_UPDATE,
                types.ui.Liquidity.ASSET_SWAP
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
    action$
        .pipe(ofType(types.ui.Liquidity.SELECTED_ADD_ASSET1_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE))
        .pipe(
            switchMap(() => {
                return from([updateAddAsset1Amount(undefined), updateAddAsset2Amount(undefined)]);
            })
        );

export const clearTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(
        ofType(
            types.ui.Liquidity.SELECTED_TO_ASSET_UPDATE,
            types.ui.Liquidity.SELECTED_FROM_ASSET_UPDATE,
            types.ui.Liquidity.FROM_ASSET_AMOUNT_SET,
            types.ui.Liquidity.TO_ASSET_AMOUNT_SET,
            types.ui.Liquidity.ASSET_SWAP,
            types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE
        ),
        switchMap(() => {
            return of(updateTransactionFee(undefined));
        })
    );

export default combineEpics(clearExchangeRateAmountEpic, clearTxFeeEpic, clearAmountEpic);
