import * as React from "react";
import * as css from "../page.scss";
import InformationPopOver from "../../components/InformationPopOver/InformationPopOver";
import mp3 from "../../../images/mp3.svg";
import { Song } from "../../Models";
var data = require("../../../../saveFile.json");

interface Props {
  songs?: any;
}

interface SongState {
  popUpData: any[];
}

export default class Songs extends React.Component<Props, SongState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popUpData: []
    };
  }

  mouseOverItem(event) {
    const mediaData = data.songs[event.target.id];
    const allData = [
      {
        fileName: mediaData.fileName,
        filePath: mediaData.filePath,
        extenstion: mediaData.extension
      }
    ];

    this.setState({ popUpData: allData });
    console.log(this.state.popUpData);
  }

  render() {
    return (
      <div className={css.container}>
        <h1>Songs</h1>
        <div className={css.songHolder}>
          <ul>
            {data.songs.map((media: Song) => {
              if (media.extension !== "mp4" || media.extension !== "jpg")
                return (
                  <li
                    onMouseEnter={e => this.mouseOverItem(e)}
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
            })}
          </ul>
          <InformationPopOver information={this.state.popUpData} />
        </div>
      </div>
    );
  }
}
