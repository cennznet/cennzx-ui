import {StateObservable} from 'redux-observable';
import {Observable, of, Subject} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {IEpicDependency, IUserBalance} from '../../../../typings';
import types from '../../../actions';
import {AppState} from '../../../reducers';
import {
    updateInvestmentCoreAmount,
    updateTxFeeParameter,
    updateWithdrawalLiquidity,
} from '../../../actions/ui/liquidityPool.action';
import {ADD_LIQUIDITY, REMOVE_LIQUIDITY, SWAP_OUTPUT} from '../../../../util/extrinsicUtil';
import {EMPTY} from 'rxjs/internal/observable/empty';
import {Amount} from '../../../../util/Amount';
import {
    calculateTxFeeEpic,
    prepareTxFeeParamsForAddLiquidityEpic,
    prepareTxFeeParamsForRemoveLiquidityEpic,
} from '../../liquidityPool/transactionFee.epic';
import {SubmittableExtrinsic} from '@plugnet/api/SubmittableExtrinsic';
import {Promise} from 'q';
import {IHash} from '@plugnet/types/types';
import BN from 'bn.js';
import {addBufer} from '../../../../util/feeUtil';
import {NodeConnectionTimeOut} from '../../../../error/error';
import {throwError} from 'rxjs/internal/observable/throwError';

