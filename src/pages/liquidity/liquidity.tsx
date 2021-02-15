import {FeeRate} from '@cennznet/types/runtime/cennzX';
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

export const DECIMALS = 5;
const SWAP_OUTPUT = 'buyAsset';
const SWAP_INPUT = 'sellAsset';

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
    display: flex;
    flex-direction: row;
    > div {
        flex: 1;
    }
    > div:nth-child(2) {
        flex: 0;
    }
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
    add1Amount = 'add1Amount',
    add2Amount = 'add2Amount',
}

export enum LiquidityType {
    ADD = 'add',
    REMOVE = 'remove',
}

export type ExchangeDispatchProps = {
    handleAdd1AmountChange(amount: Amount): void;
    handleAdd2AmountChange(amount: Amount): void;
    handleAdd1IdChange(assetId: number, form: LiquidityFormData, error: BaseError[]): void;
    handleAdd2IdChange(assetId: number): void;
    handleSelectedAccountChange(account: string): void;
    handleBuyAssetAmountChange(amount: Amount): void;
    handleWithAssetAmountChange(amount: Amount): void;
    handlePayTransactionFeeAssetIdChange(assetId: number, form: LiquidityFormData, error: BaseError[]): void;
    handleAddLiquidityChange(assetId: number, form: LiquidityFormData, error: BaseError[]): void;
    handleFeeAssetChange(assetId: number): void;
    handleFeeBufferChange(feeBuffer: number): void;
    handleSwap(): void;
    handleReset(): void;
    handleExtrinsicChange(type: string): void;
    handleLiquidityType(type: string): void;
    openTxDialog(form: LiquidityFormData, estimatedFee: IFee): void;
};

export type LiquidityProps = {
    accounts: IOption[];
    /**
     * user's balance of fromAsset
     * TODO: merge this with userAssetBalance
     */
    add1AssetBalance: Amount;
    assets: Asset[];
    // TODO: merge this with exchangePool
    add1Reserve: Amount;
    coreAssetBalance: Amount;
    exchangeRateMsg?: string;
    txFeeMsg: string;
    coreAsset: BN;
    fee: any;
    feeRate: FeeRate;
    coreAssetUserBalance: Amount;
} & LiquidityState;

const getAssetName = (options, id) => {
    if (!id) return null;
    const name = options.find(i => i.id === id);
    return name && name.symbol;
};

const selectOption = [
    {
        label: 'Add liquidity',
        value: 'addLiquidity',
    },
    {
        label: 'Remove liquidity',
        value: 'removeLiquidity',
    },
];

