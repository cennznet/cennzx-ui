import {Link} from '@reach/router';
import React from 'react';
import styled from 'styled-components';

export default ({active}) => (
    <NavContent>
        <Link style={getLinkStyle('exchange', active)} to="exchange">
            Exchange
        </Link>
        <Link style={getLinkStyle('liquidity', active)} to="liquidity">
            Liquidity
        </Link>
    </NavContent>
);

const getLinkStyle = (page, activePage) =>
    page === activePage ? {color: '#4E5458', borderBottomColor: '#1130FF'} : {color: '#B5BABD'};

const NavContent = styled.nav`
     {
        color: #b5babd;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        background-color: #ffffff;
        justify-content: center;
        display: flex;
        margin-bottom: 2rem;

        a {
            border-bottom: 2px rgba(17, 48, 255, 0.3) solid;
            color: #4e5458;
        }
    }
`;
