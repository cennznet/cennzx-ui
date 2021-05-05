import {StateObservable} from 'redux-observable';
import {Amount} from '../../../../util/Amount';
import {
    requestTransactionFee,
    updateAsset1Amount,
    updateAsset2Amount,
    updateExtrinsic,
    updateFeeAsset,
    updateSelectedAccount,
} from '../../../actions/ui/liquidity.action';
import types from '../../../actions';
import {TestScheduler} from 'rxjs/testing';
import {Observable, of, Subject} from 'rxjs/index';
import {IEpicDependency} from '../../../../typings';
import {AppState} from '../../../reducers';
import {ADD_LIQUIDITY, prepareExchangeExtrinsicParamsWithBuffer, SWAP_INPUT} from '../../../../util/extrinsicUtil';
import {prepareTransactionFeeEpic, requestTransactionFeeEpic} from '../../liquidity/transactionFee.epic';

describe('Prepare transaction paramater epic working', () => {
    const triggers = [requestTransactionFee()];
    const [assetId, coreAssetId, coreAmount, assetAmount, buffer] = [16000, 16001, new Amount(2), new Amount(1), 0.05];
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
                                assetId: assetId,
                                coreAssetId: coreAssetId,
                                assetAmount: assetAmount,
                                coreAmount: coreAmount,
                                extrinsic: ADD_LIQUIDITY,
                                buffer: buffer,
                            },
                        },
                    },
                });
                const paramList = prepareExchangeExtrinsicParamsWithBuffer(ADD_LIQUIDITY, {
                    assetId,
                    coreAssetId,
                    coreAmount,
                    assetAmount,
                    buffer,
                });
                const output$ = prepareTransactionFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TRANSACTION_FEE_PARAMS_UPDATE,
                        payload: paramList,
                    },
                });
            });
        });
    });
});

describe('Request transaction fee epic working', () => {
    const amount = new Amount('2');
    const triggers = [
        updateAsset1Amount(amount),
        updateAsset2Amount(amount),
        updateExtrinsic(ADD_LIQUIDITY),
        updateSelectedAccount('aa'),
        updateFeeAsset(16000),
    ];
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
                                coreAssetId: 16001,
                                assetAmount: amount,
                                coreAmount: amount,
                                extrinsic: ADD_LIQUIDITY,
                                buffer: 0.05,
                                signingAccount: 'aaa',
                            },
                        },
                    },
                });

                const output$ = requestTransactionFeeEpic(action$, state$, dependencies);
                expectObservable(output$).toBe(expect_, {
                    c: {
                        type: types.ui.Liquidity.TRANSACTION_FEE_REQUEST,
                    },
                });
            });
        });
    });
});
