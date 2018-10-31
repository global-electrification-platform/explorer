import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Explore extends Component {
  render() {
    return (
      <div>
        <h1>Summary</h1>
        <br />
        <button>Exoport</button>
        <div class="mapkey">
          <h2>Map key</h2>
          <ul>
            <li>Grid</li>
            <li>Stand Alone Diesel</li>
            <li>Stand Alone PV</li>
            <li>Mini-grid</li>
          </ul>
        </div>
        <br />
        <div class="charts">
          <h2>Charts</h2>
          <div class="chart">Chart 1</div>
          <div class="chart">Chart 2</div>
          <div class="chart">Chart 3</div>
        </div>
        <br />
        <div class="summary">
          <h2>Summary</h2>
          <h3>Population Electrified</h3>
          <p>1 280 848</p>
          <h3>Investiment Required</h3>
          <p>$94 999 393</p>
          <h3>Capacity Added</h3>
          <p>65 GWh</p>
        </div>
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
