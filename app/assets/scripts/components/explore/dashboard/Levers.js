import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Levers extends Component {
  render() {
    return (
      <div>
        <h3>1 - Scenarios</h3>
        <br />
        <div class="lever">
          <h4>Electricity demand profile</h4>
          <div>
            <input
              type="radio"
              id="option1"
              name="lever1"
              value="option1"
              checked
            />
            <label for="option1">Option 1</label>
          </div>

          <div>
            <input type="radio" id="option2" name="lever1" value="option2" />
            <label for="option2">Option 2</label>
          </div>
        </div>
        <br />

        <div class="lever">
          <h4>Year of analysis</h4>
          <div>
            <input
              type="radio"
              id="option1"
              name="lever2"
              value="option1"
              checked
            />
            <label for="option1">2020</label>
          </div>

          <div>
            <input type="radio" id="option2" name="lever2" value="option2" />
            <label for="option2">2025</label>
          </div>
          <div>
            <input type="radio" id="option3" name="lever2" value="option3" />
            <label for="option3">2025</label>
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
  )(Levers)
);