export const Liquidity: FC<LiquidityProps & ExchangeDispatchProps> = props => {
    const {
        accounts,
        assets,
        add1AssetBalance,
        error,
        add1Reserve,
        coreAssetBalance,
        txFee,
        fee,
        coreAsset,
        exchangeRateMsg,
        coreAssetUserBalance,
    } = props;
    const {
        signingAccount,
        toAssetAmount,
        toAsset,
        extrinsic,
        fromAsset,
        type,
        fromAssetAmount,
        add1Amount,
        add2Amount,
        add1Asset,
        add2Asset,
        feeAssetId,
        buffer,
    } = props.form;
    const initState = {
        touched: false,
        assetDialogOpen: false,
        address: '',
        buffer: 1,
        transactionAssetId: null,
        liquidityType: selectOption[0].value,
        slider: true,
        sliderP: 0,
    };
    const [state, setState] = useState(initState);
    useEffect((): void => {
        if (!type) {
            props.handleLiquidityType(initState.liquidityType);
            props.handleAdd2IdChange(Number(coreAsset));
            props.handleExtrinsicChange(selectOption[0].value);
        }
    }, []);

    const assetForEmptyPool = error.find(err => err instanceof EmptyPool);
    const formErrors = state.touched ? getFormErrors(props) : new Map<FormSection, FormErrorTypes[]>();
    // let fee;
    // if (coreAsset && coreAsset.eqn) {
    //     const assetSymbol = getAsset(feeAssetId).symbol;
    //     if (coreAsset.eqn(feeAssetId) && txFee) {
    //         fee = txFee.feeInCpay.asString(DECIMALS);
    //     } else if (txFee && txFee.feeInFeeAsset) {
    //         fee = txFee.feeInFeeAsset.asString(DECIMALS);
    //     }
    // }
    const asset1Name = getAssetName(assets, add1Asset);
    const asset2Name = getAssetName(assets, add2Asset);
    const pool1 = add1Reserve && add1Reserve.asString && add1Reserve.asString(DECIMALS);
    const pool2 = coreAssetBalance && coreAssetBalance.asString && coreAssetBalance.asString(DECIMALS);
    const coreBalance = coreAssetUserBalance && coreAssetUserBalance.asString(DECIMALS);
    const add1Balance = add1AssetBalance && add1AssetBalance.asString(DECIMALS);
    const addresses = keyring.getAccounts();
    const accountlist = addresses.map(value => {
        const name = value.meta.name ? value.meta.name : value.address;
        const address = value.address;
        const labelValue = `${name}: ${address}`;
        return {
            label: labelValue,
            value: address,
        };
    });

    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="liquidity" />
                    <AccountPicker
                        title="Choose account"
                        selected={signingAccount}
                        options={accountlist}
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
                        value={state.liquidityType}
                        options={selectOption}
                        onChange={(value: string) => {
                            props.handleExtrinsicChange(value);
                            setState({
                                ...state,
                                liquidityType: value,
                            });
                        }}
                    />
                    {state.liquidityType === 'add' ? (
                        <div>
                            <Label>Deposit amount</Label>
                            {asset2Name && (
                                <LabelDetail>
                                    To keep the liquidity pool functional, we require you to deposit a equal value of
                                    the token and {asset2Name} in the pool.
                                </LabelDetail>
                            )}
                        </div>
                    ) : (
                        <div>
                            <Label>Withdraw amount</Label>
                            {asset2Name && (
                                <LabelDetail>
                                    To keep the liquidity pool functional, we require you to withdraw a equal value of
                                    the token you choose and {asset2Name} from the pool.
                                </LabelDetail>
                            )}
                        </div>
                    )}
                    <Flex>
                        <div>
                            <AssetInputForAdd
                                disableAmount={!!assetForEmptyPool}
                                max={add1Reserve}
                                value={{amount: add1Amount, assetId: add1Asset}}
                                options={assets}
                                onChange={(amountParams: AmountParams) => {
                                    if (amountParams.amountChange) {
                                        props.handleAdd1AmountChange(amountParams.amount);
                                    } else {
                                        props.handleAdd1IdChange(
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
                                    state.liquidityType === selectOption[0].value
                                        ? `Balance: ${add1Balance}`
                                        : `Balance: ${pool1}`
                                }
                            />
                        </div>
                        <div>
                            <AddIcon>+</AddIcon>
                        </div>
                        <div>
                            <AssetInputForAdd
                                disableAmount={!!assetForEmptyPool}
                                max={coreAssetBalance}
                                value={{amount: add2Amount, assetId: Number(coreAsset)}}
                                options={assets.filter(i => i.id === Number(coreAsset))}
                                onChange={amountParams => {
                                    if (amountParams.amountChange) {
                                        props.handleAdd2AmountChange(amountParams.amount);
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
                                    state.liquidityType === selectOption[0].value
                                        ? `Balance: ${coreBalance}`
                                        : `Balance: ${pool2}`
                                }
                            />
                        </div>
                    </Flex>
                    {state.liquidityType === selectOption[1].value && add2Asset && add1Asset && (
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
                                    let value1 = +pool1 * percent;
                                    value1 = Math.round(value1 * 10000) / 10000 + '';
                                    let value2 = Number(coreAssetBalance.asString(DECIMALS)) * percent;
                                    value2 = Math.round(value2 * 10000) / 10000 + '';
                                    const setNewAmount1 = setNewAmount(value1, add1Amount, add1Asset);
                                    const setNewAmount2 = setNewAmount(value2, add2Amount, add2Asset);
                                    props.handleAdd1AmountChange(setNewAmount1.amount);
                                    props.handleAdd2AmountChange(setNewAmount2.amount);
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
                    {pool1 &&
                        pool2 &&
                        (state.liquidityType === selectOption[0].value ? (
                            <Summary>
                                Your pool share ({buffer}%): {pool1} {asset1Name} + {pool2} {asset2Name}
                                <br />
                                {add1Amount &&
                                    add2Amount &&
                                    `Current pool size: ${add1Amount.asString(
                                        DECIMALS
                                    )} ${asset1Name} + ${add2Amount.asString(DECIMALS)} ${asset2Name}`}
                                <br />
                                {exchangeRateMsg}
                                <br />
                                {fee && `Transaction fee (estimated) : ${fee}`}
                            </Summary>
                        ) : (
                            <Summary>
                                Current pool size: {pool1} {asset1Name} + {pool2} {asset2Name}
                                <br />
                                {add1Amount &&
                                    add2Amount &&
                                    `Your pool share (${state.sliderP * 100}%): ${add1Amount.asString(
                                        DECIMALS
                                    )} ${asset1Name} + ${add2Amount.asString(DECIMALS)} ${asset2Name}`}
                                <br />
                                {exchangeRateMsg}
                                <br />
                                {fee && `Transaction fee (estimated) : ${fee}`}
                            </Summary>
                        ))}
                </PageInside>
                <AdvancedSetting
                    show={!!(add1Asset && add2Asset)}
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
                        coreAsset,
                        txFee,
                        toAssetAmount: add1Amount,
                        toAsset: add1Asset,
                        fromAssetAmount: add2Amount,
                        fromAsset: add2Asset,
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
                                        {state.liquidityType === selectOption[0].value
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
