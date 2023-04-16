import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { ROLE } from '../../api/role/Role';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import NotAuthorized from '../pages/NotAuthorized';
import ListAllEvents from '../pages/ListAllEvents';
import ListEventDay from '../pages/ListEventDay';
import ListTimeout from '../pages/ListTimeout';
import EditTimeout from '../pages/EditTimeout';
import TimeoutTabs from '../pages/TimeoutTabs';
import AddTimeout from '../pages/AddTimeout';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import NotFound from '../pages/NotFound';
import SignOut from '../pages/SignOut';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Landing from '../pages/Landing';
import Calendar from '../pages/Calendar';
import Contact from '../pages/Contact';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
const App = () => {
  const { ready } = useTracker(() => {
    const rdy = Roles.subscription.ready();
    return {
      ready: rdy,
    };
  });
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route exact path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notauthorized" element={<NotAuthorized />} />
          <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/add-timeout" element={<ProtectedRoute><AddTimeout /></ProtectedRoute>} />
          <Route path="/edit/:_id" element={<ProtectedRoute><EditTimeout /></ProtectedRoute>} />
          <Route path="/main-calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/list-timeout" element={<ProtectedRoute><ListTimeout /></ProtectedRoute>} />
          <Route path="/total-timeouts" element={<ProtectedRoute><TimeoutTabs /></ProtectedRoute>} />
          <Route path="/list-all-events" element={<ProtectedRoute><ListAllEvents /></ProtectedRoute>} />
          <Route path="/list-eventsday/:_id" element={<ProtectedRoute><ListEventDay /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

/*
 * ProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ children }) => {
  const isLogged = Meteor.userId() !== null;
  console.log('ProtectedRoute', isLogged);
  return isLogged ? children : <Navigate to="/signin" />;
};

/**
 * AdminProtectedRoute (see React Router v6 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ ready, children }) => {
  const isLogged = Meteor.userId() !== null;
  if (!isLogged) {
    return <Navigate to="/signin" />;
  }
  if (!ready) {
    return <LoadingSpinner />;
  }
  const isAdmin = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]);
  console.log('AdminProtectedRoute', isLogged, isAdmin);
  return (isLogged && isAdmin) ? children : <Navigate to="/notauthorized" />;
};

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ProtectedRoute.defaultProps = {
  children: <Landing />,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  ready: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AdminProtectedRoute.defaultProps = {
  ready: false,
  children: <Landing />,
};

export default App;
