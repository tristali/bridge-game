import "../../style/reset.scss";
import "../../style/header.scss";
import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import logoImg from "../../images/logo.svg";
import {dispatch} from "../../reducer";
import UserState from "./userState.js";
import Database from "../../firebase";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.currentUser) {
      Database.onAuthChanged(user => {
        dispatch("UPDATE_USER_INFO", {
          user: user
        });
      });
    }
  }
  render() {
    let userProfile = (
      <UserState
        isHeaderPanelClosed={this.props.isHeaderPanelClosed}
        currentUser={this.props.currentUser}
      />
    );
    let rightTopCorner;
    let registerBtns = (
      <div className="register-btn-groups">
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Login</Link>
      </div>
    );
    rightTopCorner =
            this.props.currentUser && this.props.currentUser.uid
              ? userProfile
              : registerBtns;
    let {roomNum} = this.props;
    let roomInfo = null;
    if (roomNum) {
      roomNum = `${roomNum}`;
      roomInfo =
                "Table " + roomNum.slice(roomNum.length - 3, roomNum.length);
    }
    return (
      <header className={this.props.isTableColor ? "table-header" : ""}>
        <div>
          <Link to="/">
            <img src={logoImg} />
            <h1>Wow Bridge</h1>
          </Link>
        </div>
        <div>
          <h3>{roomInfo}</h3>
        </div>
        <div>
          <div>{rightTopCorner}</div>
        </div>
      </header>
    );
  }
}
