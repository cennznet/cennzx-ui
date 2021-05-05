import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import {ReplaySubject} from 'rxjs';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {
    requestExchangeRate,
    updateSelectedAccount,
    updateSelectedAsset1,
    updateTotalLiquidity,
} from '../../../actions/ui/liquidity.action';
import {Amount, AmountUnit} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import BN from 'bn.js';
import {throwError} from 'rxjs/internal/observable/throwError';
import {AmountExceedsPoolBalance, NodeConnectionTimeOut} from '../../../../error/error';
import {getExchangeRateEpic, requestExchangeRateEpic} from '../../liquidity/exchangeRate.epic';

const accounts$ = new ReplaySubject<any>(1);
const account = [
    {
        name: 'Account 1',
        address: '5GDq1kEpNzxWQcnviMRFnp1y8m47kWC1EDEUzgCZQFc4G1Df',
    },
];
accounts$.next(account);

const globalAssetList = new Array();
globalAssetList[16000] = {decimalPlaces: 4, symbol: 'CENNZ', id: 16000};
globalAssetList[16001] = {decimalPlaces: 4, symbol: 'CPAY', id: 16001};

describe('Get exchange rate working', () => {
    const triggers = [requestExchangeRate()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const sellPrice                 = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () =>
                                cold(sellPrice, {
                                    b: new BN('22'),
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
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                            },
                            totalLiquidity: new Amount(120),
                        },
                    },
                    global: {
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.EXCHANGE_RATE_UPDATE,
                        payload: new Amount('22'),
                    },
                });
            });
        });
    });
});

describe('Update the exchange rate to a different value', () => {
    const triggers = [requestExchangeRate()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const sellPrice                 = ' -b-';
                // prettier-ignore
                const expect_                   = '--c';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () =>
                                cold(sellPrice, {
                                    b: new BN('2'),
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
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                            },
                            totalLiquidity: new Amount(120),
                        },
                    },
                    global: {
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.EXCHANGE_RATE_UPDATE,
                        payload: new Amount('2'),
                    },
                });
            });
        });
    });
});

describe('Update the exchange rate to a same value should return empty', () => {
    const triggers = [requestExchangeRate()];
    triggers.forEach(action => {
        it(action.type, () => {
            const testScheduler = new TestScheduler((actual, expected) => {
                expect(actual).toEqual(expected);
            });
            testScheduler.run(({hot, cold, expectObservable}) => {
                // prettier-ignore
                const action_                   = '-a-';
                // prettier-ignore
                const sellPrice                 = ' -b-';
                // prettier-ignore
                const expect_                   = '';

                const action$ = hot(action_, {
                    a: action,
                });

                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () =>
                                cold(sellPrice, {
                                    b: new BN('2'),
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
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                            },
                            exchangeRate: new Amount(2),
                            totalLiquidity: new Amount(120),
                        },
                    },
                    global: {
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test exchange rate epic when pool is empty, should return empty', () => {
    const triggers = [requestExchangeRate()];
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
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(new Error('Pool balance is low')),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                            },
                            totalLiquidity: new Amount(0),
                        },
                    },
                    global: {
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_);
            });
        });
    });
});

describe('Test when exchange rate epic throws error', () => {
    const triggers = [requestExchangeRate()];
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

                const err = new NodeConnectionTimeOut();
                const api$ = of({
                    rpc: {
                        cennzx: {
                            sellPrice: () => throwError(err),
                        },
                    },
                });

                const dependencies = ({
                    api$,
                } as unknown) as IEpicDependency;

                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                coreAssetId: 16001,
                            },
                            totalLiquidity: new Amount(10),
                        },
                    },
                    global: {
                        assetInfo: globalAssetList,
                    },
                });

                const output$ = getExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        error: true,
                        type: types.ui.Liquidity.ERROR_SET,
                        payload: err,
                    },
                });
            });
        });
    });
});

describe('Request exchange rate working', () => {
    const totalLiquidity = new Amount('2');
    const triggers = [updateTotalLiquidity(totalLiquidity), updateSelectedAsset1(16000)];
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

                const state$: Observable<AppState> = new StateObservable(new Subject(), {});

                const output$ = requestExchangeRateEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.EXCHANGE_RATE_REQUEST,
                    },
                });
            });
        });
    });
});
