import * as React from "react";
import * as css from "../page.scss";

interface Props {}

export default class Dashboard extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <div className={css.container}>Dashboard</div>;
  }
}
