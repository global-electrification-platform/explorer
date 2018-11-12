import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

class Explore extends Component {
  render () {
    return (
      <div>
        <h1>Explore (view)</h1>
        <br/>
        <Dashboard />
        <hr></hr>
        <Map />
        <hr></hr>
        <Summary />
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
  )(Explore)
);
