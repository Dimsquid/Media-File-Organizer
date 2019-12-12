import * as React from "react";
import * as css from "../page.scss";

import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import fileIcon from "../../../images/file.svg";
import { Song, MousePosition, Playlist, JJect, ModalType } from "../../Models";
import { deleteSong } from "../../containers/FileFunctions";
import Modal from "../../components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const { dialog } = require("electron").remote;

interface Props {
  jsonData: JJect;
  updateJSON: Function;
}

interface SongState {
  popUpData: Song;
  mousePos: MousePosition;
  showPopOver: boolean;
  openedFileData: Song;
  oldJSONData: any;
  toggleClass: boolean;
  selectedSong: number;
  showPlaylistModal: boolean;
  showCreate: boolean;
  newPlaylistObject: Playlist;
  modalType: ModalType;
  selectedCategory: any;
  selectedMediaType: any;
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
      openedFileData: {
        id: 0,
        fileName: "",
        filePath: "",
        extension: "",
        categories: []
      },
      oldJSONData: null,
      toggleClass: true,
      selectedSong: NaN,
      showPlaylistModal: false,
      showCreate: false,
      newPlaylistObject: { id: 0, name: "", songs: [] },
      modalType: ModalType.Null,
      selectedCategory: null,
      selectedMediaType: { id: null, label: null }
    };
    this.openFile = this.openFile.bind(this);
    this.playNameChange = this.playNameChange.bind(this);
    this.catergoryChange = this.catergoryChange.bind(this);
    this.mediaChange = this.mediaChange.bind(this);
  }

  componentDidMount() {
    this.setState({ oldJSONData: this.props.jsonData });
  }

  onMouseMove(event: any) {
    const mediaData = this.state.oldJSONData.songs[event.target.id];
    if (mediaData) {
      const allData: Song = {
        fileName: mediaData.fileName,
        filePath: mediaData.filePath,
        extension: mediaData.extension,
        comment: mediaData.comment ? mediaData.comment : "",
        categories: mediaData.categories,
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
        comment: value,
        categories: this.state.selectedCategory
      },
      popUpData: {
        ...prevState.popUpData,
        comment: value,
        categories: this.state.selectedCategory
      }
    }));
  }

  openFile(outsideThis: this) {
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            name: "FooFiles",
            extensions: [this.state.selectedMediaType.label]
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
          outsideThis.setModalType(ModalType.AddSong);
        }
      }
    );
  }

  saveButton() {
    const { modalType, newPlaylistObject } = this.state;
    switch (modalType) {
      case ModalType.CreatePlaylist:
        if (newPlaylistObject.name && newPlaylistObject.name.trim() == "") {
          alert("You need to enter a name");
        } else {
          this.createNewPlaylist();
        }
        break;
      case ModalType.AddSong:
        this.addNewSong();
        break;
      case ModalType.ChooseMediaTypes:
        this.openFile(this);
        break;
    }
  }

  catergoryChange = (selectedCategory: any) => {
    this.setState({ selectedCategory: selectedCategory });
  };

  modalBodyContent() {
    const { openedFileData, modalType, oldJSONData, selectedCategory, selectedMediaType } = this.state;
    switch (modalType) {
      case ModalType.CreatePlaylist:
        return (
          <div className={css.createPlaylistModal}>
            <h4>Type a name for your playlist</h4>
            <input onChange={e => this.playNameChange(e)} type="text" />
          </div>
        );
      case ModalType.AddSong:
        return (
          <div className={css.modalBody}>
            <div>Chosen File: {openedFileData.fileName}</div>
            <br />
            <div>Extension Type: {openedFileData.extension}</div>
            <br />
            <div>File Path: {openedFileData.filePath}</div>
            <br />
            <br />
            <Select
              isMulti={true}
              placeholder={"Select categories"}
              className={css.selectBox}
              value={selectedCategory}
              onChange={this.catergoryChange}
              options={oldJSONData.categories}
            />
            <br />
            <div className={css.inputHolder}>
              <input onChange={e => this.onChange(e)} placeholder="Here you can add a comment about the file" type="text" />
            </div>
          </div>
        );
      case ModalType.AddSongToPlaylist:
        return (
          <ul className={css.addSongsList}>
            {oldJSONData.playlist && oldJSONData.playlist.length > 0 ? (
              oldJSONData.playlist.map((playl: Playlist) => {
                return (
                  <li className={css.thumbNail} key={`${playl.name}_${playl.id}`} id={playl.id + ""} onClick={e => this.addSongToPlaylist(e)}>
                    <span className={css.floatingText}>{playl.name}</span>
                  </li>
                );
              })
            ) : (
              <div>
                <li>You have no playlists</li>
                {!this.state.showCreate ? (
                  <li onClick={() => this.setModalType(ModalType.CreatePlaylist)}>
                    Create new playlist <FontAwesomeIcon icon={faPlus} />
                  </li>
                ) : (
                  <div>
                    <input onChange={e => this.playNameChange(e)} placeholder="Playlist name" type="text" />
                    <button onClick={() => this.createNewPlaylist()}>Create</button>
                  </div>
                )}
              </div>
            )}
          </ul>
        );
      case ModalType.ChooseMediaTypes:
        const options = [
          { value: 0, label: "AAC" },
          { value: 1, label: "MP3" },
          { value: 2, label: "WAV" },
          { value: 3, label: "MP4" },
          { value: 4, label: "AVI" },
          { value: 5, label: "SWF" }
        ];
        return (
          <div className={css.mediaFileSelector}>
            <h4>Select what file type you would like to import.</h4>
            <Select placeholder={"Select file type"} className={css.selectBox} value={selectedMediaType} onChange={this.mediaChange} options={options} />
          </div>
        );

      default:
        return <div>Modal Type of NULL</div>;
    }
  }

  mediaChange = (selectedMediaType: any) => {
    this.setState({
      selectedMediaType: {
        id: selectedMediaType.value,
        label: selectedMediaType.label
      }
    });
  };

  addNewSong() {
    const { openedFileData, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    const songIndexStartingPoint = oldJSONData.songs.length;

    if (oldJSONData.songs.some((song: Song) => song.filePath === openedFileData.filePath)) {
      alert("File already added to organiser..");
    } else {
      oldJSONData.songs.push({
        id: songIndexStartingPoint,
        fileName: openedFileData.fileName,
        filePath: openedFileData.filePath,
        extension: openedFileData.extension,
        comment: openedFileData.comment,
        categories: openedFileData.categories
      });
    }
    updateJSON && updateJSON(oldJSONData);
    this.setState({ openedFileData: {} });
    this.setModalType(ModalType.Null);
  }

  deleteItem() {
    const { selectedSong, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    updateJSON && updateJSON(deleteSong(oldJSONData, selectedSong));
    this.setState({ selectedSong: NaN });
  }

  addSongToPlaylist(e: any) {
    const { selectedSong, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    let newestObj = oldJSONData.songs[selectedSong];

    if (oldJSONData.playlist[e.target.id] && oldJSONData.playlist[e.target.id].songs.length > oldJSONData.songs[selectedSong].id) {
      newestObj = Object.assign({}, oldJSONData.songs[selectedSong], {
        id: oldJSONData.playlist[e.target.id].songs.length
      });
    } else {
      newestObj = Object.assign({}, oldJSONData.songs[selectedSong], {
        id: 0
      });
      oldJSONData.playlist[e.target.id].songs.push(newestObj);
      updateJSON && updateJSON(oldJSONData);
      this.setState({
        selectedSong: NaN,
        showPlaylistModal: !this.state.showPlaylistModal
      });
      return;
    }
    oldJSONData.playlist[e.target.id].songs.map((song: any) => {
      if (oldJSONData.songs[selectedSong].filePath != song.filePath) {
        oldJSONData.playlist[e.target.id].songs.push(newestObj);
        updateJSON && updateJSON(oldJSONData);
      } else {
        alert("File already added to this playlist..");
      }
    });

    this.setState({
      selectedSong: NaN,
      showPlaylistModal: !this.state.showPlaylistModal
    });
  }

  createNewPlaylist() {
    const { oldJSONData, newPlaylistObject } = this.state;
    const { updateJSON } = this.props;
    oldJSONData.playlist.push(newPlaylistObject);
    updateJSON && updateJSON(oldJSONData);
    this.setState({ modalType: ModalType.Null });
  }

  playNameChange(e: any) {
    const { oldJSONData } = this.state;
    const value = e.target.value ? e.target.value : "";
    const id = oldJSONData && oldJSONData.playlist && oldJSONData.playlist.length ? oldJSONData.playlist.length : 0;
    this.setState(prevState => ({
      newPlaylistObject: {
        ...prevState.newPlaylistObject,
        name: value,
        id
      }
    }));
  }

  getSelectedContent() {
    const { oldJSONData, selectedSong } = this.state;
    if (oldJSONData && oldJSONData.songs && oldJSONData.songs[selectedSong]) {
      return (
        <div className={css.builtContent}>
          {oldJSONData.songs[selectedSong].fileName}
          <div className={css.buttonHolder}>
            <button onClick={() => alert("Remember to add")} className={css.editMedia}>
              Edit information <FontAwesomeIcon icon={faPen} />
            </button>
            <button onClick={() => this.setModalType(ModalType.AddSongToPlaylist)}>
              Add to playlist <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={() => this.deleteItem()} className={css.deleteMedia}>
              Delete media <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      );
    }
  }

  toggleOptions(e: any) {
    this.setState({
      toggleClass: !this.state.toggleClass,
      selectedSong: this.state.toggleClass ? e.target.id : NaN
    });
  }

  togglePlaylistModal() {
    this.setState({ showPlaylistModal: !this.state.showPlaylistModal });
  }

  toggleCreatePlaylist() {
    this.setState({ showCreate: !this.state.showCreate });
  }

  setModalType(modalType: ModalType) {
    this.setState({ modalType });
  }

  render() {
    const { showPopOver, mousePos, popUpData, oldJSONData, toggleClass, showPlaylistModal, modalType } = this.state;

    let modalTitle;
    switch (modalType) {
      case ModalType.CreatePlaylist:
        modalTitle = "Create Playlist";
        break;
      case ModalType.AddSong:
        modalTitle = "Add Media File";
        break;
      case ModalType.AddSongToPlaylist:
        modalTitle = "Add Song to Playlist";
        break;
      case ModalType.ChooseMediaTypes:
        modalTitle = "Choose File Type";
        break;
      default:
        modalTitle = "";
        break;
    }

    return (
      <div
        style={{
          pointerEvents: modalType != ModalType.Null || showPlaylistModal ? "none" : "all"
        }}
        className={css.container}>
        {modalType != ModalType.Null && (
          <Modal
            title={modalTitle}
            content={this.modalBodyContent()}
            closeModal={() => this.setModalType(ModalType.Null)}
            saveButton={() => this.saveButton()}
            showButtons={true}
          />
        )}
        <h1>Songs</h1>
        <div className={css.buttonHolder}>
          <button onClick={() => this.setModalType(ModalType.ChooseMediaTypes)}>
            <span className={css.floatingText}>Add a new file</span>
          </button>
          <button onClick={() => this.setModalType(ModalType.CreatePlaylist)}>
            <span className={css.floatingText}>Create new playlist</span>
          </button>
        </div>
        <div className={css.songHolder}>
          <ul>
            {oldJSONData && oldJSONData.songs != null && oldJSONData.songs.length > 0 ? (
              oldJSONData.songs.map((media: Song) => {
                return (
                  <li
                    onMouseMove={e => this.onMouseMove(e)}
                    onMouseLeave={() => {
                      this.onMouseLeave();
                    }}
                    onClick={e => this.toggleOptions(e)}
                    className={css.thumbNail}
                    key={`${media.fileName}_${media.id}`}
                    id={media.id + ""}>
                    <span className={css.floatingText}>{media.fileName}</span>
                    <img src={fileIcon} />
                  </li>
                );
              })
            ) : (
              <li>You havent saved any songs</li>
            )}
          </ul>
          {showPopOver && <InformationPopOver information={popUpData} moveToPosition={mousePos} />}
        </div>
        <div className={`${css.slider} ${toggleClass ? css.close : ""}`}>
          <div className={css.closeIcon}>
            <FontAwesomeIcon onClick={e => this.toggleOptions(e)} icon={faTimes} />
          </div>
          <div className={css.content}>{this.getSelectedContent()}</div>
        </div>
      </div>
    );
  }
}
