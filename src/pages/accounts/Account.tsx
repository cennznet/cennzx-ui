// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {DeriveAccountInfo} from '@polkadot/api-derive/types';
// import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, {useState, useEffect, FC} from 'react';
import styled from 'styled-components';
import PageInside from 'components/PageInside';
import Nav from 'components/Nav';
import Page from 'components/Page';
import {SendDispatchProps} from '../send/send';
import {Button} from 'centrality-react-core';
import keyring from '@polkadot/ui-keyring';
import {Icon} from 'semantic-ui-react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from '@fortawesome/free-solid-svg-icons';
import CreateAccountDialog from 'components/Dialog/CreateAccount';
import ImportAccountDialog from 'components/Dialog/ImportAccount';
import BackUpAccountDialog from 'components/Dialog/BackupAccount';

interface Props {
    genesisHash: any;
}

export const Account: FC<Props & SendDispatchProps> = props => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isBackUpOpen, setIsBackUpOpen] = useState(false);
    const [address, setAddress] = useState('');
    const addresses = keyring.getAccounts();
    const accountlist = addresses.map(value => {
        const name = value.meta.name ? value.meta.name : value.address;
        const address = value.address;
        return {
            name,
            address,
        };
    });

    const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);

    const _toggleImport = (): void => setIsImportOpen(!isImportOpen);

    const _toggleBackUp = (): void => setIsBackUpOpen(!isBackUpOpen);

    const downloadAccount = (element): void => {
        setAddress(element.currentTarget.value);
        setIsBackUpOpen(true);
    };

    const iconBefore = <Icon name={'plus'} />;

    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="accounts" />

                    <CreateAccountDialog accountCreation={isCreateOpen} _toggleCreate={_toggleCreate} />
                    <ImportAccountDialog accountImport={isImportOpen} _toggleImport={_toggleImport} />
                    <BackUpAccountDialog address={address} accountBackUp={isBackUpOpen} _toggleBackUp={_toggleBackUp} />
                    <table style={{width: '100%'}}>
                        <tbody>
                            <tr>
                                <td className="favorite">
                                    <Button iconBefore={iconBefore} onClick={_toggleCreate}>
                                        Create account
                                    </Button>
                                </td>
                                <td>
                                    <Button onClick={_toggleImport}>Import account</Button>
                                </td>
                            </tr>
                            <tr>
                                <AccountTable>
                                    <tbody>
                                        {accountlist.map(
                                            ({name, address}): React.ReactNode => (
                                                <tr key={address.toString()}>
                                                    <td className="address">{name}</td>
                                                    <td className="address">
                                                        <Button value={address} onClick={downloadAccount}>
                                                            <FontAwesomeIcon icon={faDownload} size="1x" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </AccountTable>
                            </tr>
                        </tbody>
                    </table>
                </PageInside>
            </form>
        </Page>
    );
};

const AccountTable = styled.table`
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    
    thead tr {
        background-color: #009879;
        color: #ffffff;
        text-align: left;
    }
    
    td {
        padding: 12px 15px;
    }
    
    tbody tr {
        border-bottom: 1px solid #dddddd;
    }

    tbody tr:nth-of-type(even) {
        background-color: #f3f3f3;
    }
    
    
}
    
`;

const Line = styled.div`
    border-bottom: 1px solid rgba(17, 48, 255, 0.3);
    height: 1px;
    margin-top: 20px;
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
