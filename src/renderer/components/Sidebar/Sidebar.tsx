import * as React from "react";
import * as css from "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/Modal";
import { MenuType, Songs, SongList } from "../../Models";
const { dialog } = require("electron").remote;
var fs = require("fs");

interface Props {}
interface State {
  showSongs: boolean;
  showPlaylist: boolean;
  showCategories: boolean;
  showModal: boolean;
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
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "FooFiles",
            extensions: ["AAC", "MP3", "WAV", "MP4", "AVI", "jpg"]
          }
        ]
      },

      function(files) {
        if (files !== undefined) {
          let newState = true;
          let songIndexStartingPoint = 0;
          var obj: Songs = {
            //@ts-ignore
            songs: []
          };
          fs.readFile("saveFile.json", "utf-8", (err: any, data: any) => {
            if (err) {
              alert("An error ocurred reading the file :" + err.message);
              return;
            }
            const newData = JSON.parse(data);
            if (newData.songs.length > 0) {
              newState = false;
              songIndexStartingPoint = newData.songs.length;
              newData.songs.map((song: any) => {
                obj.songs.push(song);
              });

              files.forEach((file, index) => {
                var fileName = file.replace(/^.*[\\\/]/, "");
                var extension = file.substr(file.length - 3);
                console.log(extension);
                obj.songs.push({
                  id: songIndexStartingPoint + index + 1,
                  fileName,
                  filePath: file,
                  extension
                });
              });
              fs.writeFile("saveFile.json", JSON.stringify(obj), (err: any) => {
                if (err) {
                  alert("An error ocurred creating the file " + err.message);
                }
                alert("The file has been succesfully saved");
              });
            } else {
              files.forEach((file, index) => {
                var fileName = file.replace(/^.*[\\\/]/, "");
                var extension = file.substr(file.length - 3);
                console.log(extension);
                obj.songs.push({
                  id: songIndexStartingPoint + index + 1,
                  fileName,
                  filePath: file,
                  extension
                });
              });
              fs.writeFile("saveFile.json", JSON.stringify(obj), (err: any) => {
                if (err) {
                  alert("An error ocurred creating the file " + err.message);
                }
                alert("The file has been succesfully saved");
              });
            }
          });
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
        {this.state.showModal && (
          <Modal
            title={"Add songs"}
            content={this.getModalContent()}
            showModal={this.state.showModal}
          />
        )}
        <div className={css.listTypes}>
          <ul>
            <li
              onClick={() => {
                this.showMenu(MenuType.songs);
              }}
            >
              Songs <FontAwesomeIcon icon={faAngleDown} />
            </li>
            {this.state.showSongs ? (
              <ul className={css.subMenuList}>
                <li>Song Name</li>
                <li
                  className={css.listFunction}
                  onClick={() => this.showModal()}
                >
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
              }}
            >
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
              }}
            >
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
