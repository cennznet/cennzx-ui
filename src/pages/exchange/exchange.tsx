import {FeeRate} from '@cennznet/types';
import BN from 'bn.js';
import {Button} from 'centrality-react-core';
import AccountPicker from 'components/AccountPicker';
import AdvancedSetting from 'components/AdvancedSetting';
import AssetInputForAdd from 'components/AssetInputForAdd';
import ErrorMessage from 'components/Error/ErrorMessage';
import ExchangeIcon from 'components/ExchangeIcon';
import Nav from 'components/Nav';
import Page from 'components/Page';
import PageInside from 'components/PageInside';
import React, {FC, useEffect, useState} from 'react';
import styled from 'styled-components';
import {BaseError, EmptyPool, FormErrorTypes} from '../../error/error';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {ExchangeState} from '../../redux/reducers/ui/exchange.reducer';
import {AmountParams, Asset, ExchangeFormData, IFee, IOption, LiquidityFormData} from '../../typings';
import {Amount} from '../../util/Amount';
import {Flex2, getDecimalPlaces} from '../liquidity/liquidity';
import getFormErrors from './validation';
const SWAP_OUTPUT = 'buyAsset';
const SWAP_INPUT = 'sellAsset';

const Line = styled.div`
    border-bottom: 1px solid rgba(17, 48, 255, 0.3);
    height: 1px;
    margin-top: 20px;
    margin-bottom: 20px;
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
    toAssetBalance: Amount;
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
    const {
        accounts,
        assets,
        fromAssetBalance,
        toAssetBalance,
        error,
        outputReserve,
        txFee,
        coreAssetId,
        assetInfo,
    } = props;
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

    // pre populate the asset drop down
    useEffect((): void => {
        if (assets.length) {
            props.handleBuyAssetIdChange(assets[0].id, props.form as ExchangeFormData, props.error);
            props.handleWithAssetIdChange(assets[1].id, props.form as ExchangeFormData, props.error);
        }
    }, [assets]);

    const assetForEmptyPool = error.find(err => err instanceof EmptyPool);
    const formErrors = state.touched ? getFormErrors(props) : new Map<FormSection, FormErrorTypes[]>();
    let maxBuy;
    if (outputReserve && toAssetBalance) {
        // Take minimum of user and pool balance for max Buy amount.
        maxBuy = new Amount(BN.min(new BN(outputReserve), new BN(toAssetBalance)));
    } else if (outputReserve) {
        // when no user is selected use 0 as max..
        maxBuy = new Amount(0);
    }

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
                        message={signingAccount ? `Public Address: ${signingAccount}` : ''}
                    />
                    <Flex2>
                        <ErrorMessage errors={formErrors} field={FormSection.account} />
                    </Flex2>
                    <Line />
                    <AssetInputForAdd
                        disableAmount={!!assetForEmptyPool}
                        max={maxBuy}
                        value={{amount: toAssetAmount, assetId: toAsset}}
                        decimalPlaces={getDecimalPlaces(toAsset, assetInfo)}
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
                        errorBox={<ErrorMessage errors={formErrors} field={FormSection.toAssetInput} />}
                    />
                    <div>
                        <ExchangeIcon
                            onClick={() => {
                                props.handleSwap();
                                setState({touched: state.touched, assetDialogOpen: state.assetDialogOpen});
                            }}
                        />
                    </div>

                    <AssetInputForAdd
                        disableAmount={!!assetForEmptyPool}
                        max={fromAssetBalance}
                        value={{amount: fromAssetAmount, assetId: fromAsset}}
                        decimalPlaces={getDecimalPlaces(fromAsset, assetInfo)}
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
                        errorBox={<ErrorMessage errors={formErrors} field={FormSection.fromAssetInput} />}
                    />
                </PageInside>
                <PageInside>
                    <SectionColumn>
                        <Bottom id="bottom">
                            <FullWidthContainer>
                                <Buttons id="buttons">
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
            </form>
        </Page>
    );
};
