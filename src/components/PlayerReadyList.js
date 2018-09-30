import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {EMPTY_SEAT} from "./constant.js";
import {getRandomKey} from "../helper/helper.js";
import {dispatchToDatabase} from "../reducer/reducer.js";
import "../style/readylist.scss";
export default class PlayerReadyList extends React.Component {
  constructor(props) {
    super(props);
    this.setReadyState = this.setReadyState.bind(this);
  }
  setReadyState(playerIndex) {
    let {currentUser, game, tableId, gameIndex} = this.props;
    if (!this.props.game) return;

    let ready = this.props.game.ready;
    dispatchToDatabase("READY_A_PLAYER", {
      player: playerIndex,
      tableId: tableId,
      game: game,
      value: true,
      gameIndex: gameIndex
    });
  }

  render() {
    let {game, currentUser} = this.props;
    if (!game) {
      return null;
    }

    let {players, ready, isGameOver, order} = game;

    let isEmptySeat = players.some(seat => seat === EMPTY_SEAT);
    let isAllPlayerReady = ready.every(player => player === true);
    let showPlayerReadyList =
            (isEmptySeat && order < 0) || !isAllPlayerReady;

    if (!showPlayerReadyList) {
      return null;
    }
    let playBtns = null;
    let thumbnails = players.map((player, index) => (
      <div
        key={getRandomKey()}
        className={
          ready[index] === false ? "thumbnail" : "thumbnail ready"
        }>
        <span>{player[0]}</span>
      </div>
    ));

    let currentUserCanPlay;
    if (players.includes(currentUser)) {
      currentUserCanPlay = players.some(
        (player, index) => player === currentUser && !ready[index],
      );
      playBtns = players.map((player, index) => {
        if (player === currentUser && !ready[index]) {
          return (
            <div key={getRandomKey()}>
              <button
                key={getRandomKey()}
                onClick={() => this.setReadyState(index)}
                className="btn">
                                加入牌局
              </button>
            </div>
          );
        } else {
          return null;
        }
      });
    }
    return (
      <div className="player-ready-list">
        <div className="player-ready-list-inner">
          <div className="row"> {thumbnails}</div>
          {currentUserCanPlay && (
            <div className="btn-wrapper">{playBtns}</div>
          )}
          <div className="notes">等待加入中...</div>
        </div>
      </div>
    );
  }
}

// <div className="row">{playBtns}</div>
// <div className="row" />
