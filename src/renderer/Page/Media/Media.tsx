import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

import * as css from "../page.scss";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import fileIcon from "../../../images/file.svg";
import { Media, MousePosition, Playlist, JJect, ModalType, Category } from "../../Models";
import { deleteMedia } from "../../containers/FileFunctions";
import Modal from "../../components/Modal/Modal";

const fs = require("fs");
const { dialog } = require("electron").remote;

interface Props {
  jsonData: JJect;
  updateJSON: Function;
}

interface MediaState {
  popUpData: Media;
  mousePos: MousePosition;
  showPopOver: boolean;
  openedFileData: Media;
  oldJSONData: any;
  toggleClass: boolean;
  selectedMedia: number;
  showCreate: boolean;
  newPlaylistObject: Playlist;
  modalType: ModalType;
  selectedCategory: any;
  selectedMediaType: any;
}

export default class MediaClass extends React.Component<Props, MediaState> {
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
      selectedMedia: NaN,
      showCreate: false,
      newPlaylistObject: { id: 0, name: "", media: [] },
      modalType: ModalType.Null,
      selectedCategory: null,
      selectedMediaType: { id: null, label: null }
    };
    this.openFile = this.openFile.bind(this);
    this.playNameChange = this.playNameChange.bind(this);
    this.catergoryChange = this.catergoryChange.bind(this);
    this.mediaChange = this.mediaChange.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
  }

  onMouseMove(event: any) {
    const mediaData = this.state.oldJSONData.media[event.target.id];
    if (mediaData) {
      const allData: Media = {
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

  onChange(e: any) {
    const value = e.target.value ? e.target.value : "";
    console.log(this.state.selectedCategory);
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
          outsideThis.setModalType(ModalType.AddMedia);
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
      case ModalType.AddMedia:
        this.addNewMedia();
        break;
      case ModalType.ChooseMediaTypes:
        this.openFile(this);
        break;
    }
  }

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
      case ModalType.AddMedia:
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
      case ModalType.AddMediaToPlaylist:
        return (
          <ul className={css.addMediaList}>
            {oldJSONData.playlist && oldJSONData.playlist.length > 0 ? (
              oldJSONData.playlist.map((playl: Playlist) => {
                return (
                  <li className={css.thumbNail} key={`${playl.name}_${playl.id}`} id={playl.id + ""} onClick={e => this.addMediaToPlaylist(e)}>
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

  addNewMedia() {
    const { selectedCategory, openedFileData, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    const mediaIndexStartingPoint = oldJSONData.media.length;

    if (oldJSONData.media.some((media: Media) => media.filePath === openedFileData.filePath)) {
      alert("File already added to organiser..");
    } else {
      oldJSONData.media.push({
        id: mediaIndexStartingPoint,
        fileName: openedFileData.fileName,
        filePath: openedFileData.filePath,
        extension: openedFileData.extension,
        comment: openedFileData.comment,
        categories: selectedCategory,
        image: fileIcon
      });
    }
    updateJSON && updateJSON(oldJSONData);
    this.setState({ openedFileData: {}, selectedCategory: {} });
    this.setModalType(ModalType.Null);
  }

  deleteItem() {
    const { selectedMedia, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    updateJSON && updateJSON(deleteMedia(oldJSONData, selectedMedia));
    this.setState({ selectedMedia: NaN });
  }

  addMediaToPlaylist(e: any) {
    const { selectedMedia, oldJSONData } = this.state;
    const { updateJSON } = this.props;
    let newestObj = oldJSONData.media[selectedMedia];

    if (oldJSONData.playlist[e.target.id] && oldJSONData.playlist[e.target.id].media && oldJSONData.playlist[e.target.id].media.length > oldJSONData.media[selectedMedia].id) {
      newestObj = Object.assign({}, oldJSONData.media[selectedMedia], {
        id: oldJSONData.playlist[e.target.id].media.length
      });
    } else {
      newestObj = Object.assign({}, oldJSONData.media[selectedMedia], {
        id: 0
      });
      oldJSONData.playlist[e.target.id].media.push(newestObj);
      updateJSON && updateJSON(oldJSONData);
      this.setState({
        selectedMedia: NaN
      });
      return;
    }
    oldJSONData.playlist[e.target.id].media.map((media: any) => {
      if (oldJSONData.media[selectedMedia].filePath != media.filePath) {
        oldJSONData.playlist[e.target.id].media.push(newestObj);
        updateJSON && updateJSON(oldJSONData);
      } else {
        alert("File already added to this playlist..");
      }
    });

    this.setState({
      selectedMedia: NaN
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

  addImageToFile(outsideThis: this) {
    const { selectedMedia, oldJSONData } = this.state;
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            name: "FooFiles",
            extensions: ["jpg", "png"]
          }
        ]
      },
      function(files) {
        if (files !== undefined) {
          oldJSONData.media[selectedMedia].image = "data:image/jpg;base64," + fs.readFileSync(files[0]).toString("base64");
          let obj: JJect = {
            media: oldJSONData.media,
            playlist: oldJSONData.playlist,
            categories: oldJSONData.categories
          };
          outsideThis.props.updateJSON && outsideThis.props.updateJSON(obj);
        }
      }
    );
  }

  editComment(e: any) {
    const { selectedMedia, oldJSONData } = this.state;
    if (e.key === "Enter") {
      oldJSONData.media[selectedMedia].comment = e.target.value;
      let obj: JJect = {
        media: oldJSONData.media,
        playlist: oldJSONData.playlist,
        categories: oldJSONData.categories
      };
      this.props.updateJSON && this.props.updateJSON(obj);
    }
  }

  getSelectedContent() {
    const { oldJSONData, selectedMedia } = this.state;
    if (oldJSONData && oldJSONData.media && oldJSONData.media[selectedMedia]) {
      const initialValue = oldJSONData.media[selectedMedia].comment;
      return (
        <div className={css.builtContent}>
          {oldJSONData.media[selectedMedia].fileName}
          <div className={css.buttonHolder}>
            <button onClick={() => this.setModalType(ModalType.AddMediaToPlaylist)}>
              Add to playlist <FontAwesomeIcon icon={faPlus} />
            </button>
            <button onClick={() => this.deleteItem()} className={css.deleteMedia}>
              Delete media <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
          <div className={css.editMedia}>
            <div onClick={() => this.addImageToFile(this)} className={css.thumbNail}>
              <img src={oldJSONData.media[selectedMedia].image} />
            </div>
            <div className={css.fileDetails}>
              <table className={css.editAbleOptions}>
                <tr>
                  <td>File Name:</td>
                  <td>{oldJSONData.media[selectedMedia].fileName}</td>
                </tr>
                <tr>
                  <td>File Type:</td>
                  <td>{oldJSONData.media[selectedMedia].extension}</td>
                </tr>
                <tr>
                  <td>File Location:</td>
                  <td>{oldJSONData.media[selectedMedia].filePath}</td>
                </tr>
                <tr>
                  <td>Comment:</td>
                  <td>
                    <input type="text" onKeyPress={e => this.editComment(e)} placeholder={initialValue} />
                  </td>
                </tr>
                <tr>
                  <td>Category:</td>
                  <td>
                    {oldJSONData.media[selectedMedia].categories &&
                      oldJSONData.media[selectedMedia].categories.map((category: Category) => {
                        return category.label;
                      })}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }

  componentDidMount() {
    this.setState({ oldJSONData: this.props.jsonData });
  }

  onMouseLeave() {
    this.setState({ showPopOver: false });
  }
  catergoryChange = (selectedCategory: any) => {
    this.setState({ selectedCategory: selectedCategory });
  };

  toggleOptions(e: any) {
    this.setState({ toggleClass: !this.state.toggleClass, selectedMedia: this.state.toggleClass ? e.target.id : NaN });
  }

  toggleCreatePlaylist() {
    this.setState({ showCreate: !this.state.showCreate });
  }

  setModalType(modalType: ModalType) {
    this.setState({ modalType });
  }

  render() {
    const { showPopOver, mousePos, popUpData, oldJSONData, toggleClass, modalType } = this.state;

    let modalTitle;
    switch (modalType) {
      case ModalType.CreatePlaylist:
        modalTitle = "Create Playlist";
        break;
      case ModalType.AddMedia:
        modalTitle = "Add Media File";
        break;
      case ModalType.AddMediaToPlaylist:
        modalTitle = "Add Media to Playlist";
        break;
      case ModalType.ChooseMediaTypes:
        modalTitle = "Choose File Type";
        break;
      default:
        modalTitle = "";
        break;
    }

    return (
      <div className={css.container}>
        {modalType != ModalType.Null && (
          <Modal
            title={modalTitle}
            content={this.modalBodyContent()}
            closeModal={() => this.setModalType(ModalType.Null)}
            saveButton={() => this.saveButton()}
            showButtons={true}
          />
        )}
        <h1>Media Files</h1>
        <div className={css.buttonHolder}>
          <button onClick={() => this.setModalType(ModalType.ChooseMediaTypes)}>
            <span className={css.floatingText}>Add a new file</span>
          </button>
          <button onClick={() => this.setModalType(ModalType.CreatePlaylist)}>
            <span className={css.floatingText}>Create new playlist</span>
          </button>
        </div>
        <div className={css.mediaHolder}>
          <ul>
            {oldJSONData && oldJSONData.media != null && oldJSONData.media.length > 0 ? (
              oldJSONData.media.map((media: Media) => {
                return (
                  <li
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                    onClick={this.toggleOptions}
                    className={css.thumbNail}
                    key={`${media.fileName}_${media.id}`}
                    id={media.id + ""}>
                    <span className={css.floatingText}>{media.fileName}</span>
                    <img src={media.image} />
                  </li>
                );
              })
            ) : (
              <li>You havent saved any media files</li>
            )}
          </ul>
          {showPopOver && <InformationPopOver information={popUpData} moveToPosition={mousePos} />}
        </div>
        <div className={`${css.slider} ${toggleClass ? css.close : ""}`}>
          <div className={css.closeIcon}>
            <FontAwesomeIcon onClick={this.toggleOptions} icon={faTimes} />
          </div>
          <div className={css.content}>{this.getSelectedContent()}</div>
        </div>
      </div>
    );
  }
}
