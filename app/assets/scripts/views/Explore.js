import React, { Component } from 'react';

import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.updateMap = this.updateMap.bind(this);

    this.state = {
      dashboardChangedAt: Date.now()
    };
  }

  updateMap () {
    this.setState({ dashboardChangedAt: Date.now() });
  }

  render () {
    return (
      <section className='inpage inpage--horizontal inpage--explore'>
        <header className='inpage__header'>
          <div className='inpage__subheader'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Explore</h1>
              <h2 className='inpage__sectitle'>Country name</h2>
              <p className='inpage__subtitle'>OnSSET v2.1</p>
            </div>
            <div className='inpage__hactions'>
              <button
                type='button'
                className='button button--small button--primary-raised-light'
                title='Change country and model'
              >
                <span onClick={this.updateMap}>Change</span>
              </button>
            </div>
          </div>
          <Dashboard updateMap={this.updateMap} />
        </header>
        <div className='inpage__body'>
          <Map dashboardChangedAt={this.state.dashboardChangedAt} />
          <Summary />
        </div>
      </section>
    );
  }
}

export default Explore;
