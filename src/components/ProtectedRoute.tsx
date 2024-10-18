import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        user && (user.subscriptionStatus === 'active' || !user.isTrialExpired) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/subscribe', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedRoute;