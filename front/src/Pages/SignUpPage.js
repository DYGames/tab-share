import React from "react"

export default class SignUpPage extends React.Component {
    render() {
        return (
            <div>
                <form>
                    <input type="text" name="id" id="signup-id"></input>
                    <input type="text" name="pw" id="signup-pw"></input>
                    <input type="text" name="user" id="signup-user"></input>
                </form>

                <button onClick={() => {
                    fetch("http://localhost:3001/SignUp", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        body: `id=${document.getElementById("signup-id").value}&pw=${document.getElementById("signup-pw").value}&user=${document.getElementById("signup-user").value}`,
                    }).then((response) => {
                        return response.json();
                    }).then((json) => {
                        if (json.err) {
                            alert("Sign Up Failed");
                        }
                        else {
                            window.location.href = "/";
                        }
                    });
                }}>Sign Up</button>
            </div>
        );
    }
}