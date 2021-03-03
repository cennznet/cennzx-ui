import AssetDropDown from 'components/AssetDropDown';
import ErrorBox from 'components/Error/ErrorBox';
import PageInside from 'components/PageInside';
import TextInput from 'components/TextInput';
import {TxSummaryProps} from 'components/TxSummary/TxSummary';
import TxSummaryEstimatedTxFeeForBody from 'components/TxSummary/TxSummaryEstimatedTxFeeForBody';
import {Asset} from '../../typings';
import {Amount} from '../../util/Amount';
import {DECIMALS, FormSection} from '../../pages/exchange/exchange';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FormErrors} from './../../pages/exchange/validation';
import {getAsset} from '../../util/assets';
import {SummaryBuy} from './SummaryBuy';
import SummaryFee from './SummaryFee';
import React, {FC, useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 5%;
    background: #f8f9f9;
    margin-top: 20px;
    padding: 5px 5%;
`;
const SummaryBody = styled.div`
    margin: 20px 0;
    color: #7f878d;
    font-size: 14px;
`;

const Inside = styled.div`
    padding: 25px 0;
`;

const Title = styled.div`
    cursor: pointer;
    svg {
        margin-left: 6px;
        vertical-align: middle;
    }
`;

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
    justify-content: space-between;
    min-width: 224px;
`;

interface FontAwesomeIconProps {
    spinner: string;
}
const ArrowIcon = styled(FontAwesomeIcon)<FontAwesomeIconProps>`
    height: 16px;
    width: 16px;
    color: rgba(17, 48, 255, 0.3);
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
    transform: ${props => (props.spinner === 'true' ? 'rotate(180deg) ' : 'rotate(0deg)')};
    -webkit-transform: ${props => (props.spinner === 'true' ? 'rotate(180deg) ' : 'rotate(0deg)')};
    transition-duration: 0.2s;
    transition-property: transform;
    :hover {
        color: #1130ff;
    }
`;
const Em = styled.span`
    color: #1130ff;
    font-weight: 300;
`;

const P = styled.p`
    color: #7f878d;
    font-size: 14px;
`;

type SummaryOrErrorProps = {
    formErrors: FormErrors;
    summaryProps?: TxSummaryProps;
    onAssetChange: (assetId: number) => void;
    onBufferChange: (buffer: number) => void;
    assets: Asset[];
    show: boolean;
    title: string;
    selectTitle: string;
    recipientAddress?: string;
    spinner: boolean;
    buffer: number;
    selectOptions: Asset[];
    selectValue: number;
};

const AdvancedSetting: FC<SummaryOrErrorProps> = ({
    formErrors,
    summaryProps,
    onAssetChange,
    assets,
    onBufferChange,
    show,
    title,
    recipientAddress,
    selectTitle,
    spinner,
    selectOptions,
    selectValue,
}) => {
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
    const [state, setState] = useState({spinner});
    return (
        <Container>
            <PageInside>
                {show && (
                    <Inside>
                        <Title
                            onClick={() => {
                                setState({spinner: !state.spinner});
                            }}
                        >
                            {title}
                            <ArrowIcon spinner={state.spinner.toString()} icon={faChevronDown as any} />
                        </Title>
                        {state.spinner && (
                            <>
                                <TextInput
                                    title={'Slippage'}
                                    placeholder={'Maximum slippage percent'}
                                    value={buffer}
                                    onChange={e => {
                                        onBufferChange(Number(e.target.value));
                                    }}
                                    multiple={'%'}
                                />
                                <P>
                                    <SummaryBuy
                                        fromAsset={fromAsset}
                                        toAsset={toAsset}
                                        fromAssetAmount={fromAssetAmount}
                                        toAssetAmount={toAssetAmount}
                                        buffer={buffer}
                                        method={extrinsic}
                                        recipientAddress={recipientAddress}
                                    />
                                </P>
                                {/* <Top>
                                    <span>
                                        <h2>{selectTitle}</h2>
                                    </span>
                                </Top>
                                <AssetDropDown
                                    isSearchable={false}
                                    value={selectValue}
                                    options={selectOptions}
                                    onChange={(asset: Asset) => {
                                        onAssetChange(asset.id);
                                    }}
                                    showBorder={true}
                                /> */}
                                <SummaryBody>
                                    <SummaryFee txFee={txFee} coreAsset={coreAsset} feeAssetId={feeAssetId} />
                                </SummaryBody>
                            </>
                        )}
                    </Inside>
                )}
            </PageInside>
            {formErrors.has(FormSection.form) && (
                <>
                    <ErrorBox center={true} errors={formErrors.get(FormSection.form)} />
                </>
            )}
            {formErrors.size > 0 && <ErrorBox center={true}>Enter all values to continue</ErrorBox>}
        </Container>
    );
};

export default AdvancedSetting;
