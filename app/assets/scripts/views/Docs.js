import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Docs extends Component {
  render() {
    return (
      <div>
        <h1>Docs</h1>
        <br />
        <div class="navigation">
          <h2>Navigation</h2>
          <br />
          <h3>Global</h3>
          <ul>
            <li>Consectetur dolor</li>
            <li>Lorem Ipsum</li>
            <li>Dolor sit amet</li>
          </ul>
          <br />
          <h3>Models</h3>
          <ul>
            <li>Mostrud nulla proident</li>
            <li>Minim officia cupidatat eu</li>
            <li>Veniam nostrud anim ex irure.</li>
          </ul>
        </div>
        <hr />
        <div class="doc-page">
          <h2>Voluptate irure nulla exercitation laboris</h2>
          <p>
            Pariatur duis aliquip est est culpa dolor pariatur anim est sunt in
            consequat. Laborum culpa elit do magna in aute aliquip sit id
            consequat non anim voluptate voluptate. Nostrud deserunt tempor
            tempor reprehenderit dolor ea esse velit velit labore elit ullamco
            pariatur. Reprehenderit amet est reprehenderit amet ea non proident
            voluptate aliquip consequat magna. Sint Lorem deserunt ad sit. Eu
            culpa elit quis pariatur fugiat amet. Esse anim elit incididunt
            irure sit in aliqua ipsum minim amet fugiat.
          </p>
          <p>
            Minim reprehenderit duis enim qui excepteur exercitation cupidatat
            esse officia ipsum. Anim eiusmod ad velit irure duis. Cillum ea elit
            proident non minim adipisicing do ipsum laboris. Aliqua Lorem minim
            tempor laboris voluptate dolore veniam reprehenderit. Nulla aliqua
            anim nisi do cupidatat. Quis et et id ullamco dolor enim culpa
            cupidatat dolor quis qui anim. Voluptate laboris aliquip deserunt do
            commodo dolor laborum sit.
          </p>
          <p>
            Consequat laborum excepteur sint minim reprehenderit do mollit nulla
            exercitation amet. Aliqua deserunt labore qui deserunt. Proident
            nostrud occaecat labore enim laborum. Aliqua anim dolore sunt aute.
          </p>
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
  )(Docs)
);
