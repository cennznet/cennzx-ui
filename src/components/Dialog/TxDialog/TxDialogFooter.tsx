import {BlueButton, RedButton} from 'components/Dialog/DialogButtons';
import TransparentButton from 'components/TransparentButton';
import React, {FC} from 'react';
import {Stages} from '../../../redux/reducers/ui/txDialog.reducer';
import styled from 'styled-components';

const FooterForSigning: FC<{error?: Error; onClose(): void; onSubmit(): void}> = ({error, onClose, onSubmit}) =>
    error ? (
        <RedButton onClick={onClose}>Close</RedButton>
    ) : (
        <>
            <TransparentButton onClick={onClose}>Cancel</TransparentButton>
            <BlueButton onClick={onSubmit}>Authorise Transaction</BlueButton>
        </>
    );

const FooterForBroadcasted: FC<{onClick(): void}> = ({onClick}) => <BlueButton onClick={onClick}>Close</BlueButton>;

const FooterForFinalised: FC<{success: boolean; onClick(): void}> = ({success, onClick}) =>
    success ? <BlueButton onClick={onClick}>Close</BlueButton> : <RedButton onClick={onClick}>Close</RedButton>;
const FootBox = styled.div`
    display: flex;
    justify-content: flex-end;
    flex: 1;
`;
export interface TxDialogFooterProps {
    stage: Stages;
    error?: Error;
    success?: boolean;

    onClose(): void;
    onSubmit(): void;
    onComplete(): void;
}

export const TxDialogFooter: FC<TxDialogFooterProps> = ({error, stage, success, onClose, onSubmit, onComplete}) => {
    const closeAndComplete = () => {
        onClose();
        onComplete();
    };

    switch (stage) {
        case Stages.Signing:
            return (
                <FootBox>
                    <FooterForSigning error={error} onClose={onClose} onSubmit={onSubmit} />
                </FootBox>
            );
        case Stages.Broadcasted:
            return (
                <FootBox>
                    <FooterForBroadcasted onClick={closeAndComplete} />
                </FootBox>
            );
        case Stages.Finalised:
            return (
                <FootBox>
                    <FooterForFinalised onClick={closeAndComplete} success={success} />
                </FootBox>
            );
        default:
            return <></>;
    }
};
