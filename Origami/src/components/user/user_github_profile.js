import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import userApi from "../../api/Github/userApi";
import { BounceLoader } from "react-spinners";
import { Link, withRouter } from "react-router-dom";
import pic from "../assets/profile.png";
import { getDeployed } from "../../api/Nongh/getDeployed";

class Profile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      democount: "democount",
      userid: "userid",
      username: "username",
      name: "name",
      email: "email.com",
      bio: "bio",
      company: "company",
      avatar: pic,
      github: ""
    };
  }

  componentWillMount() {
    userApi
      .userProfile()
      .then(user => {
        user = JSON.parse(user);
        let userid = user.id;
        let username = user.login;
        let name = user.name;
        let email = user.email;
        let bio = user.bio;
        let company = user.company;
        let avatar = user.avatar_url;
        let github = user.html_url;
        this.setState({
          userid,
          username,
          name,
          email,
          bio,
          company,
          avatar,
          github
        });
      })
      .then(
        getDeployed(this.state.userid).then(deployedArray => {
          let democount = JSON.parse(deployedArray).length;
          this.setState({ democount });
        })
      );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ demoLoading: true });
    let uname = nextProps.user;
    userApi.userProfileFromName(uname).then(user => {
      user = JSON.parse(user);
      let username = user.login;
      let name = user.name;
      let email = user.email;
      let bio = user.bio;
      let company = user.company;
      let avatar = user.avatar_url;
      let github = user.html_url;
      this.setState({
        username,
        name,
        email,
        bio,
        company,
        avatar,
        github
      });
    });
  }

  render() {


    return (
      <div className="container">
        <div className="profile-sidebar">
          <div>
            <div className="profile-userpic">
              <img src={this.state.avatar} className="img-responsive" alt="" />
            </div>
            <div className="profile-usertitle">
              <div className="profile-usertitle-name">{this.state.name}</div>
              <div className="profile-usertitle-job">{this.state.username}</div>
            </div>

            <div className="btn-group" style={{ marginLeft: 30 }}>
              <a href="#" className="btn btn-primary">
                Demo Count
              </a>
              <a href="#" className="btn btn-success">
                {this.state.democount}
              </a>
            </div>

            <div className="profile-usermenu">
              <ul className="nav">
                <li>
                  <a href="#">
                    <i className="glyphicon glyphicon-envelope" />
                    <span style={{ float: "right" }}>
                      <a href={this.state.email}> E-mail</a>
                    </span>
                  </a>
                </li>
                {this.state.company && (
                  <li>
                    <a href="#">
                      <i className="glyphicon glyphicon-user" />
                      {this.state.company}{" "}
                    </a>
                  </li>
                )}
                <li>
                  <a href={this.state.github}>
                    <i className="fab fa-github" />
                    Github Profile{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.activeUser
  };
}

export default connect(mapStateToProps)(Profile);
