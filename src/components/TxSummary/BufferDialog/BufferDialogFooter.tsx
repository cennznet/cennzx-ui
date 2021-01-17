import {BlueButton, YellowButton} from 'components/Dialog/DialogButtons';
import TransparentButton from 'components/TransparentButton';
import React, {FC} from 'react';
import styled from 'styled-components';

const Message = styled.div`
    justify-content: flex-start;
    display: flex;
    flex: 3;
    color: #ef454b;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    white-space: nowrap;
`;

const Buttons = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`;

interface BufferDialogFooterProps {
    onClose: () => void;
    onConfirm: () => void;
    showContinueAnywayButton?: boolean;
    message?: string;
}
const BufferDialogFooter: FC<BufferDialogFooterProps> = ({onClose, onConfirm, showContinueAnywayButton, message}) => (
    <Container>
        {message && <Message>{message}</Message>}
        <Buttons>
            <TransparentButton onClick={() => onClose()}>Cancel</TransparentButton>
            {!showContinueAnywayButton ? (
                <BlueButton onClick={onConfirm}>Confirm</BlueButton>
            ) : (
                <YellowButton onClick={onConfirm}>Confirm anyway</YellowButton>
            )}
        </Buttons>
    </Container>
);

export default BufferDialogFooter;
