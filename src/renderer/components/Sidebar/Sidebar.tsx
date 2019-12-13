import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Link, HashRouter as Router } from "react-router-dom";

import * as css from "./sidebar.scss";
import { Playlist, JJect } from "../../Models";

interface Props {
  jsonData: JJect;
  showModal?: Function;
  saveCurrentState?: Function;
  loadStateFile?: Function;
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
    this.showModal = this.showModal.bind(this);
  }

  showMenu() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }

  renderInPlaylistList() {
    const { jsonData } = this.props;
    if (jsonData.playlist && jsonData.playlist.length > 0) {
      return jsonData.playlist.map((playl: Playlist) => {
        return (
          <Link to={"/playlist/" + playl.id} key={`${playl.name}_${playl.id}`} id={playl.id + ""}>
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

  showModal() {
    this.props.showModal && this.props.showModal();
  }

  render() {
    const { saveCurrentState, loadStateFile } = this.props;
    return (
      <div className={css.container}>
        <div className={css.listTypes}>
          <ul>
            <Router>
              <Link to="/">
                <li>Media</li>
              </Link>
              <li onClick={this.showMenu}>
                Playlists <FontAwesomeIcon icon={faAngleDown} />
              </li>
              {this.state.showPlaylist ? <ul className={css.subMenuList}>{this.renderInPlaylistList()}</ul> : null}
              <li onClick={this.showModal}>Categories</li>
              <li onClick={() => saveCurrentState && saveCurrentState()}>
                Save State <FontAwesomeIcon icon={faSave} />
              </li>
              <li onClick={() => loadStateFile && loadStateFile()}>
                Load State <FontAwesomeIcon icon={faUpload} />
              </li>
            </Router>
          </ul>
        </div>
      </div>
    );
  }
}
