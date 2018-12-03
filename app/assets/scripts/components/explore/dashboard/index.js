import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import Layers from './Layers';
import Levers from './Levers';
import Filters from './Filters';

import { environment } from '../../../config';
import { makeZeroFilledArray } from '../../../utils';

class Dashboard extends Component {
  constructor (props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleLeverChange = this.handleLeverChange.bind(this);

    this.state = {
      activeTab: 'scenarios',
      filtersState: props.model.filters
        ? props.model.filters.map(filter => {
          if (filter.type === 'range') {
            return filter.range;
          } else return 0;
        })
        : [],
      leversState: makeZeroFilledArray(props.model.levers.length)
    };
    this.renderTabs = this.renderTabs.bind(this);
  }

  handleLeverChange (leverId, optionId) {
    const { leversState } = this.state;
    leversState[leverId] = optionId;
    this.setState({
      leversState
    });
  }

  handleFilterChange (i, value) {
    const { filtersState } = this.state;
    const filter = this.props.model.filters[i];

    // Ensure that range values are between min and max
    if (filter.type === 'range') {
      const { min, max } = filter.range;
      if (value.min < min) value.min = min;
      else if (value.max > max) value.max = max;
    }

    filtersState[i] = value;
    this.setState({ filtersState });
  }

  renderTabs () {
    const self = this;
    const { activeTab } = this.state;
    return ['scenarios', 'filters', 'layers'].map((tab, index) => {
      return (
        <li className='nav__tab' role='presentation' key={index}>
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
    if (activeTab === 'scenarios') {
      const { levers } = this.props.model;
      const { leversState } = this.state;
      return (
        <Levers
          levers={levers}
          leversState={leversState}
          handleLeverChange={this.handleLeverChange}
          updateScenario={this.props.updateScenario}
        />
      );
    } else if (activeTab === 'filters') {
      const { filters } = this.props.model;
      const { filtersState } = this.state;
      return (
        <Filters
          filters={filters}
          filtersState={filtersState}
          handleFilterChange={this.handleFilterChange}
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
    model: T.object
  };
}

export default Dashboard;
