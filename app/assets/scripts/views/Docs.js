import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Docs extends Component {
  render() {
    return (
      <div>
        <h1>Docs</h1>
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
  )(Docs)
);
