import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {of} from 'rxjs/index';
import {TestScheduler} from 'rxjs/testing';
import {IncorrectLiquidity} from '../../../../error/error';
import {IEpicDependency} from '../../../../typings';
import {Amount, AmountUnit} from '../../../../util/Amount';
import types from '../../../actions';
import {
    requestAssetLiquidityPrice,
    requestCoreLiquidityPrice,
    setAsset1Amount,
    setAsset2Amount,
    updateSelectedAsset1,
} from '../../../actions/ui/liquidity.action';
import {AppState} from '../../../reducers';
import {
    getAssetLiquidityPriceEpic,
    getCoreLiquidityPriceEpic,
    requestAssetLiquidityPriceEpic,
    requestCoreLiquidityPriceEpic,
} from '../../liquidity/liquidityRate.epic';

describe('Get core amount when asset amount is provided ~ Add Liquidity', () => {
    const triggers = [requestCoreLiquidityPrice()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(bc)-';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const assetAmount = new Amount(123);
                const coreAssetReserve = new Amount(1000);
                const tradeAssetReserve = new Amount(10001);
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                assetAmount: assetAmount,
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [
                                {
                                    coreAssetBalance: coreAssetReserve,
                                    assetBalance: tradeAssetReserve,
                                    address: '5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg',
                                    assetId: 16000,
                                },
                            ],
                            totalLiquidity: new Amount(111),
                        },
                    },
                });

                const coreAmount = assetAmount.mul(coreAssetReserve).div(tradeAssetReserve);
                const output$ = getCoreLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ERROR_REMOVE,
                        payload: new IncorrectLiquidity(),
                        error: true,
                    },
                    c: {
                        type: types.ui.Liquidity.ASSET2_AMOUNT_UPDATE,
                        payload: new Amount(coreAmount),
                    },
                });
            });
        });
    });
});

describe('Get core amount when asset amount is very low 0.0001 ~ Add Liquidity', () => {
    const triggers = [requestCoreLiquidityPrice()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-(bc)-';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const assetAmount = new Amount(0, AmountUnit.DISPLAY);
                const coreAssetReserve = new Amount(1000);
                const tradeAssetReserve = new Amount(1000);
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                assetAmount: assetAmount,
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [
                                {
                                    coreAssetBalance: coreAssetReserve,
                                    assetBalance: tradeAssetReserve,
                                    address: '5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg',
                                    assetId: 16000,
                                },
                            ],
                            totalLiquidity: new Amount(111),
                        },
                    },
                });

                const output$ = getCoreLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ERROR_SET,
                        payload: new IncorrectLiquidity(),
                        error: true,
                    },
                    c: {
                        type: types.ui.Liquidity.ASSET2_AMOUNT_UPDATE,
                    },
                });
            });
        });
    });
});

describe('Get asset amount when core amount is provided  ~ Add Liquidity', () => {
    const triggers = [requestAssetLiquidityPrice()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-b-';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    cennzx: {},
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const coreAmount = new Amount(395);
                const coreAssetReserve = new Amount(12000);
                const tradeAssetReserve = new Amount(10031);
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    extension: {
                        extensionDetected: true,
                        extensionConnected: true,
                        accounts: [],
                    },
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                coreAmount: coreAmount,
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [
                                {
                                    coreAssetBalance: coreAssetReserve,
                                    assetBalance: tradeAssetReserve,
                                    address: '5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg',
                                    assetId: 16000,
                                },
                            ],
                            totalLiquidity: new Amount(111),
                        },
                    },
                });

                const assetAmount = coreAmount
                    .mul(tradeAssetReserve)
                    .div(coreAssetReserve)
                    .addn(1);
                const output$ = getAssetLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ASSET1_AMOUNT_UPDATE,
                        payload: new Amount(assetAmount),
                    },
                });
            });
        });
    });
});

describe('Test when pool is emtpy, get asset liquidity price epic should return empty', () => {
    const triggers = [requestAssetLiquidityPrice()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '';

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
                                coreAmount: new Amount(131),
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [],
                        },
                    },
                });

                const output$ = getAssetLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when pool is emtpy, get core liquidity price epic should return empty', () => {
    const triggers = [requestCoreLiquidityPrice()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '';

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
                                assetAmount: new Amount(131),
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [],
                        },
                    },
                });

                const output$ = getCoreLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Request core liquidity price epic working', () => {
    const inputAmount = new Amount('2');
    const triggers = [setAsset1Amount(inputAmount), updateSelectedAsset1(16000)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-b';

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
                                assetAmount: new Amount(131),
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [],
                        },
                    },
                });

                const output$ = requestCoreLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.CORE_LIQUIDITY_PRICE_REQUEST,
                    },
                });
            });
        });
    });
});

describe('Request asset liquidity price epic working', () => {
    const inputAmount = new Amount('2');
    const triggers = [setAsset2Amount(inputAmount)];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const expect_                   = '-b';

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
                                coreAmount: new Amount(131),
                                coreAssetId: 16001,
                                extrinsic: 'addLiquidity',
                            },
                            exchangePool: [],
                        },
                    },
                });

                const output$ = requestAssetLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ASSET_LIQUIDITY_PRICE_REQUEST,
                    },
                });
            });
        });
    });
});
