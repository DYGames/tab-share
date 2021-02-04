import React from "react";
import styled from "styled-components"

export default class UserInfoPage extends React.Component {


    render() {
        const UserHeader = styled.h2`
            display: inline;
            margin: 0 40px 0 0;
        `;

        const UserContent = styled.p`
            display: inline;
        
        `;

        return (
            <div style={{ width: "100%", padding: "0px 0px 0px 40px" }}>
                <h1 style={{ margin: "20px 0px 20px 0px" }}>UserInfo</h1>
                <UserHeader>id</UserHeader> <UserContent>{this.props.userinfo.id}</UserContent> <br></br>
                <UserHeader>username</UserHeader> <UserContent>{this.props.userinfo.user}</UserContent>
            </div>
        )
    }
}