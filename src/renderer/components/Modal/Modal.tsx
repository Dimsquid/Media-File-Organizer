import * as React from "react";
import * as css from "./modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Props {
  title?: string;
  content?: any;
  showButtons?: boolean;
  closeModal?: Function;
  saveButton?: Function;
}

interface State {}

export default class Modal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { title, content } = this.props;
    return (
      <div className={css.overlay}>
        <div className={css.modalBody}>
          <div className={css.topBar}>
            <div className={css.modalTitle}>{title}</div>
            <div className={css.closeIcon}>
              <FontAwesomeIcon onClick={e => this.props.closeModal && this.props.closeModal(e)} icon={faTimes} />
            </div>
          </div>
          <div className={css.content}>{content}</div>
          {this.props.showButtons ? (
            <div className={css.footer}>
              <div className={css.buttonHolder}>
                <button onClick={e => this.props.saveButton && this.props.saveButton(e)}>Save</button>
                <button onClick={e => this.props.closeModal && this.props.closeModal(e)}>Close</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
