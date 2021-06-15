import {AssetId, Balance, BalanceLock, Vec} from '@cennznet/types';
import {stringToHex} from '@polkadot/util';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {from} from 'rxjs';
import {combineLatest, Observable, of} from 'rxjs/index';
import {filter, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
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

export function fetchBalanceExcludeLock<T>(api, signingAccount, balance: T, assetId): Observable<IAssetBalance> {
    return api.query.genericAsset.locks(signingAccount).pipe(
        switchMap(
            (lockBalance: Vec<BalanceLock>): Observable<IAssetBalance> => {
                const lockBal = lockBalance.toArray();
                let userBal;
                if (lockBal.length > 0) {
                    const stakeBal = lockBal.find(lock => lock.id.toString() === stringToHex('staking '));
                    const freeBalance = stakeBal ? balance.sub(stakeBal.amount) : new Amount(0);
                    userBal = new Amount(freeBalance.toString());
                } else {
                    userBal = new Amount(balance.toString());
                }
                const newAssetBalance = {assetId, account: signingAccount, balance: userBal};
                return of(newAssetBalance);
            }
        )
    );
}

export const updateUserAssetBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateUserAssetBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.USER_ASSET_BALANCE_REQUEST))]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => !!store.global.stakingAssetId),
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
                const {stakingAssetId} = store.global;
                return api.query.genericAsset.freeBalance(assetId, signingAccount).pipe(
                    switchMap((balance: Balance) => {
                        if (assetId === stakingAssetId.toNumber()) {
                            return fetchBalanceExcludeLock(api, signingAccount, balance, assetId).pipe(
                                switchMap((newAssetBalance: IAssetBalance) => {
                                    return of(updateUserAssetBalance(newAssetBalance));
                                })
                            );
                        }
                        const newAssetBalance = {
                            assetId,
                            account: signingAccount,
                            balance: new Amount(balance.toString()),
                        };
                        return of(updateUserAssetBalance(newAssetBalance));
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
