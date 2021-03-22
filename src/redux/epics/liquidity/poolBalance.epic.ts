import {Action} from 'redux-actions';
import {combineEpics, ofType} from 'redux-observable';
import {combineLatest, EMPTY, Observable, of} from 'rxjs/index';
import {catchError, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {EmptyPool} from '../../../error/error';
import {IEpicDependency, IUserShareInPool} from '../../../typings';
import {Amount} from '../../../util/Amount';
import {getAsset} from '../../../util/assets';
import types from '../../actions';

import {
    setLiquidityError,
    updatePoolBalance,
    UpdatePoolBalanceAction,
    UpdateSelectedAdd1AssetAction,
    updateUserPoolShare,
} from '../../actions/ui/liquidity.action';
import {AppState} from '../../reducers';

export const getAssetPoolBalanceEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdatePoolBalanceAction> =>
    combineLatest([
        api$,
        action$.pipe(ofType<UpdateSelectedAdd1AssetAction>(types.ui.Liquidity.SELECTED_ADD1_ASSET_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const poolAsset = action.payload;
                return api.query.cennzx.coreAssetId().pipe(
                    switchMap(coreAsset => {
                        if (poolAsset.toString() === coreAsset.toString()) {
                            return EMPTY;
                        }
                        return combineLatest([
                            api.derive.cennzx.poolAssetBalance(poolAsset),
                            api.derive.cennzx.poolCoreAssetBalance(poolAsset),
                            api.derive.cennzx.exchangeAddress(poolAsset),
                        ]).pipe(
                            switchMap(([assetBalance, coreBalance, exchangeAddress]) => {
                                const coreAssetBalance: Amount = new Amount(coreBalance);
                                const poolAssetBalance: Amount = new Amount(assetBalance);
                                // if (coreAssetBalance.isZero() || poolAssetBalance.isZero()) {
                                //     return of(setLiquidityError(new EmptyPool(getAsset(poolAsset))));
                                // }
                                const poolBalance = {
                                    coreAssetBalance: coreAssetBalance,
                                    assetBalance: poolAssetBalance,
                                    address: exchangeAddress.toString(),
                                    assetId: poolAsset,
                                };
                                return of(updatePoolBalance(poolBalance));
                            }),
                            takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                            catchError((err: any) => {
                                return of(setLiquidityError(err));
                            })
                        );
                    })
                );
            }
        )
    );

export const getUserPoolShareEpic = (
    action$: Observable<Action<any>>,
    store$: Observable<AppState>,
    {api$}: IEpicDependency
): Observable<UpdatePoolBalanceAction> =>
    combineLatest([
        api$,
        action$.pipe(ofType(types.ui.Liquidity.SELECTED_ADD1_ASSET_UPDATE, types.ui.Liquidity.SELECTED_ACCOUNT_UPDATE)),
    ]).pipe(
        withLatestFrom(store$),
        switchMap(
            ([[api, action], store]): Observable<Action<any>> => {
                const poolAsset = store.ui.liquidity.form.assetId;
                const coreAsset = store.global.coreAssetId;
                const {signingAccount} = store.ui.liquidity.form;
                if (!poolAsset || !signingAccount || poolAsset === coreAsset) {
                    return EMPTY;
                }

                return api.rpc.cennzx.liquidityValue(signingAccount, poolAsset).pipe(
                    switchMap(([liquidityVolume, coreValue, assetValue]) => {
                        const liquidity: Amount = new Amount(liquidityVolume);
                        const userAssetShare: Amount = new Amount(assetValue);
                        const userCoreShare: Amount = new Amount(coreValue);
                        const userShare: IUserShareInPool = {
                            coreAssetBalance: userCoreShare,
                            assetBalance: userAssetShare,
                            address: signingAccount,
                            liquidity: liquidity,
                            assetId: poolAsset,
                        };
                        return of(updateUserPoolShare(userShare));
                    }),
                    takeUntil(action$.pipe(ofType(types.ui.Exchange.TRADE_RESET))),
                    catchError((err: any) => {
                        return of(setLiquidityError(err));
                    })
                );
            }
        )
    );

export default combineEpics(getAssetPoolBalanceEpic, getUserPoolShareEpic);
