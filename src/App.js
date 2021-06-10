
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Form from "./pages/Form";
import Practice from "./pages/Practice";
import NotFounded from "./pages/NotFounded";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { useUser } from "./context/UserContext";

function App() {
  const { loading } = useUser();
  return (
    !loading && (
      <ChakraProvider theme={theme} >
        <div className="App">
          <Router>
            <Switch>
              <PrivateRoute exact path="/" type="user" redirectTo="/login" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <PrivateRoute path="/worksheets/:id/edit" type="user" redirectTo="/login" component={Form} />
              <Route path="/worksheets/:id/practice" component={Practice} />
              <Route path="*" component={NotFounded} />
            </Switch>
          </Router>
        </div>
      </ChakraProvider >
    )

  );
}

export default App;
