import React, { } from "react";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import AuthPage from './pages/Auth';
import Auth from './utils/authClass';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';



function App(props) {
  const auth = new Auth(props.history);
  return (
    <>
      <Switch>
        <Route exact path="/" component={AuthPage} />
        <Route path="/home" render={(props) => auth.isAuthenticated() ? <Dashboard {...props} /> : <Redirect to="/" />} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </>
  );
}

export default withRouter(App);