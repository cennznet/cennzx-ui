import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {from, Observable, of} from 'rxjs/index';
import {switchMap} from 'rxjs/operators';
import {IEpicDependency} from '../../../typings';
import types from '../../actions';
import {
    updateAsset1Amount,
    updateAsset2Amount,
    updateExchangeRate,
    updateTransactionFee,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const clearExchangeRateAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(ofType(types.ui.Liquidity.SELECTED_ASSET1_UPDATE)).pipe(
        switchMap(() => {
            return of(updateExchangeRate(undefined));
        })
    );

export const clearAmountEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(ofType(types.ui.Liquidity.SELECTED_ASSET1_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE)).pipe(
        switchMap(() => {
            return from([updateAsset1Amount(undefined), updateAsset2Amount(undefined)]);
        })
    );

export const clearTxFeeEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
) =>
    action$.pipe(
        ofType(
            types.ui.Liquidity.SELECTED_ASSET1_UPDATE,
            types.ui.Liquidity.ASSET1_AMOUNT_SET,
            types.ui.Liquidity.ASSET2_AMOUNT_SET,
            types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE
        ),
        switchMap(() => {
            return of(updateTransactionFee(undefined));
        })
    );

export default combineEpics(clearExchangeRateAmountEpic, clearTxFeeEpic, clearAmountEpic);
