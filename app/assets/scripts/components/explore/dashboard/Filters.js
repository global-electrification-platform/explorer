import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class Filters extends Component {
  render () {
    return (
      <div>
        <h3>2 - Filters</h3>
        <br />
        <div className="filter">
          <h4>Population</h4>
          <input
            type="range"
            id="start"
            name="filter1"
            min="0"
            max="11"
            value="5"
          />
        </div>
        <br />
        <div className="filter">
          <h4>Electrification Technology</h4>

          <div>
            <input type="radio" id="option2" name="filter2" value="option2" />
            <label htmlFor="option2">Grid</label>
          </div>
          <div>
            <input type="radio" id="option3" name="filter2" value="option3" />
            <label htmlFor="option3">PV MG</label>
          </div>
          <div>
            <input type="radio" id="option3" name="filter2" value="option3" />
            <label htmlFor="option3">PV SA</label>
          </div>
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
  )(Filters)
);
