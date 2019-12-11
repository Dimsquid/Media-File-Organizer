import * as React from "react";
import * as css from "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/Modal";
import { MenuType, Songs } from "../../Models";
import { Link, HashRouter as Router } from "react-router-dom";
const { dialog } = require("electron").remote;
var fs = require("fs");

interface Props {
  callBack?: Function;
}
interface SidebarState {
  showSongs: boolean;
  showPlaylist: boolean;
  showCategories: boolean;
  showModal: boolean;
  update: any;
}

export default class Sidebar extends React.Component<Props, SidebarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showSongs: false,
      showPlaylist: false,
      showCategories: false,
      showModal: false,
      update: null
    };
    this.showMenu = this.showMenu.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  closeModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  showMenu() {
    this.setState({ showPlaylist: !this.state.showPlaylist });
  }

  fileWriter(path: string, JSONObj: Object) {
    fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
        this.setState({ showModal: false });
      }
      alert("The file has been succesfully saved");
      // this.closeModal();
      this.props.callBack && this.props.callBack();
    });
  }

  openFile(outsideThis: any) {
    const path = "saveFile.json";
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
          let songIndexStartingPoint = 0;
          var obj: Songs = {
            //@ts-ignore
            songs: []
          };
          let currentNames;
          fs.access(path, fs.F_OK, (notExsist: any) => {
            if (notExsist) {
              outsideThis.fileWriter(path, obj);
            } else {
              fs.readFile(path, "utf-8", (err: any, data: any) => {
                if (err) {
                  alert("An error ocurred reading the file :" + err.message);
                  return;
                }
                console.log("SS");
                const newData: Songs = JSON.parse(data);
                songIndexStartingPoint = newData.songs.length;
                newData.songs.forEach((song: any) => {
                  obj.songs.push(song);
                });

                files.forEach((file, index) => {
                  var fileName = file.replace(/^.*[\\\/]/, "");
                  fileName = fileName.substr(0, fileName.length - 4);
                  var extension = file.substr(file.length - 3);

                  obj.songs.push({
                    id: songIndexStartingPoint + index,
                    fileName,
                    filePath: file,
                    extension
                  });
                });
                outsideThis.fileWriter(path, obj);
              });
            }
          });
        }
      }
    );
  }

  getModalContent() {
    return <button onClick={() => this.openFile(this)}>Choose Song/s</button>;
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.listTypes}>
          <ul>
            <Router>
              <Link to="/songs">
                <li>Songs</li>
              </Link>
              <li onClick={this.showMenu}>
                Playlists <FontAwesomeIcon icon={faAngleDown} />
              </li>
              {this.state.showPlaylist ? (
                <ul className={css.subMenuList}>
                  <Link to="/playlist/1">
                    <li>Test</li>
                  </Link>
                </ul>
              ) : null}
              <Link to="/categories">
                <li>Categories</li>
              </Link>
            </Router>
            <li onClick={() => this.openFile(this)}>Add File</li>
          </ul>
        </div>
      </div>
    );
  }
}
