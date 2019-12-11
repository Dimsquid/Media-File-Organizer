import { hot } from "react-hot-loader/root";
import * as React from "react";
import * as css from "./app.scss";
import { Switch, Route, HashRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import SongsClass from "../Page/Songs/Songs";
import Playlists from "../Page/Playlists/Playlists";
import Categories from "../Page/Categories/Categories";

interface Props {}

export class Application extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={css.container}>
        <Sidebar />
        <HashRouter>
          <Switch>
            <Route path="/playlist/:id" component={Playlists} />
            <Route path="/categories" component={Categories} />
            <Route path="/" component={SongsClass} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default hot(Application);
