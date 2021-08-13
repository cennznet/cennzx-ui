import {Modal, ModalBody, ModalFooter} from 'centrality-react-core';
import React, {FC, ReactNode} from 'react';
import styled from 'styled-components';

const Content = styled.div``;

const Header = styled.h1`
    margin-top: 0px;
`;

const ModalStyled = styled(Modal as any)`
    border-radius: 3px;
    color: black;
`;

const FooterContainer = styled.div`
    display: flex;
    width: 100%;
`;

export interface DialogProps {
    title: ReactNode;
    body: ReactNode;
    footer: ReactNode;
    isOpen: boolean;
}

const Dialog: FC<DialogProps> = ({title, body, footer, isOpen}) => (
    <ModalStyled isOpen={isOpen}>
        <ModalBody>
            <Header>{title}</Header>
            <Content>{body}</Content>
        </ModalBody>
        <ModalFooter>
            <FooterContainer>{footer}</FooterContainer>
        </ModalFooter>
    </ModalStyled>
);

export default Dialog;
