import {FeeRate} from '@cennznet/types';
import BN from 'bn.js';
import {Button} from 'centrality-react-core';
import AccountPicker from 'components/AccountPicker';
import AdvancedSetting from 'components/AdvancedSetting';
import AssetDropDown from 'components/AssetDropDown';
import AssetInput from 'components/AssetInput';
import ErrorMessage from 'components/Error/ErrorMessage';
import ExchangeIcon from 'components/ExchangeIcon';
import Nav from 'components/Nav';
import Page from 'components/Page';
import PageInside from 'components/PageInside';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import {propSatisfies} from 'ramda';
import React, {FC, useEffect, useState} from 'react';
import styled from 'styled-components';
import {BaseError, EmptyPool, FormErrorTypes} from '../../error/error';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {ExchangeState} from '../../redux/reducers/ui/exchange.reducer';
import {AmountParams, Asset, ExchangeFormData, IFee, IOption} from '../../typings';
import {Amount} from '../../util/Amount';
import getFormErrors from './validation';
const SWAP_OUTPUT = 'buyAsset';
const SWAP_INPUT = 'sellAsset';

const Line = styled.div`
    border-bottom: 1px solid rgba(17, 48, 255, 0.3);
    height: 1px;
    margin-top: 20px;
`;

const Bottom = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;

    h3 {
        font-size: 14px;
        text-align: center;
        color: #4e5458;
    }
`;

const FullWidthContainer = styled.div`
    width: 100%;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: center;
    min-width: 224px;

    button {
        border: 2px solid #1130ff;
        color: #1130ff;
        border-radius: 3px;
        margin-right: 4px;

        :disabled {
            background-color: #ebeced;
            color: #b5babd;
            border-radius: 3px;
            border: 2px solid #ebeced;
        }

        :hover {
            border: 2px solid #1130ff;
            background-color: #1130ff;
            color: #ffffff;
            border-radius: 3px;
        }

        :hover:disabled {
            background-color: #ebeced;
            color: #b5babd;
            border-radius: 3px;
            border: 2px solid #ebeced;
        }
    }
