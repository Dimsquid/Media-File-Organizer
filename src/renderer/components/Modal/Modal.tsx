import * as React from "react";
import * as css from "./modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface Props {
  showModal: boolean;
  title?: string;
  content?: any;
}

interface State {
  showModal: boolean;
}

export default class Modal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      showModal: true
    };
  }

  componentWillReceiveProps() {
    this.setState({ showModal: this.props.showModal });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { title, content } = this.props;
    return this.state.showModal ? (
      <div className={css.overlay}>
        <div className={css.modalBody}>
          <div className={css.topBar}>
            <div className={css.modalTitle}>{title}</div>
            <div className={css.closeIcon}>
              <FontAwesomeIcon onClick={this.closeModal} icon={faTimes} />
            </div>
          </div>
          <div className={css.content}>{content}</div>
        </div>
      </div>
    ) : null;
  }
}
