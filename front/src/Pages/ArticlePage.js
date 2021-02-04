import React from "react"
import "./ArticlePage.css";
import "whatwg-fetch"
import Button from "../Components/Button"
import { withRouter } from "react-router-dom";

class ArticlePage extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            article: []
        }
    }

    componentDidMount() {
        fetch("http://localhost:3001/Article/" + this.props.match.params.num).then((response) => {
            return response.json();
        }).then((json) => {
            this.setState({ article: json.data[0] })
        });
    }

    render() {
        let date = this.state.article.uploadDate;
        if (date !== undefined)
            date = date.substr(0, 10);

        return (
            <div style={{ width: "100%" }}>
                <h1 className="ArticleTitle">{this.state.article.title}</h1>
                <div className="ArticlePageMeta">
                    <p><span>User </span><span className="ArticleUser">{this.state.article.user}</span>       <span>Date </span>{date}        <span>View </span>{this.state.article.hit}</p>
                </div>
                <div>
                    <p className="ArticleContent">{this.state.article.content}</p>
                </div>
                <div className="ArticleOptions">
                    <Button linkTo="/" value="목록"></Button>
                    <Button linkTo={"/EditArticle/" + this.props.match.params.num} value="수정"></Button>
                    <Button onClick={() => {
                        fetch("http://localhost:3001/Article/" + this.props.match.params.num, {
                            method: "DELETE"
                        }).then((response) => {
                            this.props.history.push("/");
                        });
                    }} value="삭제"></Button>
                </div>
            </div>
        );
    }
}

export default withRouter(ArticlePage);
