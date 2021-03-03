import {Select} from 'centrality-react-core';
import {SelectProps} from 'centrality-react-core/components/Select';
import React, {FC} from 'react';
import styled from 'styled-components';
import {Asset} from '../typings';

type AssetDropDownStyledProps = SelectProps<any> & {
    showBorder: boolean;
    showInterval: boolean;
};

const StyledSelect = styled(Select)<AssetDropDownStyledProps>`
    flex: 1;
    min-width: calc(32px + 4rem);
    transition: min-width 0.3s ease 0.1s;

    > div {
        border-width: ${props => (props.showBorder.toString() === 'true' ? '1px' : '0px')};
    }

    // remove border from right of select 
    .react-select__indicators > span {
        background: ${props => (props.showBorder.toString() === 'true' ? '#b5babd' : 'none')}; !important;
    }

    // add border to left of select 
    .react-select__value-container {
        border-left: ${props => (props.showInterval.toString() === 'true' ? '1px solid #b5babd;' : 'none')}; !important;
        min-height: 32px;
    }

    // drop down indicator hover color
    .react-select__dropdown-indicator > svg:hover {
        color: #1130ff !important;
    }

    // remove padding from select option, this padding is added back to the container
    .react-select__option {
        padding: 0px;
        background-color: white;
    }

    .react-select__option--is-selected:hover,
    .react-select__option--is-focused:hover {
        // background hover/active color
        background-color: #1130ff;

        // color of text on hover/active
        span {
            color: #ffffff !important;
        }
    }

    // remove padding around the entire menu
    .react-select__menu-list {
        padding-top: 0px;
        padding-bottom: 0px;
    }

    // expand on hover, contract on exit
    :hover {
        cursor: pointer;
        min-width: calc(32px + 7.1rem);
    }
`;

const Icon = styled.img`
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 0.5em;
    max-height: 32px;
    max-width: 32px;
`;

const Text = styled.span`
    font-size: 14px;
`;

const Container = styled.div`
    color: #4e5458;
    padding: 8px 12px;
    align-items: center;
    display: flex;
    :hover {
        color: #1130ff;
    }
    border: none !important;
    border-bottom: 1px solid #b5babd !important;
`;

const getLabel = ({symbol}) => (
    <Container>
        <Icon src={require(`./../images/${symbol.toLowerCase()}.png`)} />
        <Text>{symbol}</Text>
    </Container>
);

const getOptionByValue = (options: Asset[], assetId: number) =>
    options ? options.find(item => item.id === assetId) || null : null;

export type AssetDropDownProps = Pick<SelectProps<Asset>, Exclude<keyof SelectProps<Asset>, 'value'>> & {
    options: Asset[];
    value: number;
    showBorder: boolean;
    showInterval?: boolean;
};

const AssetDropDown: FC<AssetDropDownProps> = props => (
    <StyledSelect
        {...props}
        value={getOptionByValue(props.options, props.value)}
        getOptionLabel={getLabel}
        showBorder={props.showBorder}
        showInterval={props.showInterval === true ? false : !props.showBorder}
    />
);

export default AssetDropDown;
