import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {
    requestUserAssetBalance,
    updateFeeAsset,
    updateSelectedAccount,
    updateSelectedAsset1,
} from '../../../actions/ui/liquidity.action';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import {
    prepareRequestUserFeeAssetsBalanceEpic,
    prepareRequestTotalLiquidityEpic,
    updateUserAssetBalanceEpic,
} from '../../liquidity/updatePayAssetBalance.epic';
import {ADD_LIQUIDITY} from '../../../../util/extrinsicUtil';
import {AnyAssetId, Balance, AssetId, BalanceLock} from '@cennznet/types';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on request asset balance epic works', () => {
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [requestUserAssetBalance(16000, newAccount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_           = '-a-';
                // prettier-ignore
                const getFreeBalance_   = ' -b-';
                // prettier-ignore
                const expect_           = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    query: {
                        genericAsset: {
                            freeBalance: () =>
                                cold(getFreeBalance_, {
                                    b: new Amount(22),
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {signingAccount: newAccount, feeAssetId: 16000},
                            userAssetBalance: [],
                        },
                    },
                });

                const output$ = updateUserAssetBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.USER_ASSET_BALANCE_UPDATE,
                        payload: {
                            assetId: 16000,
                            account: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                            balance: new Amount(22),
                        },
                    },
                });
            });
        });
    });
});

describe('getting staking asset balance epic works', () => {
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [requestUserAssetBalance(16000, newAccount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_           = '-a-';
                // prettier-ignore
                const getFreeBalance_   = ' -b-';
                // prettier-ignore
                const locks_            = ' -d-';
                // prettier-ignore
                const stakingAsset_     = ' -e-';
                // prettier-ignore
                const expect_           = '---c';

                const action$ = hot(action_, {
                    a: action,
                });

                const StakingAsset = {
                    toNumber: function() {
                        return 16000;
                    },
                };
                const BalanceLock = {
                    toArray: function() {
                        return [
                            {
                                id: {
                                    toString: function() {
                                        return '0x7374616b696e6720'; // hex for 'staking '
                                    },
                                },
                                amount: new Amount(22),
                                reason: 'TransactionPayment',
                            },
                        ];
                    },
                };
                const api$ = of({
                    query: {
                        genericAsset: {
                            freeBalance: () =>
                                cold(getFreeBalance_, {
                                    b: new Amount(22),
                                }),
                            locks: () =>
                                cold(locks_, {
                                    d: BalanceLock,
                                }),
                            stakingAssetId: () =>
                                cold(stakingAsset_, {
                                    e: StakingAsset,
                                }),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {signingAccount: newAccount, feeAssetId: 16000},
                            userAssetBalance: [],
                        },
                    },
                });

                const output$ = updateUserAssetBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.USER_ASSET_BALANCE_UPDATE,
                        payload: {
                            assetId: 16000,
                            account: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                            balance: new Amount(0), // 22 (free balance) and 22 (staked/locked amount) 22-22 = 0
                        },
                    },
                });
            });
        });
    });
});

describe('Request asset balance working', () => {
    const feeAsset = 16001;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSelectedAccount(newAccount), updateFeeAsset(feeAsset)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                feeAssetId: 16001,
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = prepareRequestUserFeeAssetsBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.USER_ASSET_BALANCE_REQUEST,
                        payload: {assetId: 16001, signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'},
                    },
                });
            });
        });
    });
});

describe('Request total liquidity working', () => {
    const asset = 16000;
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const triggers = [updateSelectedAccount(newAccount), updateSelectedAsset1(asset)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                feeAssetId: 16001,
                                signingAccount: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
                                extrinsic: ADD_LIQUIDITY,
                            },
                        },
                    },
                });

                const output$ = prepareRequestTotalLiquidityEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TOTAL_LIQUIDITY_REQUEST,
                        payload: 16000,
                    },
                });
            });
        });
    });
});
