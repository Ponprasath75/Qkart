import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import ThemeProvider from "./theme";
import React, { useState } from "react";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/register"><Register /></Route> 
      <Route exact path="/"> <Products /></Route> 
      <Route path="/login" ><Login /></Route> 
      </Switch>
      {/* <React.StrictMode> */}
      {/* <ThemeProvider> */}
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          {/* <Login /> */}
          {/* </ThemeProvider> */}
        {/* </React.StrictMode> */}
    </div>
  );
}

export default App;
