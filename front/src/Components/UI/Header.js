import React from "react"
import logo from "../../logo.svg"
import { Link } from "react-router-dom"
import "./Header.css"
import "whatwg-fetch"

class SearchBar extends React.Component {
    render() {
        return (
            <div className="SearchBar">
                <form>
                    <input type="text" placeholder="검색"></input>
                </form>
            </div>
        )
    }
}

class Header extends React.Component {
    render() {
        let auth;
        if (this.props.user) {
            auth = (<div className="Auth">
                <Link to="/UserInfo"><p>{this.props.user}</p></Link>
                <a href="#!" onClick={() => {
                    fetch(`${process.env.REACT_APP_BACKEND_HOST}/Logout`, {
                        method: "GET",
                        credentials: "include"
                    }).then((response) => {
                        return response.json();
                    }).then((json) => {
                        if (json.status === 200)
                            window.location.href = "/";
                    });
                }}><p>Logout</p></a>
            </div>);
        }
        else {
            auth = (<div className="Auth">
                <a href="/Login"><p>Login</p></a>
                <a href="/SignUp"><p>Sign Up</p></a>
            </div>);
        }

        return (
            <div className="Header">
                <a className="Logo" href="/"><img src={logo} alt=""></img></a>
                <p>tab-share</p>
                <SearchBar></SearchBar>
                {auth}
                <Link to="/Player" className="Player"><p>Player</p></Link>
            </div>
        );
    }
}

export default Header;
