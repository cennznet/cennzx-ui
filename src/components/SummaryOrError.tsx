import BN from 'bn.js';
import React, {FC} from 'react';
import {FormSection} from '../pages/exchange/exchange';
import {Asset} from '../typings';
import {FormErrors} from './../pages/exchange/validation';
import TxSummary, {TxSummaryProps} from './AdvancedSetting';
import ErrorBox from './Error/ErrorBox';

type SummaryOrErrorProps = {
    formErrors: FormErrors;
    summaryProps: TxSummaryProps;
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
        coreAssetId,
        extrinsic,
    } = summaryProps;

    if (formErrors.has(FormSection.form)) {
        return (
            <>
                <ErrorBox center={true} errors={formErrors.get(FormSection.form)} />
                <TxSummary
                    // @ts-ignore
                    extrinsic={extrinsic}
                    feeAssetId={feeAssetId}
                    coreAssetId={coreAssetId}
                    txFee={txFee}
                    toAssetAmount={toAssetAmount}
                    toAsset={toAsset}
                    fromAssetAmount={fromAssetAmount}
                    fromAsset={fromAsset}
                    buffer={buffer as number}
                    onAssetChange={onAssetChange}
                    onBufferChange={onBufferChange}
                    assets={assets}
                />
            </>
        );
    } else if (formErrors.size > 0) {
        return <ErrorBox center={true}></ErrorBox>;
    } else {
        if (txFee) {
            return (
                <TxSummary
                    // @ts-ignore
                    extrinsic={extrinsic}
                    feeAssetId={feeAssetId}
                    coreAsset={coreAssetId}
                    txFee={txFee}
                    toAssetAmount={toAssetAmount}
                    toAsset={toAsset}
                    fromAssetAmount={fromAssetAmount}
                    fromAsset={fromAsset}
                    buffer={buffer as number}
                    onAssetChange={onAssetChange}
                    onBufferChange={onBufferChange}
                    assets={assets}
                />
            );
        } else return <> </>;
    }
};

export default SummaryOrError;
