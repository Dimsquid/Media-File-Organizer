import * as React from "react";

interface Props {
  match: any;
}

export default class Playlists extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <h2>{this.props.match.params.id}</h2>;
  }
}
