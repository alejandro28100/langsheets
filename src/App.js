import './App.css';

import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages/Home";
import Form from "./pages/Form";
import Practice from "./pages/Practice";
import NotFounded from "./pages/NotFounded";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/worksheets/:id/edit" component={Form} />
            <Route path="/worksheets/:id/practice" component={Practice} />
            <Route path="*" component={NotFounded} />
          </Switch>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
