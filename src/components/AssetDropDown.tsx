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
    flex: 1 0 30%;
    max-width: calc(32px + 2em);

    > div {
        border-width: ${props => (props.showBorder.toString() === 'true' ? '1px' : '0px')};
    }

    .react-select__indicators {
        padding: 0px;
        display: none;
    }

    // add border to left of select 
    .react-select__value-container {
        border-left: ${props => (props.showInterval.toString() === 'true' ? '1px solid #b5babd;' : 'none')}; !important;
        min-height: 32px;

        span {
            display: none;
        }
    }

    // drop down indicator hover color
    .react-select__dropdown-indicator > svg:hover {
        color: #1130ff !important;
    }

    // remove padding from select option, this padding is added back to the container
    .react-select__option {
        padding: 2px;
        background-color: white;
        border-radius: 4px;
        cursor: pointer;
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
        position: absolute;
        top: 0;
        right: 0;
    }
`;

const Icon = styled.img`
    margin-top: auto;
    margin-bottom: auto;
    min-height: 32px;
    min-width: 32px;
    max-height: 32px;
    max-width: 32px;
`;

const Text = styled.span`
    margin-left: 0.4rem;
`;

const Container = styled.div`
    color: #4e5458;
    padding: 4px 0px 4px 3px;
    align-items: center;
    min-width: 6rem;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    :hover {
        color: #1130ff;
    }
    border: none !important;
`;

const getLabel = ({symbol}) => {
    try {
        return (
            <Container>
                <Icon src={require(`./../images/${symbol.toLowerCase()}.svg`)} />
                <Text className="symbol">{symbol}</Text>
            </Container>
        );
    } catch (e) {
        // when a new asset is added and image does not exist
        return (
            <Container>
                <Icon src={require(`./../images/logoMissing.png`)} />
                <Text className="symbol">{symbol}</Text>
            </Container>
        );
    }
};

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
