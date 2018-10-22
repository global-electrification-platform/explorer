import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class App extends Component {
  render () {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
