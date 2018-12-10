import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import Layers from './Layers';
import Levers from './Levers';
import Filters from './Filters';

import { environment } from '../../../config';
import { makeZeroFilledArray, cloneArrayAndChangeCell } from '../../../utils';

class Dashboard extends Component {
  constructor (props) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleLeverChange = this.handleLeverChange.bind(this);
    this.renderTabs = this.renderTabs.bind(this);

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
  }

  handleLeverChange (leverId, optionId) {
    const leversState = cloneArrayAndChangeCell(
      this.state.leversState,
      leverId,
      optionId
    );
    this.setState({
      leversState
    });
  }

  handleFilterChange (i, value) {
    // Ensure that range values are between min and max
    const filter = this.props.model.filters[i];
    if (filter.type === 'range') {
      const { min, max } = filter.range;
      if (value.min <= min) value.min = min;

      // Compare using Math.floor because the input uses step=1 and returns a lower integer value when max is float.
      if (value.max >= Math.floor(max)) value.max = max;
    }

    // Update state
    const filtersState = cloneArrayAndChangeCell(
      this.state.filtersState,
      i,
      value
    );
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
          updateScenario={this.props.updateScenario}
          handleLeverChange={this.handleLeverChange}
          leversConfig={levers}
          leversState={leversState}
        />
      );
    } else if (activeTab === 'filters') {
      const { filters } = this.props.model;
      const { filtersState } = this.state;
      return (
        <Filters
          updateScenario={this.props.updateScenario}
          filtersConfig={filters}
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
    filtersState: T.array,
    leversState: T.array,
    model: T.object
  };
}

export default Dashboard;
