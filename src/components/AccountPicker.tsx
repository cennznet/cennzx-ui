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

const AccountPicker: FC<AccountPickerProps> = ({title, selected, options, onChange, message}) => (
    <div>
        <span>
            {' '}
            <h2>{title}</h2>
        </span>
        <DropDown value={getOptionByValue(options, selected)} options={options} onChange={picked => onChange(picked)} />
        <MessageBox> {message}</MessageBox>
    </div>
);

export default AccountPicker;
