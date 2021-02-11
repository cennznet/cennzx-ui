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
import {SendDispatchProps, SendProps} from '../send/send';
import {Button} from 'centrality-react-core';
import keyring from '@polkadot/ui-keyring';
import {isHex, isObject, u8aToString, hexToU8a} from '@polkadot/util';
import {
    cryptoWaitReady,
    randomAsHex,
    keyExtractSuri,
    mnemonicGenerate,
    mnemonicValidate,
    randomAsU8a,
} from '@polkadot/util-crypto';
import {createType} from '@polkadot/types';
import {defaults as addressDefaults} from '@polkadot/util-crypto/address/defaults';
import {TypeRegistry} from '@cennznet/types';
// import uiSettings from '@polkadot/ui-settings';
import CreateModal from 'components/Dialog/CreateAccount';
// import ImportModal from './modals/Import';

import {SendFormData} from '../../typings';
// import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

interface Props {
    genesisHash: any;
    // address: string;
    // className?: string;
    // isFavorite: boolean;
    // toggleFavorite: (address: string) => void;
}

export const Account: FC<Props & SendDispatchProps> = props => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const {genesisHash} = props;
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    // const [seed, setSeed] = useState(mnemonicGenerate());

    // const seed = 'anc';
    const DEFAULT_PAIR_TYPE = 'sr25519';
    const seedType = 'bip';
    // const seed = newSeed(_seed, seedType);
    // const address =  keyring
    //     .createFromUri(`${seed.trim()}`, {}, DEFAULT_PAIR_TYPE)
    //     .address;
    // console.log('Address:', address);
    // const registry = new TypeRegistry();
    // const DEFAULT_SS58 = createType(registry, 'u32', addressDefaults.prefix);
    // console.log('********************* DEFAULT_SS58::', DEFAULT_SS58);
    // const _enterPassword = (password):
    const _toggleCreate = (): void => {
        //setIsCreateOpen(!isCreateOpen);
        // keyring.loadAll();
        // const ss58Format = uiSettings.prefix === -1
        //     ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
        //     : uiSettings.prefix;
        cryptoWaitReady().then(() => {
            const seed = mnemonicGenerate();
            const result = keyring.addUri(seed, password, {name: name});
            const address = result.json.address;
            alert(`${address} is created:`);
            const addresses = keyring.getAccounts();
        });
    };
    const onFileChange = (element): void => {
        const fileReader = new FileReader();
        fileReader.readAsText(element.target.files[0], 'UTF-8');
        fileReader.onload = e => {
            const json = JSON.parse(e.target.result);
            const publicKey = keyring.decodeAddress(json.address, true);
            const address = keyring.encodeAddress(publicKey);
            const isFileValid =
                publicKey.length === 32 &&
                json.encoded &&
                isObject(json.meta) &&
                (Array.isArray(json.encoding.content)
                    ? json.encoding.content[0] === 'pkcs8'
                    : json.encoding.content === 'pkcs8');
            setSelectedFile(json);
        };
    };

    const onFileUpload = (): void => {
        try {
            const pair = keyring.restoreAccount(selectedFile, password);
            const {address} = pair;
            // @ts-ignore
            console.log('Restored address:', address);
        } catch (e) {
            console.log(e);
        }
    };

    const changeName = (element): void => {
        const name = element.currentTarget.value;
        setName(name);
    };

    const changePassword = (element): void => {
        const pass = element.currentTarget.value;
        setPassword(pass);
    };
    return (
        <Page id={'page'}>
            <form>
                <PageInside>
                    <Nav active="exchange" />

                    <table>
                        <tbody>
                            <tr /*className={className}*/>
                                <td className="favorite">
                                    Name: <input type={'text'} onChange={changeName} />
                                    Password: <input type={'password'} onChange={changePassword} />
                                    <Buttons id="buttons">
                                        <Button flat primary onClick={_toggleCreate}>
                                            Create account
                                        </Button>
                                    </Buttons>
                                    <div>
                                        <h1>Import accounts</h1>
                                        <h4>
                                            Select the JSON key file that was downloaded when you created the account.
                                            This JSON file contains your private key encrypted with your password.
                                        </h4>
                                        <div>
                                            <input type="file" onChange={onFileChange} />
                                            Password: <input type={'password'} onChange={changePassword} />
                                            <Button onClick={onFileUpload}>Import account</Button>
                                        </div>
                                    </div>
                                </td>
                                <td className="middle"></td>
                                <td className="middle"></td>
                                <td className="number middle"></td>
                            </tr>
                        </tbody>
                    </table>
                </PageInside>
            </form>
        </Page>
    );
};

// export default styled(Account)`
//   .accounts--Account-buttons {
//     text-align: right;
//   }
//
//   .tags--toggle {
//     cursor: pointer;
//     width: 100%;
//     min-height: 1.5rem;
//
//     label {
//       cursor: pointer;
//     }
//   }
//
//   .name--input {
//     width: 16rem;
//   }
// `;
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
