import React from "react"
import { Link } from "react-router-dom"
import "whatwg-fetch"
import logo from "../logo.svg"
import Button from "../Components/UI/Button"

class ArticleIndex extends React.Component {
    render() {
        return (
            <li className="ArticleIndex">
                <Link to={"/Article/" + this.props.article.num}>
                    <div className="ArticleIndexFrame">
                        <div className="ArticleIndexLogo">
                            <img src={logo} alt=""></img>
                            <div className="ArticleIndexHeader">
                                <h3>{this.props.article.title}</h3>
                                <p>{this.props.article.content}</p>
                            </div>
                        </div>
                        <div>
                            <p className="User">{this.props.article.user}</p>
                            <p className="Date">{this.props.article.uploadDate.substr(0, 10)}</p>
                        </div>
                    </div>
                </Link >
            </li >
        );
    }
}

class TopMostArticleIndex extends React.Component {
    render() {
        return (
            <li style={{ listStyle: "none" }}>
                <a href="/" style={{ color: "black", textDecoration: "none" }}>
                    <div className="TopMostArticleIndex" style={{ margin: "0 0 5px 0" }}>
                        <img src={logo} alt="" style={{ width: "25px", height: "25px", float: "left" }}></img>
                        <p style={{ margin: "0 0 0 0", fontSize: "8pt", height: "25px", lineHeight: "25px" }}>{this.props.article === undefined ? "준비 중" : this.props.article.content}</p>
                    </div>
                </a>
            </li>
        );
    }
}

class TopMostArticles extends React.Component {
    render() {
        this.props.articles.sort((a, b) => {
            return b.hit - a.hit;
        })

        let topArticles = [];
        for (let i = 0; i < 3; i++) {
            topArticles.push(<TopMostArticleIndex article={this.props.articles[i]} key={i}></TopMostArticleIndex>);
        }

        return (
            <div className="TopMostArticles">
                <h3>념글</h3>
                <ul style={{ padding: "0 0 0 5px" }}>
                    {topArticles}
                </ul>
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        let articleIndices = [];

        for (let i = 0; i < this.props.articles.length; i++) {
            articleIndices.push(<ArticleIndex article={this.props.articles[i]} key={i}></ArticleIndex>);
        }

        return (
            <>
                <div className="Board">
                    <h1>Free Board</h1>
                    <ul>{articleIndices}</ul>
                    <Button linkTo="/WriteArticle" value="글쓰기"></Button>
                </div>
                <TopMostArticles articles={this.props.articles}></TopMostArticles>
            </>
        );
    }
}

class IndexPage extends React.Component {
    constructor(props, context, updater) {
        super(props, context, updater);
        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}`).then((response) => {
            return response.json()
        }).then((json) => {
            this.setState({ articles: json.data })
        });
    }

    render() {
        return (
            <>
                <Board articles={this.state.articles}></Board>
            </>
        );
    }
}

export default IndexPage;
