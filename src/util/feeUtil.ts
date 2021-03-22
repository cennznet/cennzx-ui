import {ApiRx, SubmittableResult} from '@cennznet/api';
import {SubmittableExtrinsic} from '@cennznet/api/types';
import {Hash} from '@plugnet/types/interfaces';
import BN from 'bn.js';
import {async, Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {Amount, AmountUnit} from './Amount';

/**
 *
 * @param {ICennznetExtrinsic<Observable<SubmittableResult>, {}>} tx
 * @param {string} siginingAccount
 * @param {number} feeAssetId
 * @param {ApiRx} api
 * @returns {Observable<[BN, BN]>} - The first BN is the fee in CPAY and second BN is the fee in fee asset.
 */

const getFee = async (api, feeAssetId, signingAccount, maxPayment) => {
    const extrinsic = await api.tx.genericAsset.transfer(feeAssetId, signingAccount, 10000);
    const feeFromQuery = await api.derive.fees.estimateFee({extrinsic, userFeeAssetId: feeAssetId, maxPayment});
    return feeFromQuery;
};

export function observableEstimatedFee(
    tx: SubmittableExtrinsic<'promise' | 'rxjs'>,
    signingAccount: string,
    feeAssetId: number,
    api: ApiRx
): Observable<[BN, BN]> {
    // const CPAY = {id: 11}
    // const isFeeAssetNotCPAY = feeAssetId !== CPAY.id;
    // First time use maxPayment as constant
    //1630000000000000
    const assetAmount = new Amount('0.00163', AmountUnit.DISPLAY);
    // if (isFeeAssetNotCPAY) {
    //     tx.addFeeExchangeOpt({
    //         assetId: feeAssetId,
    //         maxPayment: assetAmount,
    //     });
    // }

    const encodedLengthFirstTime = tx.encodedLength;

    const observableFee = api.rpc.payment.queryInfo(tx.toHex());
    // if (!isFeeAssetNotCPAY) {
    //     return observableFee.pipe(map((fee): [BN, BN] => [fee, null]));
    // }
    return observableFee.pipe(
        switchMap(feeAmtInCPAY => {
            const maxPayment = '50000000000000000';
            // const extrinsic = api.tx.genericAsset.transfer(feeAssetId, signingAccount, 10000);

            return api.derive.fees.estimateFee({extrinsic: tx, userFeeAssetId: feeAssetId, maxPayment}).pipe(
                switchMap(estimatedFeeAssetAmount => {
                    // const maxPayment = addBufer(estimatedFeeAssetAmount);
                    // const encodedLengthSecondTime = tx.encodedLength;
                    // if (encodedLengthFirstTime === encodedLengthSecondTime) {
                    return of([feeAmtInCPAY.partialFee as BN, estimatedFeeAssetAmount as BN]);
                    // } else {
                    //     return tx.fee(signingAccount).pipe(map((fee): [BN, BN] => [fee as BN, maxPayment as BN]));
                    // }
                }),
                catchError((err: Error) => {
                    // tslint:disable-next-line:no-console
                    console.log('error', err);
                })
            );
        })
    );
}

export function observableActualFee(blockHash: Hash, extrinsicIndex: BN, api: ApiRx): Observable<BN> {
    return api.query.system.events.at(blockHash).pipe(
        map((events: any) => {
            //event.event.data = [0 - extrinsic index and 1 - fee amount] for fee charged event
            const feeChargeEvent = events.find(
                event =>
                    event.event.data.method === 'Charged' &&
                    event.event.section === 'fees' &&
                    event.event.data[0].eq(extrinsicIndex)
            );
            if (feeChargeEvent) {
                const gas = feeChargeEvent.event.data[1];
                return gas;
            } else {
                throw new Error('Error fetching fee charged');
            }
        })
    );
}

export function addBufer(assetAmount: BN) {
    if (typeof window !== 'undefined') {
        return assetAmount.muln(1 + window.config.FEE_BUFFER);
    }
}
