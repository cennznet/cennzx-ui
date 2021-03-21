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
    max-height: 1rem;
    display: block;
    margin-bottom: 2rem;

    .select {
        max-width: calc(100% - 2.5rem);
        height: calc(100% - 2.5rem);
        left: 2.5rem;
        top: -2.5rem;
    }
`;

const AccountPicker: FC<AccountPickerProps> = ({title, selected, options, onChange, message}) => (
    <div>
        <span>
            {' '}
            <h2>{title}</h2>
        </span>
        <AccountWrapper className="test">
            <Identicon value={selected} size={32} theme={'beachball'} />
            <DropDown
                className="select"
                value={getOptionByValue(options, selected)}
                options={options}
                onChange={picked => onChange(picked)}
                help={getOptionByValue(options, selected)}
            />
        </AccountWrapper>
        <MessageBox>{message}</MessageBox>
    </div>
);

export default AccountPicker;
