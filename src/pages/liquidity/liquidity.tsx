import {FeeRate} from '@cennznet/types/runtime/interfaces/cennzx';
import BN from 'bn.js';
import {Button} from 'centrality-react-core';
import AccountPicker from 'components/AccountPicker';
import AssetInputForAdd from 'components/AssetInputForAdd';
import Nav from 'components/Nav';
import Page from 'components/Page';
import PageInside from 'components/PageInside';
import ErrorMessage from 'components/Error/ErrorMessageForLiquidity';
import React, {FC, useState, useEffect} from 'react';
import styled from 'styled-components';
import {BaseError, EmptyPool, FormErrorTypes} from '../../error/error';
import {ExchangeState} from '../../redux/reducers/ui/exchange.reducer';
import {LiquidityState} from '../../redux/reducers/ui/liquidity.reducer';
import {AmountParams, Asset, LiquidityFormData, IFee, IOption} from '../../typings';
import ReactSlider from 'react-slider';
import {Amount} from '../../util/Amount';
import getFormErrors from './validation';
import Select from 'components/Select';
import TextInput from 'components/TextInput';
import AdvancedSetting from 'components/AdvancedSetting';
import {getAsset} from '../../util/assets';
import {setNewAmount} from '../../util/newAmount';
import keyring from '@polkadot/ui-keyring';
import liquidity from '.';

export const DECIMALS = 4;

const Line = styled.div`
    border-bottom: 1px solid rgba(17, 48, 255, 0.3);
    height: 1px;
    margin-top: 20px;
`;
const AddIcon = styled.span`
    display: inline-block;
    color: #1130ff;
    font-size: 20px;
    font-weight: 700;
    margin: 46px 10px;
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
    display: box;
`;

const FullWidthContainer = styled.div`
    width: 100%;
`;

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
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

const Label = styled.div`
    color: #4e5458;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin: 20px 0 0;
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

const ESTIMATED_LABEL = '(estimated)';

export enum FormSection {
    account = 'account',
    assetAmount = 'assetAmount',
    assetInput = 'assetInput',
    coreAmount = 'coreAmount',
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
    handleCoreIdChange(assetId: number): void;
    handleSelectedAccountChange(account: string): void;
    handleFeeBufferChange(feeBuffer: number): void;
    handleReset(): void;
    handleExtrinsicChange(type: string): void;
    handleLiquidityAction(type: LiquidityAction): void;
    openTxDialog(form: LiquidityFormData, estimatedFee: IFee): void;
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
        label: 'Remove liquidity',
        value: LiquidityAction.REMOVE,
    },
];

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

    const addresses = keyring.getAccounts();
    const accountList = addresses.map(value => {
        const name = value.meta.name ? value.meta.name : value.address;
        const address = value.address;
        const labelValue = `${name}: ${address}`;
        return {
            label: labelValue,
            value: address,
        };
    });

    const [state, setState] = useState(initState);
    useEffect((): void => {
        if (!type) {
            props.handleSelectedAccountChange(accountList[0].value);
            props.handleLiquidityAction(initState.liquidityAction);
            props.handleCoreIdChange(coreAssetId);
            props.handleExtrinsicChange(initState.liquidityAction);
        }
    }, []);

    const assetBalance = accountAssetBalance && accountAssetBalance.asString(DECIMALS);
    const assetName = getAssetName(assets, assetId);
    const assetPool = assetReserve && assetReserve.asString && assetReserve.asString(DECIMALS);

    const coreBalance = accountCoreBalance && accountCoreBalance.asString(DECIMALS);
    const coreName = getAssetName(assets, coreAssetId);
    const corePool = coreReserve && coreReserve.asString && coreReserve.asString(DECIMALS);

    const formErrors = state.touched ? getFormErrors(props) : new Map<FormSection, FormErrorTypes[]>();

    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="liquidity" />
                    <AccountPicker
                        title="Choose account"
                        selected={signingAccount}
                        options={accountList}
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
                    <ErrorMessage errors={formErrors} field={FormSection.account} />

                    <Line />
                    <Select
                        value={state.liquidityAction}
                        options={selectOption}
                        onChange={(action: LiquidityAction) => {
                            props.handleExtrinsicChange(action);
                            setState({
                                ...state,
                                liquidityAction: action,
                            });
                        }}
                    />
                    {state.liquidityAction === LiquidityAction.ADD ? (
                        <div>
                            <Label>Deposit amount</Label>
                            {coreName && (
                                <LabelDetail>
                                    To keep the liquidity pool functional, deposit requires an equal value of{' '}
                                    {assetName || ' your token'} and {coreName} at the current exchange rate.
                                </LabelDetail>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Label>Withdraw amount</Label>
                            {coreName && (
                                <LabelDetail>
                                    To keep the liquidity pool functional, withdraw returns an equal value of{' '}
                                    {assetName || ' your token'} and {coreName} at the current exchange rate.
                                </LabelDetail>
                            )}
                        </div>
                    )}
                    <Flex>
                        <AssetInputForAdd
                            max={accountAssetBalance}
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
                            message={assetBalance ? `Balance: ${assetBalance}` : ''}
                        />
                        <ErrorMessage errors={formErrors} field={FormSection.assetInput} />
                        <div>
                            <AddIcon>+</AddIcon>
                        </div>
                        <AssetInputForAdd
                            max={accountCoreBalance}
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
                            message={coreBalance ? `Balance: ${coreBalance}` : ''}
                        />
                    </Flex>
                    {state.liquidityAction === LiquidityAction.REMOVE && coreAssetId && assetId && (
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
                    )}
                    {assetPool &&
                        corePool &&
                        (state.liquidityAction === LiquidityAction.ADD ? (
                            <Summary>
                                Your pool share: {assetPool} {assetName} + {corePool} {coreName}
                                <br />
                                `Current pool size: ${assetPool} ${assetName} + ${corePool} ${coreName}`
                                <br />
                                {exchangeRateMsg}
                                <br />
                                {fee && `Transaction fee (estimated) : ${fee}`}
                            </Summary>
                        ) : (
                            <Summary>
                                {assetAmount &&
                                    coreAmount &&
                                    `Your pool share (${state.sliderP * 100}%): ${assetAmount.asString(
                                        DECIMALS
                                    )} ${assetName} + ${coreAmount.asString(DECIMALS)} ${coreName}`}
                                <br />
                                Current pool size: {assetPool} {assetName} + {corePool} {coreName}
                                <br />
                                {exchangeRateMsg}
                                <br />
                                {fee && `Transaction fee (estimated) : ${fee}`}
                            </Summary>
                        ))}
                </PageInside>
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
                                                ...state,
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
                                        // disabled={formErrors.size > 0 || !txFee}
                                        onClick={() => props.openTxDialog(props.form as LiquidityFormData, props.txFee)}
                                    >
                                        {state.liquidityAction === LiquidityAction.ADD
                                            ? 'Add liquidity'
                                            : 'Remove liquidity'}
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
