import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class About extends Component {
  render() {
    return (
      <div>
        <h1>About</h1>
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
  )(About)
);
