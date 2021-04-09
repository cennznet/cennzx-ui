import {FeeRate} from '@cennznet/types/interfaces/cennzx';
import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import BN from 'bn.js';
import {Button} from 'centrality-react-core';
import AccountPicker from 'components/AccountPicker';
import AdvancedSetting from 'components/AdvancedSetting';
import AssetInputForAdd from 'components/AssetInputForAdd';
import ErrorMessage from 'components/Error/ErrorMessageForLiquidity';
import ExchangeIconClass from 'components/ExchangeIcon';
import Nav from 'components/Nav';
import Page from 'components/Page';
import PageInside from 'components/PageInside';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import {add, values} from 'ramda';
import React, {FC, useEffect, useState} from 'react';
import ReactSlider from 'react-slider';
import {Icon} from 'semantic-ui-react';
import styled from 'styled-components';
import liquidity from '.';
import {BaseError, EmptyPool, FormErrorTypes} from '../../error/error';
import {AssetDetails} from '../../redux/reducers/global.reducer';
import {ExchangeState} from '../../redux/reducers/ui/exchange.reducer';
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

const AddIcon = styled.span`
    color: #1130ff;
    font-size: 20px;
    font-weight: 700;
    margin-top: auto;
    margin-right: 2px;
    margin-left: 2px;
    margin-bottom: auto;
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

const Flex = styled.div`
    align-items: center;
    display: inline-flex;
`;

export const Flex2 = styled.div`
    padding: 0.3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 1rem;
`;

const FullWidthContainer = styled.div`
    width: 100%;
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

const SectionColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
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
    line-height: 21px;
    color: #7f878d;
    background: #f8f9f9;
    padding: 20px;
`;
export interface FontAwesomeIconProps {
    // can't pass in boolean, it complains, so use string as boolean
    spinner: string;
}
const SliderContainer = styled.div<FontAwesomeIconProps>`
    margin: 20px 0 50px;
    position: relative;
    z-index: 0;
    > div {
        height: 2px;
        background: ${props => (props.spinner === 'true' ? '#1130ff' : '#7f878d')};
    }
    .example-mark {
        position: absolute;
        background: ${props => (props.spinner === 'true' ? '#1130ff' : '#7f878d')};
        top: -3px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        cursor: pointer;
    }
    .point {
        width: 10px;
        height: 10px;
        border-radius: 7px;
        border: 2px solid ${props => (props.spinner === 'true' ? '#1130ff' : '#7f878d')};
        background: #fff;
        cursor: pointer;
        position: absolute;
        top: -5px;
    }
    .tooltip {
        margin-top: 15px;
        margin-left: -20px;
        background: #ffffff;
        width: 50px;
        border: 1px solid ${props => (props.spinner === 'true' ? '#1130ff' : '#7f878d')};
        border-radius: 3px;
        color: ${props => (props.spinner === 'true' ? '#1130ff' : '#7f878d')};
        padding: 5px 0;
        text-align: center;
    }
`;

const SwapIcon = styled(FontAwesomeIcon)`
    font-size: 16px;
`;

const ESTIMATED_LABEL = '(estimated)';

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
    ADD = 'add',
    REMOVE = 'remove',
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

const selectOption = [
    {
        label: 'Add liquidity',
        value: LiquidityAction.ADD,
    },
    {
        label: 'Withdraw liquidity',
        value: LiquidityAction.REMOVE,
    },
];

function poolSummary(
    assetPool: string,
    corePool: string,
    userAssetShareInPool,
    assetName,
    userCoreShareInPool,
    coreName,
    exchangeRateMsg: string,
    fee,
    action
) {
    return (
        <>
            <div>
                {action === LiquidityAction.ADD
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
            {assetPool && corePool ? (
                <Summary>
                    Pool Balance (Yours): {userAssetShareInPool} {assetName} + {userCoreShareInPool} {coreName}
                    <br />
                    Pool Balance (Total): {assetPool} {assetName} + {corePool} {coreName}
                    <br />
                    {exchangeRateMsg}
                    <br />
                    {fee && `Transaction fee (estimated) : ${fee}`}
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

export const Liquidity: FC<LiquidityProps & LiquidityDispatchProps> = props => {
    const {
        accounts,
        accountAssetBalance,
        accountCoreBalance,
        assets,
        assetReserve,
        coreAssetId,
        coreReserve,
        error,
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
    const assetPool = assetReserve && assetReserve.asString && assetReserve.asString(assetInfo[assetId].decimalPlaces);

    const coreBalance = getBalance(accountCoreBalance, assetInfo, coreAssetId);

    const coreName = getAssetName(assets, coreAssetId);
    const corePool = coreReserve && coreReserve.asString && coreReserve.asString(assetInfo[coreAssetId].decimalPlaces);

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
                        message=""
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
                        <Label>
                            {state.liquidityAction === LiquidityAction.REMOVE ? 'Withdraw liquidity' : 'Add liquidity'}
                        </Label>
                    </Flex>
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
                            errorBox={<ErrorMessage errors={formErrors} field={FormSection.assetInput} />}
                        />
                        <AddIcon></AddIcon>
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
                            errorBox={<ErrorMessage errors={formErrors} field={FormSection.coreInput} />}
                        />
                    </Flex2>
                    {/* {state.liquidityAction === LiquidityAction.REMOVE && coreAssetId && assetId && (
                        <SliderContainer spinner={state.slider.toString()}>
                            <ReactSlider
                                className="horizontal-slider"
                                marks={[0, 25, 50, 75, 101]}
                                markClassName="example-mark"
                                min={0}
                                max={100}
                                thumbClassName="example-thumb"
                                trackClassName="example-track"
                                onChange={value => {
                                    const percent = value / 100;

                                    let value1 = +assetPool * percent;
                                    value1 = Math.round(value1 * 10000) / 10000 + '';

                                    let value2 = Number(coreReserve.asString(DECIMALS)) * percent;
                                    value2 = Math.round(value2 * 10000) / 10000 + '';
                                    const setNewAmount1 = setNewAmount(value1, assetAmount, assetId);
                                    const setNewAmount2 = setNewAmount(value2, coreAmount, coreAssetId);
                                    props.handleAssetAmountChange(setNewAmount1.amount);
                                    props.handleCoreAmountChange(setNewAmount2.amount);

                                    setState({
                                        ...state,
                                        slider: true,
                                        sliderP: percent,
                                    });
                                }}
                                renderThumb={(props, state) => (
                                    <div {...props} className="point">
                                        <div className="tooltip">{state.valueNow}%</div>
                                    </div>
                                )}
                            />
                        </SliderContainer>
                    )} */}
                    {poolSummary(
                        assetPool,
                        corePool,
                        userAssetShareInPool.asString(),
                        assetName,
                        userCoreShareInPool.asString(),
                        coreName,
                        exchangeRateMsg,
                        fee,
                        state.liquidityAction
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
                        {state.liquidityAction === LiquidityAction.ADD ? 'Add' : 'Withdraw'}
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
