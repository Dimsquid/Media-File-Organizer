import * as React from "react";
import * as css from "../page.scss";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import mp3 from "../../../images/mp3.svg";
import { Song, MousePosition, Songs } from "../../Models";
import Modal from "../../components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const { dialog } = require("electron").remote;
const fs = require("fs");
const app = require("electron").remote.app;
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "saveFile.json");

interface Props {
  songs?: any;
}

interface SongState {
  popUpData: Song;
  mousePos: MousePosition;
  showPopOver: boolean;
  showModal: boolean;
  openedFileData: Song;
  oldJSONData: any;
  toggleClass: boolean;
  selectedSong: number;
  showPlaylistModal: boolean;
}

export default class SongsClass extends React.Component<Props, SongState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popUpData: {
        id: 0,
        fileName: "",
        filePath: "",
        extension: "",
        comment: ""
      },
      mousePos: { left: 0, top: 0 },
      showPopOver: false,
      showModal: false,
      openedFileData: { id: 0, fileName: "", filePath: "", extension: "" },
      oldJSONData: null,
      toggleClass: true,
      selectedSong: NaN,
      showPlaylistModal: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  refreshData() {
    this.setState({ oldJSONData: JSON.parse(fs.readFileSync(jsonPath)) });
  }

  componentDidMount() {
    this.refreshData();
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
    this.setState({ showPopOver: false });
  }

  onChange(e: any) {
    const value = e.target.value ? e.target.value : "";
    this.setState(prevState => ({
      openedFileData: {
        ...prevState.openedFileData,
        comment: value
      },
      popUpData: {
        ...prevState.popUpData,
        comment: value
      }
    }));
  }

  openFile(outsideThis: this) {
    // const path = "saveFile.json";
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            name: "FooFiles",
            extensions: ["AAC", "MP3", "WAV", "MP4", "AVI", "jpg"]
          }
        ]
      },
      function(files) {
        if (files !== undefined) {
          var fileName = files[0].replace(/^.*[\\\/]/, "");
          fileName = fileName.substr(0, fileName.length - 4);
          var extension = files[0].substr(files[0].length - 3);
          outsideThis.setState({
            openedFileData: { id: 0, fileName, filePath: files[0], extension }
          });
          outsideThis.closeModal();
        }
      }
    );
  }

  modalBodyContent() {
    const { openedFileData } = this.state;
    return (
      <div className={css.modalBody}>
        <div>Chosen File: {openedFileData.fileName}</div>
        <br />
        <div>Extension Type: {openedFileData.extension}</div>
        <br />
        <div>File Path: {openedFileData.filePath}</div>
        <br />
        <br />
        <div className={css.inputHolder}>
          <input
            onChange={e => this.onChange(e)}
            placeholder="Here you can add a comment about the file"
            type="text"
          />
        </div>
      </div>
    );
  }

  closeModal() {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
    if (showModal) {
      this.setState({ openedFileData: {} });
    }
  }

  fileWriter(path: string, JSONObj: Object) {
    const { showModal } = this.state;
    fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      this.refreshData();
      if (showModal) {
        this.closeModal();
        this.setState({ openedFileData: {} });
      }
      // alert("The file has been succesfully saved");
    });
  }

  addNewSong() {
    let obj: Songs = {
      songs: []
    };
    const { openedFileData, oldJSONData } = this.state;
    fs.access(jsonPath, fs.F_OK, (notExsist: any) => {
      if (notExsist || (oldJSONData && oldJSONData.songs) == null) {
        obj.songs.push({
          id: openedFileData.id,
          fileName: openedFileData.fileName,
          filePath: openedFileData.filePath,
          extension: openedFileData.extension,
          comment: openedFileData.comment
        });
        this.fileWriter(jsonPath, obj);
      } else {
        const songIndexStartingPoint = oldJSONData.songs.length;
        this.state.oldJSONData.songs.map((song: any) => {
          obj.songs.push(song);
        });
        obj.songs.push({
          id: songIndexStartingPoint,
          fileName: openedFileData.fileName,
          filePath: openedFileData.filePath,
          extension: openedFileData.extension,
          comment: openedFileData.comment
        });
        this.fileWriter(jsonPath, obj);
      }
    });
  }

  deleteItem() {
    const { selectedSong } = this.state;
    if (confirm("Are you sure you want to delete this file?")) {
      this.setState(prevState => {
        const media = prevState.oldJSONData.songs.filter(
          (obj: Song) => obj.id != selectedSong
        );
        let obj: Songs = {
          songs: []
        };
        media.map((song: any) => {
          obj.songs.push(song);
        });
        this.fileWriter(jsonPath, obj);

        return media;
      });
      this.setState({ selectedSong: NaN });
    }
  }

  togglePlaylistModal() {
    console.log("clicked");
    this.setState({ showPlaylistModal: !this.state.showPlaylistModal });
  }

  playlistModalContent() {
    return "test";
  }

  getSelectedContent() {
    const { oldJSONData, selectedSong } = this.state;
    return (
      <div className={css.builtContent}>
        {oldJSONData.songs[selectedSong].fileName}
        <div className={css.buttonHolder}>
          <button onClick={() => this.togglePlaylistModal()}>
            Add to playlist <FontAwesomeIcon icon={faPlus} />
          </button>
          <button onClick={() => this.deleteItem()} className={css.deleteMedia}>
            Delete media <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    );
  }

  openOptions(e: any) {
    this.setState({
      toggleClass: false,
      selectedSong: e.target.id
    });
  }
  closeOptions() {
    this.setState({
      toggleClass: true,
      selectedSong: NaN
    });
  }

  render() {
    const {
      showModal,
      showPopOver,
      mousePos,
      popUpData,
      oldJSONData,
      toggleClass,
      selectedSong,
      showPlaylistModal
    } = this.state;

    return (
      <div
        style={{
          pointerEvents: showModal || showPlaylistModal ? "none" : "all"
        }}
        className={css.container}
      >
        {showModal && (
          <Modal
            title={"Add songs"}
            content={this.modalBodyContent()}
            closeModal={() => this.closeModal()}
            saveButton={() => this.addNewSong()}
            showButtons={true}
          />
        )}
        {showPlaylistModal && (
          <Modal
            title={"Add to playlist"}
            content={this.playlistModalContent()}
            closeModal={() => this.togglePlaylistModal()}
            showButtons={false}
          />
        )}
        <h1>Songs</h1>
        <div className={css.buttonHolder}>
          <button onClick={() => this.openFile(this)}>
            <span className={css.floatingText}>Add a new file</span>
          </button>
          <button>
            <span className={css.floatingText}>Create new playlist</span>
          </button>
        </div>
        <div className={css.songHolder}>
          <ul>
            {oldJSONData && oldJSONData.songs.length > 0 ? (
              oldJSONData.songs.map((media: Song) => {
                if (media.extension !== "mp4")
                  return (
                    <li
                      onMouseMove={e => this.onMouseMove(e)}
                      onMouseLeave={() => {
                        this.onMouseLeave();
                      }}
                      onClick={e => this.openOptions(e)}
                      className={css.thumbNail}
                      key={`${media.fileName}_${media.id}`}
                      id={media.id + ""}
                    >
                      <span className={css.floatingText}>{media.fileName}</span>
                      <img src={mp3} />
                    </li>
                  );
              })
            ) : (
              <li>You havent saved any songs</li>
            )}
          </ul>
          {showPopOver && (
            <InformationPopOver
              information={popUpData}
              moveToPosition={mousePos}
            />
          )}
        </div>
        {selectedSong ? (
          <div className={`${css.slider} ${toggleClass ? css.close : ""}`}>
            <div className={css.closeIcon}>
              <FontAwesomeIcon
                onClick={() => this.closeOptions()}
                icon={faTimes}
              />
            </div>
            <div className={css.content}>{this.getSelectedContent()}</div>
          </div>
        ) : null}
      </div>
    );
  }
}
