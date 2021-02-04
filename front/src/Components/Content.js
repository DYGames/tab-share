import React from "react"
import {
    Route,
    Switch
} from "react-router-dom"
import IndexPage from "../Pages/IndexPage"
import ArticlePage from "../Pages/ArticlePage"
import WriteArticlePage from "../Pages/WriteArticlePage"
import LoginPage from "../Pages/LoginPage"
import SignUpPage from "../Pages/SignUpPage"
import UserInfoPage from "../Pages/UserInfoPage"
import PlayerPage from "../Pages/PlayerPage"

class Main extends React.Component {
    render() {
        return (
            <div className="Main">
                <Switch>
                    <Route exact path="/" component={IndexPage}></Route>
                    <Route path="/Article/:num" component={ArticlePage}></Route>
                    <Route path="/Login" component={LoginPage}></Route>
                    <Route path="/SignUp" component={SignUpPage}></Route>
                    <Route path="/Player" component={PlayerPage}></Route>
                    <Route path="/UserInfo" render={(props) => <UserInfoPage userinfo={this.props.userinfo}></UserInfoPage>}></Route>
                    <Route path="/WriteArticle" render={(props) => <WriteArticlePage editMode={false} userinfo={this.props.userinfo}></WriteArticlePage>}></Route>
                    <Route path="/EditArticle/:num" render={(props) => <WriteArticlePage editMode={true}></WriteArticlePage>}></Route>
                </Switch>
            </div>
        );
    }
}

class Sidebar extends React.Component {
    render() {
        return (
            <div className="Sidebar">

            </div>
        );
    }
}

class Content extends React.Component {
    render() {
        return (
            <div className="Content">
                <Sidebar></Sidebar>
                <Main userinfo={this.props.userinfo}></Main>
            </div>
        );
    }
}

export default Content;