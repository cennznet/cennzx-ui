import {packageInfo} from '@polkadot/extension-dapp/packageInfo';
import {InjectedExtension, MetadataDef} from '@polkadot/extension-inject/types';
import React, {FC} from 'react';
import {connect} from 'react-redux';
import {Routes} from 'react-static';
import styled from 'styled-components';
import Exchange from '../pages/exchange';
import AppDialog from './Dialog/AppDialog';
import TxDialog from './Dialog/TxDialog';
import Header from './Header';

const Content = styled.div`
     {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: center;
        font-family: 'Open Sans', sans-serif;

        h2 {
            color: #4e5458;
            font-size: 16px;
            font-weight: 600;
        }
    }
`;

interface LayoutProps {
    extensionDetected: boolean;
    extensionConnected: boolean;
    cennznetExtension: InjectedExtension;
    metadata: MetadataDef;
}

const Layout: FC<LayoutProps> = ({extensionDetected, extensionConnected, cennznetExtension, metadata}) => {
    let metaUpdated: null | string = null;
    if (typeof localStorage !== 'undefined') {
        const chain = metadata ? metadata.chain : '';
        const specVersion = metadata ? metadata.specVersion : '';
        metaUpdated = localStorage.getItem(`${packageInfo.version}-${chain}${specVersion}-EXTENSION_META_UPDATED`);
    }
    // tslint:disable-next-line:no-console
    return (
        <React.Fragment>
            <Header />
            <Content id="content">
                <TxDialog />
                {/* If metadata is not updated, or extension is disconnected or denied access to this app, open pop up*/}
                {metaUpdated === null || extensionConnected === false || extensionDetected === false ? (
                    <AppDialog
                        extensionConnected={extensionConnected}
                        extensionDetected={extensionDetected}
                        cennznetExtension={cennznetExtension}
                        metadata={metadata}
                    />
                ) : null}
                <React.Suspense fallback={<em>Loading...</em>}>
                    {/*<Routes path="*" />*/}
                    <Exchange />
                </React.Suspense>
            </Content>
        </React.Fragment>
    );
};

export default connect((state: any) => ({
    extensionConnected: state.extension.extensionConnected,
    extensionDetected: state.extension.extensionDetected,
    cennznetExtension: state.extension.cennznetExtension,
    metadata: state.global.metadata,
}))(Layout);
