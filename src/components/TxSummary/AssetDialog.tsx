import AssetDropDown from 'components/AssetDropDown';
import TransparentButton from 'components/TransparentButton';
import React, {FC} from 'react';
import styled from 'styled-components';
import {Asset} from '../../typings';
import Dialog, {DialogProps} from './../../components/Dialog/Dialog';
import {BlueButton} from './../../components/Dialog/DialogButtons';

type onChangeFunc = (newAsset: number) => void;
type onCloseFunc = () => void;

// extend the props excluding handled ones and including extra ones
export type AssetDialogProps = Pick<DialogProps, Exclude<keyof DialogProps, 'title' | 'body' | 'footer'>> & {
    assets: Asset[];
    onChange: onChangeFunc;
    assetId: number;
    onClose: onCloseFunc;
};

interface AssetDialogState {
    asset: number;
}

const DialogBodyHeading = styled.div`
    margin-bottom: 24px;
`;

class AssetDialog extends React.Component<AssetDialogProps, AssetDialogState> {
    constructor(props) {
        super(props);
        this.state = {asset: props.assetId};
    }
    render = () => (
        <Dialog
            {...this.props}
            isOpen={this.props.isOpen}
            title={'Change the transaction fee asset'}
            body={this.getDialogBody()}
            footer={this.getDialogFooter()}
        />
    );

    getDialogBody = () => (
        <>
            <DialogBodyHeading>Select which asset you would like to use for this transaction</DialogBodyHeading>
            <AssetDropDown
                isSearchable={false}
                value={this.state.asset}
                options={this.props.assets}
                onChange={(asset: Asset) => this.setState({asset: asset.id})}
                showBorder={true}
            />
        </>
    );

    getDialogFooter = () => (
        <>
            <TransparentButton onClick={() => this.props.onClose()}>Cancel</TransparentButton>
            <BlueButton
                onClick={() => {
                    this.props.onChange(this.state.asset);
                }}
            >
                Confirm
            </BlueButton>
        </>
    );
}

export default AssetDialog;
