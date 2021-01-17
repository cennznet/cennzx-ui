import {Balance} from '@cennznet/types/polkadot';
import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {filter, map, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {IAssetBalance, IEpicDependency} from '../../../typings';
import {Amount} from '../../../util/Amount';
import types from '../../actions';
import {
    requestAssetBalance,
    requestAdd1AssetBalance,
    updateUserAssetBalance,
    updateUserAdd1AssetBalance,
    UpdateUserAssetBalanceAction,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const updateAssetsBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateUserAssetBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.ASSET_BALANCE_REQUEST))]).pipe(
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
                        const {userAssetBalance} = store.ui.liquidity;
                        const fromAssetBalance = userAssetBalance.find(
                            (bal: IAssetBalance) =>
                                bal.assetId === assetId && bal.account === signingAccount && bal.balance.eq(userBal)
                        );
                        if (!fromAssetBalance) {
                            return of(updateUserAssetBalance(newAssetBalance));
                        }
                        return EMPTY;
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Liquidity.TRADE_RESET)))
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
        action$.pipe(ofType(types.ui.Liquidity.FEE_ASSET_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        filter(
            ([, store]) =>
                store.ui.liquidity.form.feeAssetId &&
                !!store.ui.liquidity.form.signingAccount &&
                store.ui.liquidity.form.feeAssetId !== store.ui.liquidity.form.fromAsset
        ),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {feeAssetId, signingAccount} = store.ui.liquidity.form;
                return of(requestAssetBalance(feeAssetId, signingAccount));
            }
        )
    );

export const updateAdd1AssetsBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdateUserAssetBalanceAction> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.ASSET_ADD1_BALANCE_REQUEST))]).pipe(
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
                        const {userAssetBalance} = store.ui.liquidity;
                        const fromAssetBalance = userAssetBalance.find(
                            (bal: IAssetBalance) =>
                                bal.assetId === assetId && bal.account === signingAccount && bal.balance.eq(userBal)
                        );
                        if (!fromAssetBalance) {
                            return of(updateUserAdd1AssetBalance(newAssetBalance));
                        }
                        return EMPTY;
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Liquidity.TRADE_RESET)))
                );
            }
        )
    );

export const prepareBalanceParamsForAdd1AssetEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<Action<any>> =>
    combineLatest([api$, action$.pipe(ofType(types.ui.Liquidity.SELECTED_ADD1_ASSET_UPDATE))]).pipe(
        withLatestFrom(store$),
        filter(([, store]) => store.ui.liquidity.form.add1Asset && !!store.ui.liquidity.form.signingAccount),
        switchMap(
            ([[api], store]): Observable<Action<any>> => {
                const {add1Asset, signingAccount} = store.ui.liquidity.form;
                return of(requestAdd1AssetBalance(add1Asset, signingAccount));
            }
        )
    );

export default combineEpics(
    updateAssetsBalanceEpic,
    prepareBalanceParamsForFeeAssetEpic,
    prepareBalanceParamsForAdd1AssetEpic,
    updateAdd1AssetsBalanceEpic
);