`;

const SectionColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

const ESTIMATED_LABEL = '(estimated)';

export enum FormSection {
    account = 'account',
    toAssetInput = 'toAssetInput',
    fromAssetInput = 'fromAssetInput',
    form = 'generalError',
    recipientAddress = 'recipientAddress',
}

export type ExchangeDispatchProps = {
    handleBuyAssetAmountChange(amount: Amount): void;
    handleWithAssetAmountChange(amount: Amount): void;
    handleBuyAssetIdChange(assetId: number, form: ExchangeFormData, error: BaseError[]): void;
    handleWithAssetIdChange(assetId: number, form: ExchangeFormData, error: BaseError[]): void;
    handleFeeAssetChange(assetId: number): void;
    handleSelectedAccountChange(account: string): void;
    handleFeeBufferChange(feeBuffer: number): void;
    handleSwap(): void;
    handleReset(): void;
    openTxDialog(form: ExchangeFormData, estimatedFee: IFee): void;
};

export type ExchangeProps = {
    accounts: IOption[];
    /**
     * user's balance of fromAsset
     * TODO: merge this with userAssetBalance
     */
    fromAssetBalance: Amount;
    assets: Asset[];
    // TODO: merge this with exchangePool
    outputReserve: Amount;
    exchangeRateMsg: string;
    txFeeMsg: string;
    coreAssetId: number;
    feeRate: FeeRate;
    assetInfo: AssetDetails[];
} & ExchangeState;

export const Exchange: FC<ExchangeProps & ExchangeDispatchProps> = props => {
    const [state, setState] = useState({touched: false, assetDialogOpen: false});
    const {accounts, assets, fromAssetBalance, error, outputReserve, txFee, coreAssetId, assetInfo} = props;
    const {
        toAsset,
        toAssetAmount,
        signingAccount,
        extrinsic,
        fromAsset,
        fromAssetAmount,
        feeAssetId,
        buffer,
    } = props.form;
    const assetForEmptyPool = error.find(err => err instanceof EmptyPool);
    const formErrors = state.touched ? getFormErrors(props) : new Map<FormSection, FormErrorTypes[]>();

    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="exchange" />
                    <AccountPicker
                        title="Choose account"
                        selected={signingAccount}
                        options={accounts}
                        onChange={(picked: {label: string; value: string}) => {
                            props.handleSelectedAccountChange(picked.value);
                            setState({touched: true, assetDialogOpen: state.assetDialogOpen});
                        }}
                        message=""
                    />
                    <ErrorMessage errors={formErrors} field={FormSection.account} />
                    <Line />
                    <AssetInput
                        disableAmount={!!assetForEmptyPool}
                        max={outputReserve}
                        value={{amount: toAssetAmount, assetId: toAsset}}
                        options={assets}
                        onChange={(amountParams: AmountParams) => {
                            if (amountParams.amountChange) {
                                props.handleBuyAssetAmountChange(amountParams.amount);
                            } else {
                                props.handleBuyAssetIdChange(
                                    amountParams.assetId,
                                    props.form as ExchangeFormData,
                                    props.error
                                );
                            }
                            setState({touched: true, assetDialogOpen: state.assetDialogOpen});
                        }}
                        title="Buy"
                        secondaryTitle={extrinsic === SWAP_INPUT ? ESTIMATED_LABEL : null}
                        message={props.exchangeRateMsg}
                    />
                    <ErrorMessage errors={formErrors} field={FormSection.toAssetInput} />

                    <ExchangeIcon
                        onClick={() => {
                            props.handleSwap();
                            setState({touched: state.touched, assetDialogOpen: state.assetDialogOpen});
                        }}
                    />

                    <AssetInput
                        disableAmount={!!assetForEmptyPool}
                        max={fromAssetBalance}
                        value={{amount: fromAssetAmount, assetId: fromAsset}}
                        options={assets}
                        onChange={amountParams => {
                            if (amountParams.amountChange) {
                                props.handleWithAssetAmountChange(amountParams.amount);
                            } else {
                                props.handleWithAssetIdChange(
                                    amountParams.assetId,
                                    props.form as ExchangeFormData,
                                    props.error
                                );
                            }
                            setState({touched: true, assetDialogOpen: state.assetDialogOpen});
                        }}
                        title="With"
                        secondaryTitle={extrinsic === SWAP_OUTPUT ? ESTIMATED_LABEL : null}
                        message={
                            fromAssetBalance
                                ? `Balance: ${fromAssetBalance.asString(assetInfo[fromAsset].decimalPlaces)}`
                                : ''
                        }
                    />
                    <ErrorMessage errors={formErrors} field={FormSection.fromAssetInput} />
                </PageInside>
                <AdvancedSetting
                    show={!!(toAsset && fromAsset)}
                    assets={assets}
                    onAssetChange={(assetId: number) => {
                        props.handleFeeAssetChange(assetId);
                    }}
                    onBufferChange={(buffer: number) => {
                        props.handleFeeBufferChange(buffer);
                    }}
                    formErrors={formErrors}
                    summaryProps={{
                        extrinsic,
                        feeAssetId,
                        coreAssetId,
                        txFee,
                        toAssetAmount,
                        toAsset,
                        fromAssetAmount,
                        fromAsset,
                        buffer,
                    }}
                    title={'Advanced settings'}
                    selectTitle={'Pay transaction fee with'}
                    spinner={false}
                    buffer={buffer}
                    selectOptions={assets}
                    selectValue={feeAssetId}
                    assetInfo={assetInfo}
                />
                <PageInside>
                    <SectionColumn>
                        <Bottom id="bottom">
                            <FullWidthContainer>
                                <Buttons id="buttons">
                                    <Button
                                        flat
                                        primary
                                        onClick={() => {
                                            props.handleReset();
                                            setState({
                                                touched: false,
                                                assetDialogOpen: state.assetDialogOpen,
                                            });
                                        }}
                                    >
                                        Clear From
                                    </Button>
                                    <Button
                                        flat
                                        primary
                                        disabled={formErrors.size > 0 || !txFee}
                                        onClick={() => props.openTxDialog(props.form as ExchangeFormData, props.txFee)}
                                    >
                                        Exchange
                                    </Button>
                                </Buttons>
                            </FullWidthContainer>
                        </Bottom>
                    </SectionColumn>
                </PageInside>
            </form>
        </Page>
    );
};
