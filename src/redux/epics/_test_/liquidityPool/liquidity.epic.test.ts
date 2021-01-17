import {StateObservable} from 'redux-observable';
import {Observable, of, Subject} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, IUserBalance} from '../../../../typings';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {
    requestTotalLiquidity,
    requestUserLiquidity,
    updateExtrinsic,
    updateUserLiquidity,
} from '../../../actions/ui/liquidityPool.action';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY} from '../../../../util/extrinsicUtil';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {
    getTotalLiquidityEpic,
    getUserLiquidityEpic,
    prepareLiquidityParmsEpic,
} from '../../liquidityPool/liquidity.epic';
import BN from 'bn.js';
import {Amount} from '../../../../util/Amount';

describe('Liquidity epic', () => {
    describe('Test prepareLiquidityParmsEpic for add liquidity', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [updateExtrinsic(ADD_LIQUIDITY)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_           = '-a-';
                    // prettier-ignore
                    const expect_           = '-(cde)-';

                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = EMPTY;

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                            },
                        },
                    });
                    const output$ = prepareLiquidityParmsEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.USER_LIQUIDITY_REQUEST,
                            payload: {assetId: 16000, address: newAccount},
                        },
                        d: {
                            type: types.ui.LiquidityPool.TOTAL_LIQUIDITY_REQUEST,
                            payload: 16000,
                        },
                        e: {
                            type: types.ui.LiquidityPool.POOL_BALANCE_REQUEST,
                            payload: 16000,
                        },
                    });
                });
            });
        });
    });

    describe('Test prepareLiquidityParmsEpic for remove liquidity', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [updateExtrinsic(REMOVE_LIQUIDITY)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_           = '-a-';
                    // prettier-ignore
                    const expect_           = '-(cde)-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = EMPTY;

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                removeLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: REMOVE_LIQUIDITY,
                                addLiquidity: null,
                            },
                        },
                    });
                    const output$ = prepareLiquidityParmsEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.USER_LIQUIDITY_REQUEST,
                            payload: {assetId: 16000, address: newAccount},
                        },
                        d: {
                            type: types.ui.LiquidityPool.TOTAL_LIQUIDITY_REQUEST,
                            payload: 16000,
                        },
                        e: {
                            type: types.ui.LiquidityPool.POOL_BALANCE_REQUEST,
                            payload: 16000,
                        },
                    });
                });
            });
        });
    });

    describe('Test prepareLiquidityParmsEpic when no extrinsic is set should return EMPTY', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [updateExtrinsic(REMOVE_LIQUIDITY)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_           = '-a-';
                    // prettier-ignore
                    const expect_           = '';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = EMPTY;

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                removeLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: null,
                                addLiquidity: null,
                            },
                        },
                    });
                    const output$ = prepareLiquidityParmsEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_);
                });
            });
        });
    });

    describe('Test get user liquidity', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [requestUserLiquidity(16000, newAccount)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_                       = '-a-';
                    // prettier-ignore
                    const getLiquidityBalance_          = '-b-';
                    // prettier-ignore
                    const expect_                       = '--c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = of({
                        cennzx: {
                            getLiquidityBalance: () =>
                                cold(getLiquidityBalance_, {
                                    b: new BN('1230'),
                                }),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    const output$ = getUserLiquidityEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.USER_LIQUIDITY_UPDATE,
                            payload: new Amount('1230'),
                        },
                    });
                });
            });
        });
    });

    describe('Test get total liquidity', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

        const triggers = [requestTotalLiquidity(16000)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_                       = '-a-';
                    // prettier-ignore
                    const getTotalLiquidity_            = '-b-';
                    // prettier-ignore
                    const expect_                       = '--c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = of({
                        cennzx: {
                            getTotalLiquidity: () =>
                                cold(getTotalLiquidity_, {
                                    b: new BN('3230'),
                                }),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                totalLiquidity: new Amount(1),
                            },
                        },
                    });
                    const output$ = getTotalLiquidityEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.TOTAL_LIQUIDITY_UPDATE,
                            payload: new Amount('3230'),
                        },
                    });
                });
            });
        });
    });
});
