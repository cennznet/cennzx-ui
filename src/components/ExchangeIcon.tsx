import {faExchangeAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC, useState} from 'react';
import styled from 'styled-components';

interface ExchangeIconProps {
    onClick: () => void;
}

export interface FontAwesomeIconProps {
    rotations: number;
}

const ExchangeIcon = styled(FontAwesomeIcon)<FontAwesomeIconProps>`
    height: 20px;
    width: 20px;
    color: rgba(17, 48, 255, 0.3);
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    transform: ${props => (props.rotations % 2 ? 'rotate(-90deg) ' : 'rotate(90deg)')};
    -webkit-transform: ${props => (props.rotations % 2 ? 'rotate(-90deg) ' : 'rotate(90deg)')};
    transition-duration: 0.7s;
    transition-property: transform;

    :hover {
        color: #1130ff;
    }
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const ExchangeIconClass: FC<ExchangeIconProps> = ({onClick}) => {
    const [rotations, setRotations] = useState(0);
    return (
        <Container
            onClick={() => {
                setRotations(rotations + 1);
                onClick();
            }}
        >
            <ExchangeIcon rotations={rotations} icon={faExchangeAlt as any} />
        </Container>
    );
};

export default ExchangeIconClass;
