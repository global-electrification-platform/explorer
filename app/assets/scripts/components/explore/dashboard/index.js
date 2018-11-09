import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Layers from "./Layers";
import Levers from "./Levers";
import Filters from "./Filters";

class Explore extends Component {
  render() {
    return (
      <div>
        <h2>Dashboard</h2>
        <br />
        <Levers />
        <br />
        <Filters/>
        <br />
        <Layers/>
        <br />
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
