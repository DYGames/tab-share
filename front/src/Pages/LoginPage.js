import React from "react"
import { withRouter } from "react-router-dom";
import "whatwg-fetch"

class LoginPage extends React.Component {
    render() {
        return (
            <div>
                <form>
                    <input type="text" name="id" id="login-id"></input>
                    <input type="text" name="pw" id="login-pw"></input>
                </form>

                <button onClick={() => {
                    fetch(`${process.env.REACT_APP_BACKEND_HOST}/Login`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        body: `id=${document.getElementById("login-id").value}&pw=${document.getElementById("login-pw").value}`,
                    }).then((response) => { return response.json(); 
                    }).then((json) => {
                        if (json.data.length === 1) {
                            window.location.href = "/";
                        }
                        else {
                            alert("Login Failed");
                        }
                    });
                }}>Login</button>
            </div>
        );
    }
}

export default withRouter(LoginPage);