describe('transaction fee epic', () => {
    const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
    const asset = 16000;
    const amt = new Amount(100);

    describe('Test prepareTxFeeParamsForAddLiquidityEpic', () => {
        const triggers = [updateInvestmentCoreAmount(amt), updateInvestmentCoreAmount(amt)];
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
                    const expect_           = '-c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = EMPTY;

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    //const {assetAmount, coreAmount, asset, investor, feeAssetId} = store.ui.liquidityPool.addLiquidity.form;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: 16001,
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: asset,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16001,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                            },
                        },
                    });
                    const minLiquidity = 1;
                    const paramList = [asset, minLiquidity, amt, amt];
                    const txParams = {
                        extrinsicParams: paramList,
                        feeAsset: 16001,
                        investor: newAccount,
                    };

                    const output$ = prepareTxFeeParamsForAddLiquidityEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.TRANSACTION_FEE_PARAMS_UPDATE,
                            payload: txParams,
                        },
                    });
                });
            });
        });
    });

    describe('Test prepare transaction fee params for remove liquidity epic', () => {
        const triggers = [updateWithdrawalLiquidity(amt)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_       = '-a-';
                    // prettier-ignore
                    const expect_       = '-c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const api$ = EMPTY;

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    //const {assetAmount, coreAmount, asset, investor, feeAssetId} = store.ui.liquidityPool.addLiquidity.form;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                removeLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: asset,
                                        liquidity: amt,
                                        feeAssetId: 16001,
                                        investor: newAccount,
                                    },
                                },
                                extrinsic: REMOVE_LIQUIDITY,
                                addLiquidity: null,
                            },
                        },
                    });
                    const minAssetWithdrawn = 1;
                    const minCoreWithdrawn = 1;
                    const paramList = [asset, amt, minAssetWithdrawn, minCoreWithdrawn];
                    const txParams = {
                        extrinsicParams: paramList,
                        feeAsset: 16001,
                        investor: newAccount,
                    };

                    const output$ = prepareTxFeeParamsForRemoveLiquidityEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.TRANSACTION_FEE_PARAMS_UPDATE,
                            payload: txParams,
                        },
                    });
                });
            });
        });
    });

    describe('Calculate Tx Fee', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const minLiquidity = 1;
        const paramList = [asset, minLiquidity, amt, amt];
        const txParams = {extrinsicParams: paramList, feeAsset: 16001, investor: newAccount};
        const triggers = [updateTxFeeParameter(txParams)];
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
                    const expect_           = '-c-';
                    const action$ = hot(action_, {
                        a: action,
                    });
                    const tx: SubmittableExtrinsic<Promise<IHash>, Promise<() => any>> = {
                        fee(address: string): Observable<BN> {
                            return of(new BN('1230'));
                        },
                    } as any;

                    const api$ = of({
                        cennzx: {
                            addLiquidity: () => tx,
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16001,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                txFeeParams: txParams,
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.TRANSACTION_FEE_UPDATE,
                            payload: {feeInCpay: new Amount('1230'), feeInFeeAsset: null},
                        },
                    });
                });
            });
        });
    });

    describe('Calculate Tx Fee when fee asset is CPAY and fee has not changed so Return EMPTY', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const minLiquidity = 1;
        const paramList = [asset, minLiquidity, amt, amt];
        const txParams = {extrinsicParams: paramList, feeAsset: 16001, investor: newAccount};
        const triggers = [updateTxFeeParameter(txParams)];
        triggers.forEach(action => {
            it(action.type, () => {
                const testScheduler = new TestScheduler((actual, expected) => {
                    // somehow assert the two objects are equal
                    // e.g. with chai `expect(actual).deep.equal(expected)`
                    expect(actual).toEqual(expected);
                });
                testScheduler.run(({hot, cold, expectObservable}) => {
                    // prettier-ignore
                    const action_ =      '-a-';
                    // prettier-ignore
                    const expect_ =      '';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    const tx: SubmittableExtrinsic<Promise<IHash>, Promise<() => any>> = {
                        fee(address: string): Observable<BN> {
                            return of(new BN('1230'));
                        },
                    } as any;

                    const api$ = of({
                        cennzx: {
                            addLiquidity: () => tx,
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16001,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                txFeeParams: txParams,
                                txFee: {feeInCpay: new BN(1230), feeInFeeAsset: null},
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_);
                });
            });
        });
    });

    describe('Calculate Tx Fee when fee asset is CPAY and Fee asset as CENNZ', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const minLiquidity = 1;
        const paramList = [asset, minLiquidity, amt, amt];
        const txParams = {extrinsicParams: paramList, feeAsset: 16000, investor: newAccount};
        const triggers = [updateTxFeeParameter(txParams)];
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
                    const getOutputPrice            = ' -b-';
                    // prettier-ignore
                    const expect_                   = '--c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    type FeeExchangeValue = {
                        assetId: number;
                        maxPayment: number;
                    };
                    const tx: SubmittableExtrinsic<Promise<IHash>, Promise<() => any>> = {
                        fee(address: string): Observable<BN> {
                            return of(new BN('1230'));
                        },
                        addFeeExchangeOpt(feeExchangeOpt: FeeExchangeValue) {},
                    } as any;

                    const api$ = of({
                        cennzx: {
                            addLiquidity: () => tx,
                            getOutputPrice: () =>
                                cold(getOutputPrice, {
                                    b: new BN('43'),
                                }),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16000,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                txFeeParams: txParams,
                                txFee: {feeInCpay: new BN(1230), feeInFeeAsset: null},
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    window.config.FEE_BUFFER = 0.05;
                    const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            type: types.ui.LiquidityPool.TRANSACTION_FEE_UPDATE,
                            payload: {feeInCpay: new Amount('1230'), feeInFeeAsset: addBufer(new BN('43'))},
                        },
                    });
                });
            });
        });
    });

    describe('Return empty when fee doesnt change', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const minLiquidity = 1;
        const paramList = [asset, minLiquidity, amt, amt];
        const txParams = {extrinsicParams: paramList, feeAsset: 16000, investor: newAccount};
        const triggers = [updateTxFeeParameter(txParams)];
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
                    const getOutputPrice            = ' -b-';
                    // prettier-ignore
                    const expect_                   = '';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    type FeeExchangeValue = {
                        assetId: number;
                        maxPayment: number;
                    };
                    const tx: SubmittableExtrinsic<Promise<IHash>, Promise<() => any>> = {
                        fee(address: string): Observable<BN> {
                            return of(new BN('132'));
                        },
                        addFeeExchangeOpt(feeExchangeOpt: FeeExchangeValue) {},
                    } as any;

                    const api$ = of({
                        cennzx: {
                            addLiquidity: () => tx,
                            getOutputPrice: () =>
                                cold(getOutputPrice, {
                                    b: new BN('37'),
                                }),
                        },
                    });
                    window.config.FEE_BUFFER = 0.05;
                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16000,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                txFeeParams: txParams,
                                txFee: {feeInCpay: new Amount('132'), feeInFeeAsset: addBufer(new BN('37'))},
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    const output$ = calculateTxFeeEpic(action$, state$, dependencies);
                    expectObservable(output$).toBe(expect_);
                });
            });
        });
    });

    describe('Calculate Tx Fee when conversion to fee asset throw low general error', () => {
        const newAccount = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
        const minLiquidity = 1;
        const paramList = [asset, minLiquidity, amt, amt];
        const txParams = {extrinsicParams: paramList, feeAsset: 16000, investor: newAccount};
        const triggers = [updateTxFeeParameter(txParams)];
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
                    const getOutputPrice            = ' -b-';
                    // prettier-ignore
                    const expect_                   = '-c-';
                    const action$ = hot(action_, {
                        a: action,
                    });

                    type FeeExchangeValue = {
                        assetId: number;
                        maxPayment: number;
                    };
                    const tx: SubmittableExtrinsic<Promise<IHash>, Promise<() => any>> = {
                        fee(address: string): Observable<BN> {
                            return of(new BN('132'));
                        },
                        addFeeExchangeOpt(feeExchangeOpt: FeeExchangeValue) {},
                    } as any;

                    const err = new NodeConnectionTimeOut();
                    const api$ = of({
                        cennzx: {
                            addLiquidity: () => tx,
                            getOutputPrice: () => throwError(err),
                        },
                    });

                    const dependencies = ({
                        api$,
                    } as unknown) as IEpicDependency;
                    const state$: Observable<AppState> = new StateObservable(new Subject(), {
                        global: {
                            coreAsset: new EnhancedAssetId(16001),
                        },
                        ui: {
                            liquidityPool: {
                                addLiquidity: {
                                    investorBalance: null,
                                    form: {
                                        asset: 16000,
                                        investor: newAccount,
                                        assetAmount: amt,
                                        coreAmount: amt,
                                        feeAssetId: 16000,
                                    },
                                },
                                extrinsic: ADD_LIQUIDITY,
                                removeLiquidity: null,
                                txFeeParams: txParams,
                                txFee: {feeInCpay: new Amount('132'), feeInFeeAsset: new BN('37')},
                                userLiquidity: new Amount(1),
                            },
                        },
                    });
                    window.config.FEE_BUFFER = 0.05;
                    const output$ = calculateTxFeeEpic(action$, state$, dependencies);

                    expectObservable(output$).toBe(expect_, {
                        c: {
                            error: true,
                            type: types.ui.LiquidityPool.ERROR_SET,
                            payload: err,
                        },
                    });
                });
            });
        });
    });
});
