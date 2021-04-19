import {Balance} from '@cennznet/types';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {from} from 'rxjs';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IAssetBalance, IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {
    requestTotalLiquidity,
    requestUserAssetBalance,
    updateUserAssetBalance,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const updateUserAssetBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateUserAssetBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.USER_ASSET_BALANCE_REQUEST))]).pipe(
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
                        const newAssetBalance = {assetId, account: signingAccount, balance: userBal};
                        const {userAssetBalance} = store.ui.liquidity;
                        const assetBalance = userAssetBalance.find(
                            (bal: IAssetBalance) =>
                                bal.assetId === assetId && bal.account === signingAccount && bal.balance.eq(userBal)
                        );
                        if (!assetBalance) {
                            return of(updateUserAssetBalance(newAssetBalance));
                        }
                        return EMPTY;
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Liquidity.LIQUIDITY_RESET)))
                );
            }
        )
    );

export const prepareRequestUserFeeAssetsBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.FEE_ASSET_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.liquidity.form.feeAssetId && !!store.ui.liquidity.form.signingAccount),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                const {feeAssetId, signingAccount} = store.ui.liquidity.form;
                return of(requestUserAssetBalance(feeAssetId, signingAccount));
            }
        )
    );

export const prepareRequestTotalLiquidityEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.SELECTED_ASSET1_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.liquidity.form.assetId && !!store.ui.liquidity.form.signingAccount),
        switchMap(
            ([, store]): Observable<Action<any>> => {
                const {assetId} = store.ui.liquidity.form;
                const retObservable: Action<any>[] = [];
                retObservable.push(requestTotalLiquidity(assetId));
                return from(retObservable);
            }
        )
    );

export default combineEpics(
    updateUserAssetBalanceEpic,
    prepareRequestUserFeeAssetsBalanceEpic,
    prepareRequestTotalLiquidityEpic
);
