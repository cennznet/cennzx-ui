import BN from 'bn.js';
import ErrorBox from 'components/Error/ErrorBox';
import TxSummary, {TxSummaryProps} from 'components/TxSummary/TxSummary';
import React, {FC} from 'react';
import {FormSection} from '../pages/exchange/exchange';
import {Asset} from '../typings';
import {FormErrors} from './../pages/exchange/validation';

type SummaryOrErrorProps = {
    formErrors: FormErrors;
    summaryProps?: TxSummaryProps;
    onAssetChange: (assetId: number) => void;
    onBufferChange: (buffer: number) => void;
    assets: Asset[];
};

const SummaryOrError: FC<SummaryOrErrorProps> = ({formErrors, summaryProps, onAssetChange, assets, onBufferChange}) => {
    const {
        toAssetAmount,
        fromAssetAmount,
        toAsset,
        fromAsset,
        buffer,
        txFee,
        feeAssetId,
        coreAsset,
        extrinsic,
    } = summaryProps;

    if (formErrors.has(FormSection.form)) {
        return (
            <>
                <ErrorBox center={true} errors={formErrors.get(FormSection.form)} />

                <TxSummary
                    extrinsic={extrinsic}
                    feeAssetId={feeAssetId}
                    coreAsset={coreAsset}
                    txFee={txFee}
                    toAssetAmount={toAssetAmount}
                    toAsset={toAsset}
                    fromAssetAmount={fromAssetAmount}
                    fromAsset={fromAsset}
                    buffer={buffer}
                    onAssetChange={onAssetChange}
                    onBufferChange={onBufferChange}
                    assets={assets}
                />
            </>
        );
    } else if (formErrors.size > 0) {
        return <ErrorBox center={true}>Enter all values to continue</ErrorBox>;
    } else {
        if (txFee) {
            return (
                <TxSummary
                    extrinsic={extrinsic}
                    feeAssetId={feeAssetId}
                    coreAsset={coreAsset}
                    txFee={txFee}
                    toAssetAmount={toAssetAmount}
                    toAsset={toAsset}
                    fromAssetAmount={fromAssetAmount}
                    fromAsset={fromAsset}
                    buffer={buffer}
                    onAssetChange={onAssetChange}
                    onBufferChange={onBufferChange}
                    assets={assets}
                />
            );
        } else return <> </>;
    }
};

export default SummaryOrError;
