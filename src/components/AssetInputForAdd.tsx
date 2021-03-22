import TransparentButton from 'components/TransparentButton';
import React, {FC} from 'react';
import styled from 'styled-components';
import {AmountParams, Asset} from '../typings';
import {Amount} from '../util/Amount';
import AmountBox from './AmountBox';
import AssetDropDown from './AssetDropDown';
import FlexDiv from './FlexDiv';
import MessageBox from './MessageBox';

const Trade = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    h2 {
        font-size: 16px;
        font-weight: 600;
        color: #4e5458;
    }
`;

const MaxButton = styled(TransparentButton)`
    margin-top: auto;
    margin-bottom: auto;
    border: 1px solid white;
    margin-right: 0.5em;
    height: 1.5rem;
    max-width: 3rem;

    :hover {
        color: blue;
        background-color: white;
        border: 1px solid blue;
    }
`;

const InputAndSelect = styled(FlexDiv)`
    height: 48px;
    background-color: transparent;
    border: 1px solid #b5babd;
    border-radius: 3px;
    font-size: 14px;

    :hover {
        border: 1px solid #1130ff;
        border-radius: 3px;
    }
`;
interface AssetInputProps {
    value: AmountParams;
    options: Asset[];
    onChange: (newVal: AmountParams) => void;
    title: string;
    message: string;
    errorBox?: JSX.Element;
    max?: Amount;
    secondaryTitle?: string;
    disableAmount?: boolean;
}

const Top = styled.div`
    justify-content: space-between;
`;

const getAmountParams = (amount: Amount, assetId: number, amountChange: boolean): AmountParams => ({
    amount,
    assetId,
    amountChange,
});

const AssetInputForAdd: FC<AssetInputProps> = ({
    max,
    value,
    options,
    onChange,
    title,
    message,
    errorBox,
    secondaryTitle,
    disableAmount,
}) => {
    const {assetId, amount} = value;

    return (
        <Trade>
            <Top>
                <span>
                    <h2>
                        {title} {secondaryTitle && secondaryTitle}
                    </h2>
                </span>
            </Top>
            <InputAndSelect id="trade">
                <AmountBox
                    readOnly={disableAmount}
                    value={amount}
                    onChange={value => onChange(getAmountParams(value, assetId, true))}
                />
                <MaxButton onClick={() => onChange(getAmountParams(max || new Amount(0), assetId, true))}>
                    Max
                </MaxButton>
                <AssetDropDown
                    isSearchable={false}
                    value={assetId}
                    options={options}
                    onChange={(asset: Asset) => onChange(getAmountParams(amount, asset.id, false))}
                    showBorder={false}
                />
            </InputAndSelect>
            <MessageBox>{message}</MessageBox>
            {errorBox}
        </Trade>
    );
};

export default AssetInputForAdd;
