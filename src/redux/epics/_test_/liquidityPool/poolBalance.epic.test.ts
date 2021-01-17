import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {getPoolBalanceEpic} from '../../liquidityPool/poolBalance.epic';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {requestPoolBalance} from '../../../actions/ui/liquidityPool.action';
import {ADD_LIQUIDITY} from '../../../../util/extrinsicUtil';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

describe('trigger on pool balance epic works', () => {
    const asset = 16000;
    const triggers = [requestPoolBalance(asset)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const getPoolAssetBalance       = ' -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = '-d-';
                // prettier-ignore
                const exchangeAddress           = '-e-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {
                        getPoolAssetBalance: () =>
                            cold(getPoolAssetBalance, {
                                b: new BN('34220'),
                            }),
                        getPoolCoreAssetBalance: () =>
                            cold(getPoolCoreAssetBalance, {
                                d: new BN('14220'),
                            }),
                    },
                    derive: {
                        cennzx: {
                            exchangeAddress: () =>
                                cold(exchangeAddress, {
                                    e: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                }),
                        },
                    },
                });

                window.SingleSource = {
                    accounts$,
                    signer: {
                        sign: async (t, n, e) => {
                            return 1;
                        },
                    },
                };

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidityPool: {
                            addLiquidity: {
                                investorBalance: null,
                                form: {
                                    asset: 16000,
                                    investor: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                },
                            },
                            extrinsic: ADD_LIQUIDITY,
                            removeLiquidity: null,
                            exchangePool: {
                                coreAssetBalance: new Amount('120'),
                                assetBalance: new Amount('320'),
                                address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                            },
                        },
                    },
                });

                const output$ = getPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.LiquidityPool.EXCHANGE_POOL_BALANCE_UPDATE,
                        payload: {
                            coreAssetBalance: new Amount('14220'),
                            assetBalance: new Amount('34220'),
                            address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                            assetId: 16000,
                        },
                    },
                });
            });
        });
    });
});

describe('Pool balance epic should return EMPTY when no data has changed', () => {
    const asset = 16000;
    const triggers = [requestPoolBalance(asset)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                // somehow assert the two objects are equal
                // e.g. with chai `expect(actual).deep.equal(expected)`
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const getPoolAssetBalance       = ' -b-';
                // prettier-ignore
                const getPoolCoreAssetBalance   = '-d-';
                // prettier-ignore
                const exchangeAddress           = '-e-';
                // prettier-ignore
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {
                        getPoolAssetBalance: () =>
                            cold(getPoolAssetBalance, {
                                b: new BN('34220'),
                            }),
                        getPoolCoreAssetBalance: () =>
                            cold(getPoolCoreAssetBalance, {
                                d: new BN('14220'),
                            }),
                    },
                    derive: {
                        cennzx: {
                            exchangeAddress: () =>
                                cold(exchangeAddress, {
                                    e: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                }),
                        },
                    },
                });

                window.SingleSource = {
                    accounts$,
                    signer: {
                        sign: async (t, n, e) => {
                            return 1;
                        },
                    },
                };

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;
                const poolBalance = {
                    coreAssetBalance: new Amount('14220'),
                    assetBalance: new Amount('34220'),
                    address: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                    assetId: 16000,
                };
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidityPool: {
                            addLiquidity: {
                                investorBalance: null,
                                form: {
                                    asset: 16000,
                                    investor: '5D35SxvLbdxyQAaQRfRs9XAUR1yqJNqAFmovtQH5AZXh1JAe',
                                },
                            },
                            extrinsic: ADD_LIQUIDITY,
                            removeLiquidity: null,
                            exchangePool: poolBalance,
                        },
                    },
                });

                const output$ = getPoolBalanceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});
