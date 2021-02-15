import {Link} from '@reach/router';
import React, {FC, useState} from 'react';
import Dialog, {DialogProps} from './Dialog';
import {BlueButton} from './DialogButtons';
import TextInput from 'components/TextInput';
import styled from 'styled-components';
import {Button} from 'centrality-react-core';
import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';
import FileSaver from 'file-saver';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';

const getDialogTitle = () => {
    return 'Backup account';
};

const getDialogBody = (address: string, _toggleBackUp) => {
    const [password, setPassword] = useState('');

    return (
        <React.Fragment>
            <h3>{address}</h3>
            <p>
                {
                    'An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.'
                }
            </p>
            <p>
                {
                    'Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.'
                }
            </p>
            <Top>
                <span>
                    <h4>{'Password'}</h4>
                </span>
            </Top>
            <Input>
                <input
                    type={'password'}
                    onChange={element => {
                        const pass = element.currentTarget.value;
                        setPassword(pass);
                    }}
                />
            </Input>
            <Button
                style={{marginTop: '25px'}}
                disabled={password === ''}
                onClick={() => {
                    cryptoWaitReady().then(() => {
                        const addressKeyring = address && keyring.getPair(address);
                        let json;
                        if (addressKeyring.isLocked) {
                            try {
                                json = addressKeyring && keyring.backupAccount(addressKeyring, password);
                                const blob = new Blob([JSON.stringify(json)], {
                                    type: 'application/json; charset=utf-8',
                                });
                                FileSaver.saveAs(blob, `${address}.json`);
                                _toggleBackUp();
                            } catch (e) {
                                alert(e.message);
                            }
                        } else {
                            alert('Test account');
                            _toggleBackUp();
                        }
                    });
                }}
            >
                <FontAwesomeIcon icon={faDownload} size="1x" />
            </Button>
        </React.Fragment>
    );
};

const getDialogFooter = _toggleBackUp => (
    <>
        <BlueButton onClick={() => _toggleBackUp()}>Close</BlueButton>
    </>
);

// extend the props excluding handled ones and including extra ones
export type BackUpDialogProps = Pick<
    DialogProps,
    Exclude<keyof DialogProps, 'title' | 'body' | 'footer' | 'isOpen'>
> & {
    accountBackUp: boolean;
    address: string;
    _toggleBackUp: Function;
};

const BackUpAccountDialog: FC<BackUpDialogProps> = props => {
    const {address, accountBackUp, _toggleBackUp} = props;
    const isOpen = accountBackUp;

    return (
        <Dialog
            {...props}
            isOpen={isOpen}
            title={getDialogTitle()}
            body={getDialogBody(address, _toggleBackUp)}
            footer={getDialogFooter(_toggleBackUp)}
        />
    );
};

export default BackUpAccountDialog;

const Top = styled.div`
    display: flex;
    flex-direction: row;
    margintop: 20px;
    justify-content: space-between;
    min-width: 224px;
`;

const Input = styled.div`
    display: flex;
    height: 48px;
    line-height: 48px;
    width: calc(100% - 2rem);
    background-color: #fff;
    border: 1px solid #b5babd;
    border-radius: 3px;
    font-size: 14px;
    :hover {
        border: 1px solid #1130ff;
        border-radius: 3px;
    }
    input {
        border: 0;
        flex: 1;
        padding: 0 1rem;
    }
`;
