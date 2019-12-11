import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";

import * as css from "./app.scss";

import Application from "./components/Application";
import store from "./store";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);
document.body.className = css.initialClass;

// Render components
function render() {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Application />
      </Provider>
    </AppContainer>,
    mainElement
  );
}

render();
store.subscribe(render);
