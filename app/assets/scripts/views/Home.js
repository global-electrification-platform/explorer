import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        {/* Hero */}
        <div>
          <h2>Welcome to the Global Electrification Platform</h2>
          <p>
            Excepteur excepteur proident veniam amet aliquip occaecat anim
            tempor non elit adipisicing. Dolor eiusmod ipsum ipsum anim
            exercitation cillum proident. Minim reprehenderit sint esse ea in
            laborum enim est do est do. Elit nostrud ea pariatur commodo ut ex
            laborum fugiat ullamco occaecat qui cupidatat est irure. Fugiat
            nulla do elit proident aute proident amet do voluptate non
            incididunt ex exercitation nisi.
          </p>
          <button>Learn More</button>
        </div>
        <hr />
        {/* General stats */}
        <div>
          <h2>Browse the data</h2>
          <p>
            Fugiat laboris non anim dolor consequat fugiat nulla nostrud eiusmod
            esse. Occaecat mollit cupidatat veniam laboris elit dolor incididunt
            non eu anim officia consequat reprehenderit nostrud. Veniam enim
            occaecat quis ad pariatur veniam. Est excepteur voluptate velit sunt
            do cupidatat excepteur culpa sit nulla proident. Reprehenderit amet
            id laborum ex anim. Deserunt ipsum excepteur duis ipsum Lorem ad
            aute mollit Lorem reprehenderit dolore id et reprehenderit. Est
            eiusmod quis officia quis eu aliquip ex nulla tempor aliquip
            cupidatat cillum eiusmod tempor.
          </p>
          <button>Start browsing</button>
        </div>
        <hr />
        {/* Footer */}
        <div>
          <h2>Global Electrification Platform (Footer)</h2>
          <p>Copyright 2018</p>
          <ul>
            <li>Logo 1</li>
            <li>Logo 2</li>
            <li>Logo 3</li>
          </ul>
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
  )(Home)
);
