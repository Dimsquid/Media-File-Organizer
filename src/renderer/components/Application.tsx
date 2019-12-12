import { hot } from "react-hot-loader/root";
import * as React from "react";
import * as css from "./app.scss";
import { Switch, Route, HashRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import SongsClass from "../Page/Songs/Songs";
import Playlists from "../Page/Playlists/Playlists";
import Categories from "../Page/Categories/Categories";
import { JJect } from "../Models";
const fs = require("fs");
const app = require("electron").remote.app;
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "saveFile.json");

interface Props {}
interface State {
  jsonData: any;
}

export class Application extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      jsonData: null
    };
    this.fileWriter = this.fileWriter.bind(this);
  }

  refreshData() {
    fs.access(jsonPath, fs.F_OK, (notExsist: any) => {
      if (notExsist) {
        fs.writeFile(
          jsonPath,
          JSON.stringify({ songs: [], playlist: [] }),
          (err: any) => {
            if (err) {
              alert("An error ocurred creating the file " + err.message);
            }
            this.refreshData();
          }
        );
      } else {
        this.setState({ jsonData: JSON.parse(fs.readFileSync(jsonPath)) });
      }
    });
  }

  componentDidMount() {
    this.refreshData();
  }

  fileWriter(path: string, JSONObj: Object) {
    fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      this.refreshData();
      // alert("The file has been succesfully saved");
    });
  }

  render() {
    const { jsonData } = this.state;
    if (jsonData) {
      return (
        <div className={css.container}>
          <Sidebar jsonData={jsonData} />
          <HashRouter>
            <Switch>
              <Route
                path="/playlist/:id"
                component={(props: any) => (
                  <Playlists
                    {...props}
                    updateJSON={this.fileWriter}
                    match
                    jsonData={jsonData}
                  />
                )}
              />
              <Route path="/categories" component={Categories} />
              <Route
                path="/"
                component={() => (
                  <SongsClass
                    updateJSON={this.fileWriter}
                    jsonData={jsonData}
                  />
                )}
              />
            </Switch>
          </HashRouter>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default hot(Application);
