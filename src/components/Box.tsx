import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

interface ButtonProps {
    bids: string;
}

const BoxDiv = styled.div`
    flex: 1;
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
    position: relative;
    background-black: red;
    height: 200px;
    font-size: 40px;
    color: black;
`;

class Box extends React.Component<ButtonProps, {}> {
    render = () => (
        <BoxDiv>
            {/* <Translate id={'common.bids'}/> {this.props.bids}*/}
            bids {this.props.bids}
        </BoxDiv>
    );
}

const mapStateToProps = (state: any) => {
    return {bids: state.ui.bids};
};

export default connect(mapStateToProps)(Box);
