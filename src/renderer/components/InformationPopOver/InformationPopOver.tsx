import * as React from "react";
import { Song, MousePosition } from "../../Models";
import * as css from "./informationpopover.scss";

interface Props {
  information: Song;
  moveToPosition: MousePosition;
}
interface State {
  moveToPosition: any;
}

export default class InformationPopOver extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      moveToPosition: { left: -10, top: -10 }
    };
  }

  render() {
    return (
      <div
        style={{
          top: this.props.moveToPosition.top,
          left: this.props.moveToPosition.left
        }}
        className={css.popOverContainer}>
        <div className={css.title}>Information</div>
        <div className={css.content}>
          <div>Media name: {this.props.information.fileName}</div>
          <div>File Type: {this.props.information.extension}</div>
          <div>
            Comment:
            {this.props.information.comment ? ` ${this.props.information.comment}` : ""}
          </div>
          <div>
            Categories:
            {this.props.information.categories &&
              this.props.information.categories.map(element => {
                return <li key={`${element.value}_${element.label}`}>{element.label}</li>;
              })}
          </div>
        </div>
      </div>
    );
  }
}
