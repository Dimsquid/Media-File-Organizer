import * as React from "react";
import { Songs, Song, MousePosition } from "../../Models";
import * as css from "./songlist.scss";
import mp3 from "../../../images/mp3.svg";
import InformationPopOver from "../InformationPopOver/InformationPopOver";

interface Props {
  mediaJSON: Songs;
  openMediaOptions?: Function;
}

interface State {
  showPopOver: boolean;
  mousePos: MousePosition;
  popUpData: Song;
}

export default class SongListRenderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showPopOver: false,
      mousePos: { left: 0, top: 0 },
      popUpData: {}
    };
  }

  onMouseMove(event: any) {
    const mediaData = this.props.mediaJSON.songs[event.target.id];
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

  render() {
    const { mediaJSON, openMediaOptions } = this.props;
    const { showPopOver, popUpData, mousePos } = this.state;
    return (
      <ul>
        {mediaJSON && mediaJSON.songs != null && mediaJSON.songs.length > 0 ? (
          mediaJSON.songs.map((media: Song) => {
            if (media.extension !== "mp4")
              return (
                <li
                  onMouseMove={e => this.onMouseMove(e)}
                  onMouseLeave={() => {
                    this.onMouseLeave();
                  }}
                  onClick={e => openMediaOptions(e)}
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
        {showPopOver && (
          <InformationPopOver
            information={popUpData}
            moveToPosition={mousePos}
          />
        )}
      </ul>
    );
  }
}
