import Identicon from '@polkadot/react-identicon';
import DropDown from 'components/DropDown';
import React, {FC} from 'react';
import styled from 'styled-components';
import {IOption} from '../typings';
import {getOptionByValue} from '../util/component';
import MessageBox from './../components/MessageBox';

interface AccountPickerProps {
    title: string;
    selected: string;
    options: IOption[];
    onChange: Function;
    message: string;
}

const AccountWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;

    .select {
        margin-left: 16px;
        width: calc(100% - 16px);
        .react-select__value-container--has-value {
            margin-left: 10px;
        }
        /* select behind identicon */
        z-index: -1;
    }

    .identicon {
        position: relative;
        height: 0;
        top: 8px;
    }

    .message {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const AccountPicker: FC<AccountPickerProps> = ({title, selected, options, onChange, message}) => (
    <div>
        <span>
            {' '}
            <h2>{title}</h2>
        </span>
        <AccountWrapper className="accountWrapper">
            <Identicon value={selected} size={32} theme={'beachball'} className="identicon" />
            <DropDown
                className="select"
                value={getOptionByValue(options, selected)}
                options={options}
                onChange={picked => onChange(picked)}
                help={getOptionByValue(options, selected)}
            />
            <MessageBox className="message">{message}</MessageBox>
        </AccountWrapper>
    </div>
);

export default AccountPicker;
