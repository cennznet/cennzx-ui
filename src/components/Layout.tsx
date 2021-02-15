import React, {FC} from 'react';
import {connect} from 'react-redux';
import {Routes} from 'react-static';
import styled from 'styled-components';
// import AppDialog from './Dialog/AppDialog';
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
}

const Layout: FC<LayoutProps> = ({extensionDetected, extensionConnected}) => (
    <React.Fragment>
        <Header />
        <Content id="content">
            <TxDialog />
            {/*Comment the extension pop up for now, we might want to re-introduce this after we support polkadot extension*/}
            {/*<AppDialog extensionConnected={extensionConnected} extensionDetected={extensionDetected} />*/}
            <React.Suspense fallback={<em>Loading...</em>}>
                <Routes path="*" />
            </React.Suspense>
        </Content>
    </React.Fragment>
);

export default connect((state: any) => ({
    extensionConnected: state.extension.extensionConnected,
    extensionDetected: state.extension.extensionDetected,
}))(Layout);
