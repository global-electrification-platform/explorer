import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class SelectCountry extends Component {
  render () {
    return (
      <div>
        <h1>Select Country:</h1>
        <ul>
          <li>Ghana</li>
          <li>Malawi</li>
          <li>Nigeria</li>
        </ul>
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
  )(SelectCountry)
);
