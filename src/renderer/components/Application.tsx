import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";

import * as css from "./app.scss";
import Sidebar from "../components/Sidebar/Sidebar";
import MediaClass from "../Page/Media/Media";
import Playlists from "../Page/Playlists/Playlists";
import CategorieList from "../Page/Categories/Categories";
import Modal from "./Modal/Modal";

const { dialog } = require("electron").remote;
const fs = require("fs");
const app = require("electron").remote.app;

interface Props {}
interface State {
  jsonData: any;
  showModal: boolean;
  loadedFilePath: string;
}

export class Application extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      jsonData: {
        media: [],
        playlist: [],
        categories: [
          { value: 0, label: "Rock" },
          { value: 1, label: "Pop" }
        ]
      },
      showModal: false,
      loadedFilePath: ""
    };
    this.fileWriter = this.fileWriter.bind(this);
    this.showModal = this.showModal.bind(this);
    this.saveCurrentState = this.saveCurrentState.bind(this);
    this.loadStateFile = this.loadStateFile.bind(this);
  }

  refreshData() {
    const { loadedFilePath } = this.state;
    if (loadedFilePath)
      fs.access(loadedFilePath, fs.F_OK, (notExsist: any) => {
        if (!notExsist) {
          this.setState({
            jsonData: JSON.parse(fs.readFileSync(loadedFilePath))
          });
        }
      });
  }

  componentDidMount() {
    this.refreshData();
  }

  fileWriter(jsonData: Object) {
    this.setState({ jsonData });
  }

  showModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  saveCurrentState() {
    const options = {
      defaultPath: app.getPath("desktop") + "/saveFile.json"
    };
    dialog.showSaveDialog(null as any, options, (path: any) => {
      fs.writeFile(path, JSON.stringify(this.state.jsonData), (err: any) => {
        if (err) {
          alert("An error ocurred creating the file." + err.message);
        }
        alert("The file has been succesfully saved.");
      });
    });
  }

  loadStateFile(outerThis: this) {
    dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [
          {
            name: "FooFiles",
            extensions: ["json"]
          }
        ]
      },
      function(files) {
        if (files !== undefined) {
          outerThis.setState({ loadedFilePath: files[0] });
          outerThis.refreshData();
        }
      }
    );
  }

  render() {
    const { jsonData, showModal } = this.state;
    if (jsonData) {
      return (
        <div className={css.container}>
          <Sidebar saveCurrentState={this.saveCurrentState} loadStateFile={this.loadStateFile} showModal={this.showModal} jsonData={jsonData} />
          <HashRouter>
            <Switch>
              <Route path="/playlist/:id" render={(props: any) => <Playlists {...props} updateJSON={this.fileWriter} jsonData={jsonData} />} />
              <Route path="/" component={() => <MediaClass updateJSON={this.fileWriter} jsonData={jsonData} />} />
            </Switch>
          </HashRouter>
          {showModal && <Modal closeModal={this.showModal} title={"Category List"} content={<CategorieList updateJSON={this.fileWriter} jsonData={jsonData} />} />}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default hot(Application);
