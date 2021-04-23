import './App.css';
import Home from "./pages/Home";
import NotFounded from "./pages/NotFounded";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="*" component={NotFounded} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
