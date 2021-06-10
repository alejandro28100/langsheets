
import theme from "./theme";
import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages/Home";
import Form from "./pages/Form";
import Practice from "./pages/Practice";
import NotFounded from "./pages/NotFounded";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { UserProvider } from "./context/UserContext";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // const { user } = useUser();
  // console.log(user);
  return (
    <UserProvider>
      <ChakraProvider theme={theme} >
        <div className="App">
          <Router>
            <Switch>
              <PrivateRoute exact path="/" type="user" redirectTo="/signup" component={Home} />
              {/* <Route path="/" exact component={Home} /> */}
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/worksheets/:id/edit" component={Form} />
              <Route path="/worksheets/:id/practice" component={Practice} />
              <Route path="*" component={NotFounded} />
            </Switch>
          </Router>
        </div>
      </ChakraProvider >
    </UserProvider>
  );
}

export default App;
