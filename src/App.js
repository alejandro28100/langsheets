import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Form from "./pages/Form";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import NotFounded from "./pages/NotFounded";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import SyncEditor from "./pages/SyncEditor";
import Activities from "./pages/Activities";

function App() {
  return (
    <ChakraProvider theme={theme} >
      <div className="App">
        <Router>
          <Switch>
            <Route path="/activities" component={Activities} />
            <Route path="/test" component={SyncEditor} />
            <Route exact path="/" component={Home} />
            <PrivateRoute path="/dashboard" redirectTo="/login" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/worksheets/:id/edit" type="user" redirectTo="/login" component={Form} />
            <Route path="/worksheets/:id/practice" component={Practice} />
            <Route path="*" component={NotFounded} />
          </Switch>
        </Router>
      </div>
    </ChakraProvider >

  );
}

export default App;
