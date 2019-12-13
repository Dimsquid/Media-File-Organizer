import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faSave } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router";

import * as css from "../page.scss";
import { Media, MousePosition, Playlist, JJect } from "../../Models";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import Modal from "../../components/Modal/Modal";

interface Props {
  match: any;
  jsonData: JJect;
  updateJSON: Function;
}
interface State {
  oldJSONData: any;
  popUpData: Media;
  mousePos: MousePosition;
  showPopOver: boolean;
  deletedReturn: boolean;
  newCategoryObject: any;
  showModal: boolean;
}

export default class Playlists extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      oldJSONData: null,
      popUpData: {},
      mousePos: { left: 0, top: 0 },
      showPopOver: false,
      deletedReturn: false,
      newCategoryObject: null,
      showModal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.saveNewName = this.saveNewName.bind(this);
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

  deletePlaylist(id: number) {
    const { oldJSONData } = this.state;
    const { updateJSON } = this.props;
    if (confirm("Are you sure you would like to delete this playlist?")) {
      if (oldJSONData.playlist[id]) {
        let obj = {
          media: oldJSONData.media,
          playlist: oldJSONData.playlist.filter((playl: Playlist) => playl != oldJSONData.playlist[id]),
          categories: oldJSONData.categories
        };
        updateJSON && updateJSON(obj);
        this.setState({ deletedReturn: true });
      }
    }
  }

  renderEditForm() {
    return (
      <div className={css.nameChangeBar}>
        <li>
          <input onChange={e => this.onChange(e)} placeholder="Change playlist name" type="text" />
          <div className={css.editIcon}>
            <FontAwesomeIcon onClick={this.saveNewName} className={css.icons} icon={faSave} />
          </div>
        </li>
      </div>
    );
  }

  saveNewName() {
    const { newCategoryObject, oldJSONData } = this.state;
    oldJSONData.playlist[this.props.match.params.id].name = newCategoryObject;
    let obj: JJect = {
      media: oldJSONData.media,
      playlist: oldJSONData.playlist,
      categories: oldJSONData.categories
    };
    this.props.updateJSON && this.props.updateJSON(obj);
    this.setState({ showModal: false });
  }

  onChange(e: any) {
    this.setState({ newCategoryObject: e.target.value });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  onMouseLeave() {
    this.setState({ showPopOver: false });
  }

  componentDidMount() {
    this.setState({ oldJSONData: this.props.jsonData });
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
            Playlist: {oldJSONData && oldJSONData.playlist && oldJSONData.playlist[id] && oldJSONData.playlist[id].name}
            <span className={css.deletePlaylist}>
              <span className={css.icons}>
                <FontAwesomeIcon onClick={this.toggleModal} icon={faPen} />
              </span>
              <span className={css.icons}>
                <FontAwesomeIcon onClick={() => this.deletePlaylist(id)} icon={faTrash} />
              </span>
            </span>
          </h1>
          <div className={css.mediaHolder}>
            <ul>
              {oldJSONData && oldJSONData.playlist && oldJSONData.playlist[id] && oldJSONData.playlist[id].media && oldJSONData.playlist[id].media.length > 0 ? (
                oldJSONData.playlist[id].media.map((media: Media) => {
                  return (
                    <li onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} className={css.thumbNail} key={`${media.fileName}_${media.id}`} id={media.id + ""}>
                      <span className={css.floatingText}>{media.fileName}</span>
                      <img src={media.image} />
                    </li>
                  );
                })
              ) : (
                <li>You havent saved any media files</li>
              )}
            </ul>
          </div>
          {showPopOver && <InformationPopOver information={popUpData} moveToPosition={mousePos} />}
          {this.state.showModal && <Modal closeModal={this.toggleModal} title={"Edit Playlist Name"} content={<ul>{this.renderEditForm()}</ul>} />}
        </div>
      );
    }
  }
}
