import * as React from "react";
import * as css from "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link, HashRouter as Router } from "react-router-dom";
import { Playlist, Song, Songs, JJect } from "../../Models";
const fs = require("fs");
const app = require("electron").remote.app;
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "saveFile.json");

interface Props {
  jsonData: JJect;
}
interface SidebarState {
  showModal: boolean;
  showPlaylist: boolean;
}

export default class Sidebar extends React.Component<Props, SidebarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
      showPlaylist: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  showMenu() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }

  renderInPlaylistList() {
    const { jsonData } = this.props;
    if (jsonData.playlist && jsonData.playlist.length > 0) {
      return jsonData.playlist.map((playl: Playlist) => {
        return (
          <Link
            to={"/playlist/" + playl.id}
            key={`${playl.name}_${playl.id}`}
            id={playl.id + ""}
          >
            <li>
              <span>{playl.name}</span>
            </li>
          </Link>
        );
      });
    } else {
      return (
        <div>
          <li>You have no playlists</li>
        </div>
      );
    }
  }

  render() {
    console.log(this.props.jsonData);
    return (
      <div className={css.container}>
        <div className={css.listTypes}>
          <ul>
            <Router>
              <Link to="/">
                <li>Songs</li>
              </Link>
              <li onClick={this.showMenu}>
                Playlists <FontAwesomeIcon icon={faAngleDown} />
              </li>
              {this.state.showPlaylist ? (
                <ul className={css.subMenuList}>
                  {this.renderInPlaylistList()}
                </ul>
              ) : null}
              <Link to="/categories">
                <li>Categories</li>
              </Link>
            </Router>
          </ul>
        </div>
      </div>
    );
  }
}
