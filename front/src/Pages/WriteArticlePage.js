import React from "react";
import Button from "../Components/UI/Button"
import "./WriteArticlePage.css";
import { withRouter } from "react-router-dom";
import "whatwg-fetch"

class WriteArticlePage extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            article: []
        }
    }

    componentDidMount() {
        if (!this.props.editMode)
            return;

        fetch(`${process.env.REACT_APP_BACKEND_HOST}/Article/` + this.props.match.params.num
        ).then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({ article: json.data[0] })
        });
    }

    render() {
        return (
            <div className="WriteArticlePage">
                <h1 style={{ margin: "10px 0 10px 40px" }}>{this.props.editMode ? "글 수정" : "글 쓰기"}</h1>

                <textarea cols="30" rows="10" id="Title" type="text" placeholder="Title" defaultValue={this.props.editMode ? this.state.article.title : ""}></textarea>
                <textarea cols="30" rows="10" id="User" type="text" placeholder="User" defaultValue={this.props.editMode ? this.state.article.user : (this.props.userinfo ? (this.props.userinfo.user || "") : "")}></textarea>
                <textarea cols="30" rows="10" id="Content" type="text" placeholder="Content" defaultValue={this.props.editMode ? this.state.article.content : ""}></textarea>

                <Button className="SubmitArticle" value="등록" onClick={() => {
                    let url, method;
                    if (this.props.editMode) {
                        url = `${process.env.REACT_APP_BACKEND_HOST}/Article/` + this.props.match.params.num;
                        method = "PUT";
                    }
                    else {
                        url = `${process.env.REACT_APP_BACKEND_HOST}/Article/`;
                        method = "POST";
                    }

                    fetch(url, {
                        method: method,
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        body: `title=${document.getElementById("Title").value}&content=${document.getElementById("Content").value}&user=${document.getElementById("User").value}`,
                    }).then((response) => {
                        this.props.history.push("/");
                    });
                }}></Button>
            </div>
        );
    }
}

export default withRouter(WriteArticlePage);
