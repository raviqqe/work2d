import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import createStore from "../../redux";
import App from "../App";

it("renders without crashing", () => {
    ReactDOM.render(
        <Provider store={createStore()}><App /></Provider>,
        document.createElement("div"));
});
