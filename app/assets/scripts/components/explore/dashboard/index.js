import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import Layers from './Layers';
import Levers from './Levers';
import Filters from './Filters';

import { environment } from '../../../config';

class Dashboard extends Component {
  constructor (props) {
    super(props);

    this.renderTabs = this.renderTabs.bind(this);

    this.state = {
      activeTab: 'scenarios'
    };
  }

  renderTabs () {
    const self = this;
    const { activeTab } = this.state;
    return ['scenarios', 'filters', 'layers'].map((tab, index) => {
      return (
        <li className='nav__tab' role='presentation' key={index}>
          <a
            className={`nav__link ${
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
    if (activeTab === 'scenarios') {
      const { levers } = this.props.model;
      const { leversState } = this.props;
      return (
        <Levers
          updateScenario={this.props.updateScenario}
          handleLeverChange={this.props.handleLeverChange}
          leversConfig={levers}
          leversState={leversState}
        />
      );
    } else if (activeTab === 'filters') {
      const { filters } = this.props.model;
      const { filtersState } = this.props;
      return (
        <Filters
          updateScenario={this.props.updateScenario}
          filtersConfig={filters}
          filtersState={filtersState}
          handleFilterChange={this.props.handleFilterChange}
        />
      );
    } else if (activeTab === 'layers') return <Layers />;
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

if (environment !== 'production') {
  Dashboard.propTypes = {
    updateScenario: T.func,
    handleLeverChange: T.func,
    handleFilterChange: T.func,
    model: T.object,
    leversState: T.array,
    filtersState: T.array
  };
}

export default Dashboard;
