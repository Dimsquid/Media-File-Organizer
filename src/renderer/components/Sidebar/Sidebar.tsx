import * as React from "react";
import * as css from "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/Modal";
const { dialog } = require("electron").remote;

interface Props {}
interface State {
  showSongs: boolean;
  showPlaylist: boolean;
  showCategories: boolean;
  showModal: boolean;
}

enum MenuType {
  songs,
  playlists,
  categories
}

export default class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showSongs: false,
      showPlaylist: false,
      showCategories: false,
      showModal: false
    };
    this.showMenu = this.showMenu.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  showMenu = (menuType: MenuType) => {
    switch (menuType) {
      case MenuType.songs:
        this.setState({ showSongs: !this.state.showSongs });
        break;
      case MenuType.playlists:
        this.setState({ showPlaylist: !this.state.showPlaylist });
        break;
      case MenuType.categories:
        this.setState({ showCategories: !this.state.showCategories });
        break;
      default:
        break;
    }
    return;
  };

  openFile() {
    dialog.showOpenDialog(
      {
        properties: ["openFile", "multiSelections"]
      },
      function(files) {
        if (files !== undefined) {
          console.log(files);
        }
      }
    );
  }

  getModalContent() {
    return <button onClick={this.openFile}>Choose Song/s</button>;
  }

  render() {
    return (
      <div className={css.container}>
        {this.state.showModal && <Modal title={"Add songs"} content={this.getModalContent()} showModal={this.state.showModal} />}
        <div className={css.listTypes}>
          <ul>
            <li
              onClick={() => {
                this.showMenu(MenuType.songs);
              }}>
              Songs <FontAwesomeIcon icon={faAngleDown} />
            </li>
            {this.state.showSongs ? (
              <ul className={css.subMenuList}>
                <li>Song Name</li>
                <li className={css.listFunction} onClick={() => this.showModal()}>
                  Add a song
                  <span>
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                </li>
              </ul>
            ) : null}
            <li
              onClick={() => {
                this.showMenu(MenuType.playlists);
              }}>
              Playlists <FontAwesomeIcon icon={faAngleDown} />
            </li>
            {this.state.showPlaylist ? (
              <ul className={css.subMenuList}>
                <li>Playlist Name</li>
                <li>Playlist Name</li>
                <li>Playlist Name</li>
                <li>Playlist Name</li>
              </ul>
            ) : null}
            <li
              onClick={() => {
                this.showMenu(MenuType.categories);
              }}>
              Categories <FontAwesomeIcon icon={faAngleDown} />
            </li>
            {this.state.showCategories ? (
              <ul className={css.subMenuList}>
                <li>Categorie Name</li>
              </ul>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}
