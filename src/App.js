
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

import Home from "./pages/Home";
import Form from "./pages/Form";
import Practice from "./pages/Practice";
import NotFounded from "./pages/NotFounded";
import SignUp from "./pages/SignUp";


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/signup" component={SignUp} />
            <Route path="/worksheets/:id/edit" component={Form} />
            <Route path="/worksheets/:id/practice" component={Practice} />
            <Route path="*" component={NotFounded} />
          </Switch>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
