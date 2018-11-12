import React, { Component } from 'react';

import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

class Explore extends Component {
  render () {
    return (
      <div>
        <h1>Explore (view)</h1>
        <br />
        <Dashboard />
        <hr />
        <Map />
        <hr />
        <Summary />
      </div>
    );
  }
}

export default Explore;
