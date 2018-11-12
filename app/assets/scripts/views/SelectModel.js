import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class SelectModel extends Component {
  render () {
    return (
      <div>
        <h1>Select model</h1>
        <br />
        <div>
          <h2>OnSSET</h2>
          <h3>Version</h3>
          <p>V1.0</p>
          <h3>Description</h3>
          <p>
            Reprehenderit adipisicing deserunt pariatur laboris elit tempor
            labore ad mollit nostrud voluptate proident ad non. Eiusmod id duis
            culpa amet enim eu. Consequat adipisicing et Lorem magna cupidatat
            nostrud tempor irure.
          </p>
          <h3>Updated at</h3>
          <p>Oct 15, 2018</p>
          <h3>Author</h3>
          <p>KTH</p>
        </div>
        <br></br>

        <div>
          <h2>OnSSET</h2>
          <h3>Version</h3>
          <p>V2.1</p>
          <h3>Description</h3>
          <p>
            Laborum ad incididunt aute duis incididunt quis. Et id nisi enim
            duis voluptate dolore fugiat aliqua excepteur Lorem sint quis. Do
            sit deserunt ullamco eu sunt cupidatat sint et laboris excepteur
            sit. Lorem occaecat amet deserunt tempor deserunt non sint occaecat
            ea aute proident enim Lorem. Nisi in officia adipisicing dolor est
            voluptate aliquip sunt eiusmod laborum sit pariatur quis.
            Adipisicing magna quis nisi consectetur ut consequat est cillum eu
            aute esse ut irure proident. Ad labore tempor ex tempor ea.
          </p>
          <h3>Updated at</h3>
          <p>Oct 15, 2018</p>
          <h3>Author</h3>
          <p>KTH</p>
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
  )(SelectModel)
);
