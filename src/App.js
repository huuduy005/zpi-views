import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./containers/Home/Home";
import Statistics from "./containers/Statistics/Statistics";
import "./App.css";

function App() {
  return (
    <Router>
        <div
            className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
            <h5 className="my-0 mr-md-auto font-weight-normal">ZPI-SPA</h5>
            <nav className="my-2 my-md-0 mr-md-3">
                <Link className="p-2 text-dark" to="/">Home</Link>
                <Link className="p-2 text-dark" to="statistics">Statistics</Link>
            </nav>
        </div>
      <Switch>
          <Route path="/statistics" component={Statistics} />
          <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
