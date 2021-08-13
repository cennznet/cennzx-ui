import {Button} from 'centrality-react-core';
import styled from 'styled-components';

export const YellowButton = styled(Button as any)`
    font-size: 14px;
    border: 2px solid transparent;
    background-color: #ffd133;
    border-radius: 3px;
    color: #4e5458;

    :hover {
        border: 2px solid #000000;
        background-color: #4e5458;
        color: #ffd133;
    }
`;

export const BlueButton = styled(Button as any)`
    font-size: 14px;
    border: 2px solid #1130ff;
    background-color: #1130ff;
    border-radius: 3px;
    color: white;
    margin-right: auto;

    :hover {
        border: 2px solid #1130ff;
        background-color: white;
        color: #1130ff;
    }
`;

export const RedButton = styled(Button as any)`
    font-size: 14px;
    border: 2px solid #ef454b;
    background-color: #ef454b;
    border-radius: 3px;
    color: white;
    font-family: 'Open Sans', sans-serif;

    :hover {
        border: 2px solid #ef454b;
        background-color: white;
        color: #ef454b;
    }
`;

export const DisabledButton = styled(Button as any)`
    font-size: 14px;
    background-color: #ebeced;
    border-radius: 3px;
    color: #b5babd;
`;
