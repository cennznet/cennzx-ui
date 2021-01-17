import React from 'react';
import styled from 'styled-components';

const Header = () => (
    <HeaderDiV>
        <h1>CENNZX</h1>
    </HeaderDiV>
);

export default Header;

const HeaderDiV = styled.div`
     {
        display: flex;
        color: #1130ff;
        flex-direction: row;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: -0.33px;
    }
`;
