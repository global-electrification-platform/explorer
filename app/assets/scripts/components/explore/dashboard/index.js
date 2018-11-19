import React, { Component } from 'react';

import Layers from './Layers';
import Levers from './Levers';
import Filters from './Filters';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: 'scenarios'
    };
    this.renderTabs = this.renderTabs.bind(this);
  }

  renderTabs () {
    const self = this;
    const { activeTab } = this.state;
    return ['scenarios', 'filters', 'layers'].map((tab, index) => {
      return (
        <li className='nav__tab' role='presentation'>
          <a
            className={`nav__link  ${
              activeTab === tab ? 'nav__link--active' : ''
            }`}
            onClick={event => {
              event.preventDefault();
              self.setState({ activeTab: tab });
            }}
          >
            <span>{tab}</span>
          </a>
        </li>
      );
    });
  }

  renderTabContent () {
    const { activeTab } = this.state;
    if (activeTab === 'scenarios') return <Levers />;
    else if (activeTab === 'filters') return <Filters />;
    else if (activeTab === 'layers') return <Layers />;
  }

  render () {
    return (
      <div className='econtrols'>
        <nav className='nav'>
          <ul className='nav__tablist' role='tablist'>
            {this.renderTabs()}
          </ul>
        </nav>
        {this.renderTabContent()}
      </div>
    );
  }
}

export default Explore;
