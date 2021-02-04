import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom"
import "whatwg-fetch"
import Header from "./Components/UI/Header"
import Navigator from "./Components/UI/Navigator"
import Content from "./Components/UI/Content"

class App extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            userinfo: {}
        }
    }

    checkLogin() {
        fetch("http://localhost:3001/UserInfo", {
            method: "GET",
            credentials: "include",
        }).then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({ userinfo: json.data[0] });
        });
    }

    componentDidMount() {
        this.checkLogin();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Header user={this.state.userinfo.user}></Header>
                    <Navigator></Navigator>
                    <Content userinfo={this.state.userinfo}></Content>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
