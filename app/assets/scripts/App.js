import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Actions
import { dismissWelcomeModal } from './reducers/context';

class App extends Component {
  render () {
    return <div className="App">{this.props.children}</div>;
  }
}

App.propTypes = {
  children: T.object
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {
  dismissWelcomeModal
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
