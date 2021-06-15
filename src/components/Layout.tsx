import {version as extVersion} from '@polkadot/extension-dapp/package-info.json';
import {InjectedExtension, MetadataDef} from '@polkadot/extension-inject/types';
import React, {FC} from 'react';
import {connect} from 'react-redux';
import {Routes} from 'react-static';
import styled from 'styled-components';
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
    polkadotExtension: InjectedExtension;
    metadata: MetadataDef;
}

const Layout: FC<LayoutProps> = ({extensionDetected, extensionConnected, polkadotExtension, metadata}) => {
    let metaUpdated = null;
    if (typeof localStorage !== 'undefined') {
        const chain = metadata ? metadata.chain : '';
        metaUpdated = localStorage.getItem(`${extVersion}-${chain}-EXTENSION_META_UPDATED`);
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
                        polkadotExtension={polkadotExtension}
                        metadata={metadata}
                    />
                ) : null}
                <React.Suspense fallback={<em>Loading...</em>}>
                    <Routes path="*" />
                </React.Suspense>
            </Content>
        </React.Fragment>
    );
};

export default connect((state: any) => ({
    extensionConnected: state.extension.extensionConnected,
    extensionDetected: state.extension.extensionDetected,
    polkadotExtension: state.extension.polkadotExtension,
    metadata: state.global.metadata,
}))(Layout);
