import * as React from "react";
import * as css from "../page.scss";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import mp3 from "../../../images/mp3.svg";
import { Song, MousePosition } from "../../Models";
import Modal from "../../components/Modal/Modal";
var data = require("../../../saveFolder/saveFile.json");
const { dialog } = require("electron").remote;
const fs = require("fs");

interface Props {
  songs?: any;
}

interface SongState {
  popUpData: Song;
  mousePos: MousePosition;
  showPopOver: boolean;
  showModal: boolean;
  openedFileData: Song;
}

export default class Songs extends React.Component<Props, SongState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popUpData: { id: 0, fileName: "", filePath: "", extension: "" },
      mousePos: { left: 0, top: 0 },
      showPopOver: false,
      showModal: false,
      openedFileData: { id: 0, fileName: "", filePath: "", extension: "" }
    };
    this.closeModal = this.closeModal.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  onMouseMove(event: any) {
    const mediaData = data.songs[event.target.id];
    if (mediaData) {
      const allData: Song = {
        fileName: mediaData.fileName,
        filePath: mediaData.filePath,
        extension: mediaData.extension,
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
    this.setState({ showModal: !this.state.showModal });
  }

  fileWriter(path: string, JSONObj: Object) {
    fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      this.closeModal();
      // alert("The file has been succesfully saved");
    });
  }

  addNewSong() {
    let obj: Songs = {
      //@ts-ignore
      songs: []
    };
    const jsonPath = "./src/saveFolder/saveFile.json";
    const { openedFileData } = this.state;
    fs.access(jsonPath, fs.F_OK, (notExsist: any) => {
      if (notExsist) {
        this.fileWriter(jsonPath, obj);
      } else {
        const songIndexStartingPoint = data.songs.length;
        data.songs.map((song: any) => {
          //@ts-ignore
          obj.songs.push(song);
        });
        //@ts-ignore
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

  render() {
    const {
      showModal,
      showPopOver,
      mousePos,
      popUpData,
      openedFileData
    } = this.state;

    console.log(openedFileData.comment);
    return (
      <div
        style={{ pointerEvents: showModal ? "none" : "all" }}
        className={css.container}
      >
        {this.state.showModal && (
          <Modal
            title={"Add songs"}
            content={this.modalBodyContent()}
            closeModal={() => this.closeModal()}
            saveButton={() => this.addNewSong()}
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
            {data && data.songs.length > 0 ? (
              data.songs.map((media: Song) => {
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
                      <span className={css.floatingText}>
                        {media.fileName} {media.id}
                      </span>
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
      </div>
    );
  }
}
