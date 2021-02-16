import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
const AsyncHome = asyncComponent(() => import("./containers/Home"));
const AsyncLogin = asyncComponent(() => import("./containers/Login"));
const AsyncSettings = asyncComponent(() => import("./containers/Settings"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));
const AsyncResetPassword = asyncComponent(() => import("./containers/ResetPassword"));
const AsyncChangePassword = asyncComponent(() => import("./containers/ChangePassword"));
const AsyncChangeEmail = asyncComponent(() => import("./containers/ChangeEmail"));
const AsyncSearch = asyncComponent(() => import("./containers/Search/Search")); 


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute
      path="/"
      exact
      component={AsyncHome}
      props={childProps}
    />
    <UnauthenticatedRoute
      path="/login"
      exact
      component={AsyncLogin}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/search"
      exact
      component={AsyncSearch}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/email"
      exact
      component={AsyncChangeEmail}
      props={childProps}
    /> 
    <AuthenticatedRoute
      path="/settings/password"
      exact
      component={AsyncChangePassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings/reset"
      exact
      component={AsyncResetPassword}
      props={childProps}
    />
    <AuthenticatedRoute
      path="/settings"
      exact
      component={AsyncSettings}
      props={childProps}
    />
    {/* Finally, catch all unmatched routes */}
    <Route component={AsyncNotFound} />
  </Switch>
;