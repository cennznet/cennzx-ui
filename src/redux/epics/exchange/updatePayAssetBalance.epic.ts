import {Balance} from '@cennznet/types';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IAssetBalance, IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {
    requestAssetBalance,
    updateUserAssetBalance,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/exchange.action';
import {AppState} from '../../reducers';

export const updateAssetsBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateUserAssetBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Exchange.ASSET_BALANCE_REQUEST))]).pipe(
        withLatestFrom(store$),
        // MergeMap to merge request for fee asset's balance and with asset's balance
        mergeMap(
            ([
                [
                    api,
                    {
                        payload: {assetId, signingAccount},
                    },
                ],
                store,
            ]): Observable<Action<any>> => {
                return api.query.genericAsset.freeBalance(assetId, signingAccount).pipe(
                    switchMap((balance: Balance) => {
                        const userBal = new Amount(balance);
                        const newAssetBalance = {assetId: assetId, account: signingAccount, balance: userBal};
                        return of(updateUserAssetBalance(newAssetBalance));
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET)))
                );
            }
        )
    );

export const prepareBalanceParamsForFeeAssetEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Exchange.FEE_ASSET_UPDATE, types.ui.Exchange.SELECTED_ACCOUNT_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.exchange.form.feeAssetId &&
                !!store.ui.exchange.form.signingAccount &&
                store.ui.exchange.form.feeAssetId !== store.ui.exchange.form.fromAsset
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {feeAssetId, signingAccount} = store.ui.exchange.form;
                return of(requestAssetBalance(feeAssetId, signingAccount));
            }
        )
    );

export default combineEpics(updateAssetsBalanceEpic, prepareBalanceParamsForFeeAssetEpic);
