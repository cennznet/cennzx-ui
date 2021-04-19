import {StateObservable} from 'redux-observable';
import {Observable, Subject} from 'rxjs';
import types from '../../../actions';
import {requestAssetLiquidityPrice, requestCoreLiquidityPrice} from '../../../actions/ui/liquidity.action';
import {AppState} from '../../../reducers';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency} from '../../../../typings';
import {Amount} from '../../../../util/Amount';
import {of} from 'rxjs/index';
import {getAssetLiquidityPriceEpic, getCoreLiquidityPriceEpic} from '../../liquidity/liquidityRate.epic';

describe('Get core amount when asset amount is provided ~ Remove Liquidity', () => {
    const triggers = [requestCoreLiquidityPrice()];
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
                const totalLiquidity = new Amount(111);
                const state$: Observable<AppState> = new StateObservable(new Subject(), {
                    ui: {
                        liquidity: {
                            form: {
                                assetId: 16000,
                                assetAmount: assetAmount,
                                coreAssetId: 16001,
                                extrinsic: 'removeLiquidity',
                            },
                            exchangePool: [
                                {
                                    coreAssetBalance: coreAssetReserve,
                                    assetBalance: tradeAssetReserve,
                                    address: '5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg',
                                    assetId: 16000,
                                },
                            ],
                            totalLiquidity: totalLiquidity,
                        },
                    },
                });

                let liquidityAmount;
                if (tradeAssetReserve.toString() === coreAssetReserve.toString()) {
                    liquidityAmount = assetAmount.mul(totalLiquidity).div(tradeAssetReserve);
                } else {
                    liquidityAmount = assetAmount
                        .mul(totalLiquidity)
                        .div(tradeAssetReserve)
                        .addn(1);
                }
                const coreAmount = liquidityAmount.mul(coreAssetReserve).div(totalLiquidity);
                const output$ = getCoreLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ASSET2_AMOUNT_UPDATE,
                        payload: new Amount(coreAmount),
                    },
                    c: {
                        type: types.ui.Liquidity.LIQUIDITY_TO_WITHDRAW_UPDATE,
                        payload: new Amount(liquidityAmount),
                    },
                });
            });
        });
    });
});

describe('Get asset amount when core amount is provided ~ Remove Liquidity', () => {
    const triggers = [requestAssetLiquidityPrice()];
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

                const coreAmount = new Amount(395);
                const coreAssetReserve = new Amount(12000);
                const tradeAssetReserve = new Amount(10031);
                const totalLiquidity = new Amount(111);
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
                                extrinsic: 'removeLiquidity',
                            },
                            exchangePool: [
                                {
                                    coreAssetBalance: coreAssetReserve,
                                    assetBalance: tradeAssetReserve,
                                    address: '5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg',
                                    assetId: 16000,
                                },
                            ],
                            totalLiquidity: totalLiquidity,
                        },
                    },
                });

                let liquidityAmount;
                if (tradeAssetReserve.toString() === coreAssetReserve.toString()) {
                    liquidityAmount = coreAmount.mul(totalLiquidity).div(coreAssetReserve);
                } else {
                    liquidityAmount = coreAmount
                        .mul(totalLiquidity)
                        .div(coreAssetReserve)
                        .addn(1);
                }
                const assetAmount = liquidityAmount.mul(tradeAssetReserve).div(totalLiquidity);
                const output$ = getAssetLiquidityPriceEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    b: {
                        type: types.ui.Liquidity.ASSET1_AMOUNT_UPDATE,
                        payload: new Amount(assetAmount),
                    },
                    c: {
                        type: types.ui.Liquidity.LIQUIDITY_TO_WITHDRAW_UPDATE,
                        payload: new Amount(liquidityAmount),
                    },
                });
            });
        });
    });
});
