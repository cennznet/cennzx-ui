import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Button} from 'centrality-react-core';
import AccountPicker from 'components/AccountPicker';
import AdvancedSetting from 'components/AdvancedSetting';
import AssetInputForAdd from 'components/AssetInputForAdd';
import ErrorMessage from 'components/Error/ErrorMessageForLiquidity';
import Nav from 'components/Nav';
import Page from 'components/Page';
import PageInside from 'components/PageInside';
import React, {FC, useEffect, useState} from 'react';
import styled from 'styled-components';
import {BaseError, FormErrorTypes} from '../../error/error';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {LiquidityState} from '../../redux/reducers/ui/liquidity.reducer';
import {AmountParams, Asset, IFee, IOption, IUserShareInPool, LiquidityFormData} from '../../typings';
import {Amount} from '../../util/Amount';
import getFormErrors from './validation';

const Line = styled.div`
    border-bottom: 1px solid rgba(17, 48, 255, 0.3);
    height: 1px;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const Flex = styled.div`
    align-items: center;
    display: inline-flex;
`;

export const Flex2 = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    justify-content: center;

    button {
        width: 7em;
        border: 2px solid #1130ff;
        color: #1130ff;
        border-radius: 3px;

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

const SwapButton = styled(Button)`
    background-color: white;
    color: #f7941d;
    border: 1px solid #f7941d;
    border-radius: 5px;
    margin-right: 0.5rem;

    :hover {
        color: white;
        background-color: #f7941d;
        border: 1px solid #f7941d;
    }
`;

const Label = styled.div`
    color: #4e5458;
    font-weight: 600;
    font-size: 16px;
`;
const LabelDetail = styled.p`
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
    color: #7f878d;
`;
const Summary = styled.p`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #7f878d;
    background: #f8f9f9;
    text-align: left;
    padding: 1em 0 1em 2em;
    margin-top: 2em;
`;
export interface FontAwesomeIconProps {
    // can't pass in boolean, it complains, so use string as boolean
    spinner: string;
}

const SwapIcon = styled(FontAwesomeIcon)`
    font-size: 16px;
