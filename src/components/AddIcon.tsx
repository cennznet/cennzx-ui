import {faAddressCard} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {FC, useState} from 'react';
import styled from 'styled-components';

export interface FontAwesomeIconProps {
    // can't pass in boolean, it complains, so use string as boolean
    spinner: string;
}

const AddIcon = styled(FontAwesomeIcon)<FontAwesomeIconProps>`
    height: 16px;
    width: 16px;
    color: rgba(17, 48, 255, 0.3);
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    cursor: pointer;
    transform: ${props => (props.spinner === 'true' ? 'rotate(-90deg) ' : 'rotate(90deg)')};
    -webkit-transform: ${props => (props.spinner === 'true' ? 'rotate(-90deg) ' : 'rotate(90deg)')};
    transition-duration: 0.8s;
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

const AddIconClass: FC = () => {
    const [state, setState] = useState({spinner: false});
    return (
        <Container>
            <AddIcon spinner={state.spinner.toString()} icon={faAddressCard as any} />
        </Container>
    );
};

export default AddIconClass;
