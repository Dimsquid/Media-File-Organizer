import * as React from "react";

interface Props {
  information: [];
}

export default class InformationPopOver extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div>{this.props.information}</div>;
  }
}
