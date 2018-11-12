import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Sidebar from './components/Sidebar';

class App extends Component {
  render () {
    return (
      <div>
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: T.object
};

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
