import { hot } from "react-hot-loader/root";
import * as React from "react";
import * as css from "./app.scss";
import { Switch, Route, HashRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import SongsClass from "../Page/Songs/Songs";
import Playlists from "../Page/Playlists/Playlists";
import CategorieList from "../Page/Categories/Categories";
import { JJect } from "../Models";
import Modal from "./Modal/Modal";
const fs = require("fs");
const app = require("electron").remote.app;
const path = require("path");
const jsonPath = path.join(app.getPath("userData"), "saveFile.json");

interface Props {}
interface State {
  jsonData: any;
  showModal: boolean;
}

export class Application extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      jsonData: {
        songs: [],
        playlist: [],
        categories: [
          { id: 0, name: "Rock" },
          { id: 1, name: "Pop" }
        ]
      },
      showModal: false
    };
    this.fileWriter = this.fileWriter.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  // refreshData() {
  //   fs.access(jsonPath, fs.F_OK, (notExsist: any) => {
  //     if (notExsist) {
  //       fs.writeFile(
  //         jsonPath,
  //         JSON.stringify({ songs: [], playlist: [], categories: [] }),
  //         (err: any) => {
  //           if (err) {
  //             alert("An error ocurred creating the file " + err.message);
  //           }
  //           this.refreshData();
  //         }
  //       );
  //     } else {
  //       this.setState({ jsonData: JSON.parse(fs.readFileSync(jsonPath)) });
  //     }
  //   });
  // }

  // componentDidMount() {
  //   this.refreshData();
  // }

  fileWriter(path: string, jsonData: Object) {
    // fs.writeFile(path, JSON.stringify(JSONObj), (err: any) => {
    //   if (err) {
    //     alert("An error ocurred creating the file " + err.message);
    //   }
    //   this.refreshData();
    // alert("The file has been succesfully saved");

    this.setState({ jsonData });

    // })
  }

  showModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    const { jsonData } = this.state;
    if (jsonData) {
      return (
        <div className={css.container}>
          <Sidebar showModal={this.showModal} jsonData={jsonData} />
          <HashRouter>
            <Switch>
              <Route
                path="/playlist/:id"
                render={(props: any) => (
                  <Playlists
                    {...props}
                    updateJSON={this.fileWriter}
                    jsonData={jsonData}
                  />
                )}
              />
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
          {this.state.showModal && (
            <Modal
              closeModal={this.showModal}
              title={"Category List"}
              content={
                <CategorieList
                  updateJSON={this.fileWriter}
                  jsonData={jsonData}
                />
              }
            />
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default hot(Application);
