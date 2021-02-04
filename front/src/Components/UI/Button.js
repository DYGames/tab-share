import React from "react";
import "./Button.css"
import { Link } from "react-router-dom"

export default class Button extends React.Component {
    render() {
        let button = null;
        if (this.props.linkTo === undefined) {
            button = (
                <button className={this.props.className} onClick={this.props.onClick}>{this.props.value}</button>
            );
        }
        else if (this.props.onClick === undefined) {
            button = (
                <Link to={this.props.linkTo}>
                    <button className={this.props.className}>{this.props.value}</button>
                </Link>
            );
        }
        else {
            button = (
                <Link to={this.props.linkTo}>
                    <button className={this.props.className} onClick={this.props.onClick}>{this.props.value}</button>
                </Link>
            );
        }
        return button;
    }
}