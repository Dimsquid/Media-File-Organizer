import * as React from "react";
import * as css from "../page.scss";
import { Song, MousePosition, Playlist, JJect } from "../../Models";
import fileIcon from "../../../images/file.svg";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router";
import { deleteSong } from "../../containers/FileFunctions";

const fs = require("fs");
const app = require("electron").remote.app;
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "saveFile.json");

interface Props {
  match: any;
  jsonData: JJect;
  updateJSON: Function;
}
interface State {
  oldJSONData: any;
  popUpData: Song;
  mousePos: MousePosition;
  showPopOver: boolean;
  deletedReturn: boolean;
}

export default class Playlists extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      oldJSONData: null,
      popUpData: {},
      mousePos: { left: 0, top: 0 },
      showPopOver: false,
      deletedReturn: false
    };
  }

  onMouseMove(event: any) {
    const mediaData = this.state.oldJSONData.songs[event.target.id];
    if (mediaData) {
      const allData: Song = {
        fileName: mediaData.fileName,
        filePath: mediaData.filePath,
        extension: mediaData.extension,
        comment: mediaData.comment ? mediaData.comment : "",
        id: mediaData.id
      };
      this.setState({
        popUpData: allData,
        mousePos: { left: event.pageX, top: event.pageY },
        showPopOver: true
      });
    }
  }

  onMouseLeave() {
    this.setState({ showPopOver: !this.state.showPopOver });
  }

  componentDidMount() {
    this.setState({ oldJSONData: this.props.jsonData });
  }

  deletePlaylist(id: number) {
    const { oldJSONData } = this.state;
    const { updateJSON } = this.props;

    if (oldJSONData.playlist[id]) {
      console.log(oldJSONData.playlist);

      let obj = {
        songs: oldJSONData.songs,
        playlist: oldJSONData.playlist.filter(
          (playl: Playlist) => playl != oldJSONData.playlist[id]
        ),
        categories: oldJSONData.categories
      };

      updateJSON && updateJSON(jsonPath, obj);
      this.setState({ deletedReturn: true });
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { oldJSONData, showPopOver, popUpData, mousePos } = this.state;

    if (this.state.deletedReturn) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className={css.container}>
          <h1>
            Playlist:{" "}
            {oldJSONData &&
              oldJSONData.playlist &&
              oldJSONData.playlist[id] &&
              oldJSONData.playlist[id].name}
            <span className={css.deletePlaylist}>
              <FontAwesomeIcon
                onClick={() => this.deletePlaylist(id)}
                icon={faTrash}
              />
            </span>
          </h1>

          <div className={css.songHolder}>
            <ul>
              {oldJSONData &&
              oldJSONData.playlist &&
              oldJSONData.playlist[id] &&
              oldJSONData.playlist[id].songs &&
              oldJSONData.playlist[id].songs.length > 0 ? (
                oldJSONData.playlist[id].songs.map((media: Song) => {
                  if (media.extension !== "mp4")
                    return (
                      <li
                        onMouseMove={e => this.onMouseMove(e)}
                        onMouseLeave={() => {
                          this.onMouseLeave();
                        }}
                        className={css.thumbNail}
                        key={`${media.fileName}_${media.id}`}
                        id={media.id + ""}
                      >
                        {/* <div className={css.closeIcon}>
                          <FontAwesomeIcon
                            onClick={() => this.deleteItem(media.id)}
                            onMouseEnter={() => this.onMouseLeave()}
                            icon={faTrash}
                          />
                        </div> */}
                        <span className={css.floatingText}>
                          {media.fileName}
                        </span>
                        <img src={fileIcon} />
                      </li>
                    );
                })
              ) : (
                <li>You havent saved any songs</li>
              )}
            </ul>
          </div>
          {showPopOver && (
            <InformationPopOver
              information={popUpData}
              moveToPosition={mousePos}
            />
          )}
        </div>
      );
    }
  }
}
