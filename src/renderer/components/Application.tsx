import { hot } from "react-hot-loader/root";
import * as React from "react";
import * as css from "./app.scss";
import { Switch, Route, HashRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Songs from "../Page/Songs/Songs";
import Playlists from "../Page/Playlists/Playlists";
import Categories from "../Page/Categories/Categories";
import Dashboard from "../Page/Dashboard/Dashboard";
import { connect } from "react-redux";
import { mediaReceived, receiveMedia } from "../Page/Songs/Actions";

interface Props {
  // songs?: any;
  // receiveMedia?: Function;
}

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
            <Route path="/songs" component={() => <Songs />} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

// const mapStateToProps = (state: any) => {
//   return {
//     songs: mediaReceived(state).payload.globals
//   };
// };
// const mapDispatchToProps = {
//   receiveMedia
// };
// export default connect(mapStateToProps, mapDispatchToProps)(hot(Application));
export default hot(Application);