`;

export enum FormSection {
    account = 'account',
    assetAmount = 'assetAmount',
    assetInput = 'assetInput',
    coreInput = 'coreInput',
    coreAmount = 'coreAmount',
    form = 'generalError',
}

// The liquidity action to take
export enum LiquidityAction {
    ADD = 'Add',
    REMOVE = 'Withdraw',
}

export type LiquidityDispatchProps = {
    handleAssetAmountChange(amount: Amount): void;
    handleCoreAmountChange(amount: Amount): void;
    handleAssetIdChange(assetId: number, form: LiquidityFormData, error: BaseError[]): void;
    handleSelectedAccountChange(account: string): void;
    handleFeeBufferChange(feeBuffer: number): void;
    handleReset(): void;
    handleExtrinsicChange(type: string): void;
    handleLiquidityAction(type: LiquidityAction): void;
    openTxDialog(form: LiquidityFormData, estimatedFee: IFee, assetInfo: AssetDetails[]): void;
};

export type LiquidityProps = {
    accounts: IOption[];
    // the registered onchain assets
    assets: Asset[];
    // balance of selected asset in the exchange
    assetReserve: Amount;
    // balance of core asset in the exchange
    coreReserve: Amount;
    // current account's balance of the selected asset
    accountAssetBalance: Amount;
    // current account's balance of the core asset
    accountCoreBalance: Amount;
    exchangeRateMsg?: string;
    txFeeMsg: string;
    coreAssetId: number;
    fee: any;
    feeRate: FeeRate;
    userShareInPool: IUserShareInPool;
    assetInfo: AssetDetails[];
} & LiquidityState;

const getAssetName = (options, id) => {
    if (!id) return null;
    const name = options.find(i => i.id === id);
    return name && name.symbol;
};

function poolSummary(
    assetPool: string,
    corePool: string,
    userAssetShareInPool,
    assetName,
    userCoreShareInPool,
    coreName,
    exchangeRateMsg: string,
    fee
) {
    return (
        <>
            {assetPool && corePool ? (
                <Summary>
                    Your balance: {userAssetShareInPool} {assetName} + {userCoreShareInPool} {coreName}
                    <br />
                    Pool balance: {assetPool} {assetName} + {corePool} {coreName}
                    <br />
                    {exchangeRateMsg}
                    {fee && (
                        <>
                            <br />
                            {`Transaction fee (estimated) : ${fee}`}
                        </>
                    )}
                </Summary>
            ) : null}
        </>
    );
}

function getBalance(accountAssetBalance: Amount, assetInfo: AssetDetails[], assetId: number) {
    return (
        accountAssetBalance && assetInfo.length > 0 && accountAssetBalance.asString(assetInfo[assetId].decimalPlaces)
    );
}

function getFormattedPoolBalance(assetReserve: Amount, assetInfo: AssetDetails[], assetId: number) {
    return assetReserve && assetInfo.length > 0 && assetId && assetReserve.asString(assetInfo[assetId].decimalPlaces);
}

export const Liquidity: FC<LiquidityProps & LiquidityDispatchProps> = props => {
    const {
        accounts,
        accountAssetBalance,
        accountCoreBalance,
        assets,
        assetReserve,
        coreAssetId,
        coreReserve,
        exchangeRateMsg,
        fee,
        txFee,
        userShareInPool,
        assetInfo,
    } = props;

    const {assetId, assetAmount, buffer, coreAmount, extrinsic, feeAssetId, signingAccount, type} = props.form;

    // local component state
    const initState = {
        touched: false,
        assetDialogOpen: false,
        address: '',
        buffer: 0.05,
        transactionAssetId: null,
        liquidityAction: LiquidityAction.ADD,
        slider: true,
        sliderP: 0,
    };

    const [state, setState] = useState(initState);
    useEffect((): void => {
        if (!type) {
            props.handleLiquidityAction(initState.liquidityAction);
            props.handleExtrinsicChange(initState.liquidityAction);
        }
    }, []);

    // pre populate the asset drop down
    useEffect((): void => {
        if (assets.length) {
            props.handleAssetIdChange(assets[0].id, props.form as LiquidityFormData, props.error);
        }
    }, [assets]);

    const assetBalance = getBalance(accountAssetBalance, assetInfo, assetId);
    const assetName = getAssetName(assets, assetId);
    const assetPool = getFormattedPoolBalance(assetReserve, assetInfo, assetId);

    const coreBalance = getBalance(accountCoreBalance, assetInfo, coreAssetId);

    const coreName = getAssetName(assets, coreAssetId);
    const corePool = getFormattedPoolBalance(coreReserve, assetInfo, coreAssetId);

    const [userAssetShareInPool, userCoreShareInPool] = userShareInPool
        ? [userShareInPool.assetBalance, userShareInPool.coreAssetBalance]
        : [new Amount(0), new Amount(0)];

    const formErrors =
        state.touched || !signingAccount || !assetAmount || !coreAmount
            ? getFormErrors(props)
            : new Map<FormSection, FormErrorTypes[]>();

    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="liquidity" />
                    <AccountPicker
                        title="Choose account"
                        selected={signingAccount}
                        options={accounts}
                        onChange={(picked: {label: string; value: string}) => {
                            props.handleSelectedAccountChange(picked.value);
                            setState({
                                ...state,
                                touched: true,
                                assetDialogOpen: state.assetDialogOpen,
                            });
                        }}
                        message={`Public Address: ${signingAccount}`}
                    />
                    <Flex2>
                        <ErrorMessage errors={formErrors} field={FormSection.account} />
                    </Flex2>
                    <Line />
                    <Flex>
                        <SwapButton
                            onClick={() => {
                                // just flip the action
                                const action =
                                    state.liquidityAction === LiquidityAction.REMOVE
                                        ? LiquidityAction.ADD
                                        : LiquidityAction.REMOVE;
                                props.handleExtrinsicChange(action);
                                setState({
                                    ...state,
                                    liquidityAction: action,
                                });
                            }}
                        >
                            <SwapIcon icon={faExchangeAlt} />
                        </SwapButton>
                        <Label>{`${state.liquidityAction} liquidity`}</Label>
                    </Flex>
                    <div>
                        {state.liquidityAction === LiquidityAction.ADD
                            ? coreName && (
                                  <LabelDetail>
                                      To keep the liquidity pool functional, deposits require an equal value of{' '}
                                      {assetName || ' your token'} and {coreName} at the current exchange rate.
                                  </LabelDetail>
                              )
                            : coreName && (
                                  <LabelDetail>
                                      To keep the liquidity pool functional, withdrawals will return an equal value of{' '}
                                      {assetName || ' your token'} and {coreName} at the current exchange rate.
                                  </LabelDetail>
                              )}
                    </div>
                    <Flex2>
                        <AssetInputForAdd
                            max={
                                state.liquidityAction === LiquidityAction.REMOVE
                                    ? userAssetShareInPool
                                    : accountAssetBalance
                            }
                            value={{amount: assetAmount, assetId}}
                            options={assets.filter(a => a.id !== coreAssetId)}
                            onChange={(amountParams: AmountParams) => {
                                if (amountParams.amountChange) {
                                    props.handleAssetAmountChange(amountParams.amount);
                                } else {
                                    props.handleAssetIdChange(
                                        amountParams.assetId,
                                        props.form as LiquidityFormData,
                                        props.error
                                    );
                                }
                                setState({
                                    ...state,
                                    touched: true,
                                    slider: !amountParams.amountChange,
                                    assetDialogOpen: state.assetDialogOpen,
                                });
                            }}
                            title=""
                            secondaryTitle={null}
                            message={
                                state.liquidityAction === LiquidityAction.REMOVE
                                    ? `Withdrawable: ${userAssetShareInPool.asString()}`
                                    : `Balance: ${assetBalance || 0}`
                            }
                            errorBox={<ErrorMessage errors={formErrors} field={FormSection.assetAmount} />}
                        />
                        <AssetInputForAdd
                            max={
                                state.liquidityAction === LiquidityAction.REMOVE
                                    ? userCoreShareInPool
                                    : accountCoreBalance
                            }
                            value={{amount: coreAmount, assetId: coreAssetId}}
                            options={assets.filter(a => a.id === coreAssetId)}
                            onChange={amountParams => {
                                if (amountParams.amountChange) {
                                    props.handleCoreAmountChange(amountParams.amount);
                                    setState({
                                        ...state,
                                        touched: true,
                                        slider: false,
                                        assetDialogOpen: state.assetDialogOpen,
                                    });
                                }
                            }}
                            title=""
                            secondaryTitle={null}
                            message={
                                state.liquidityAction === LiquidityAction.REMOVE
                                    ? `Withdrawable: ${userCoreShareInPool.asString()}`
                                    : `Balance: ${coreBalance || 0}`
                            }
                            errorBox={<ErrorMessage errors={formErrors} field={FormSection.coreAmount} />}
                        />
                    </Flex2>
                    {poolSummary(
                        assetPool,
                        corePool,
                        userAssetShareInPool.asString(),
                        assetName,
                        userCoreShareInPool.asString(),
                        coreName,
                        exchangeRateMsg,
                        fee
                    )}
                </PageInside>
                <Buttons id="buttons">
                    <Button
                        flat
                        primary
                        disabled={formErrors.size > 0 || !signingAccount}
                        onClick={() =>
                            props.openTxDialog(props.form as LiquidityFormData, props.txFee, props.assetInfo)
                        }
                    >
                        state.liquidityAction
                    </Button>
                </Buttons>
                <AdvancedSetting
                    show={!!(assetId && coreAssetId)}
                    assets={assets}
                    onBufferChange={(buffer: number) => {
                        props.handleFeeBufferChange(buffer);
                    }}
                    formErrors={formErrors}
                    summaryProps={{
                        extrinsic,
                        feeAssetId: coreAssetId,
                        coreAssetId,
                        txFee,
                        toAssetAmount: assetAmount,
                        toAsset: assetId,
                        fromAssetAmount: coreAmount,
                        fromAsset: coreAssetId,
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
