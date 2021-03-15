import React from "react";
import { Link } from "react-router-dom"
import styled from "styled-components";

export default class Button extends React.Component {
    render() {
        let button = null;

        const ButtonStyle = styled.button`
            border: 0;
            border-radius: 4px;
            box-sizing: border-box;
            cursor: pointer;
            float: right;
            font-size: .75em;
            margin: 0 5px 0 5px;
            padding: 8px 16px;
            transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            background-color: rgb(26, 115, 232);
            color: white;
        `;
        if (this.props.linkTo === undefined) {
            button = (
                <ButtonStyle className={this.props.className} onClick={this.props.onClick}>{this.props.value}</ButtonStyle>
            );
        }
        else if (this.props.onClick === undefined) {
            button = (
                <Link to={this.props.linkTo}>
                    <ButtonStyle className={this.props.className}>{this.props.value}</ButtonStyle>
                </Link>
            );
        }
        else {
            button = (
                <Link to={this.props.linkTo}>
                    <ButtonStyle className={this.props.className} onClick={this.props.onClick}>{this.props.value}</ButtonStyle>
                </Link>
            );
        }
        return button;
    }
}