import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import clone from 'lodash.clone';
import isEqual from 'lodash.isequal';
import pull from 'lodash.pull';
import get from 'lodash.get';

import { environment } from '../config';
import { makeZeroFilledArray, cloneArrayAndChangeCell } from '../utils';
import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchModel, fetchScenario, fetchCountry } from '../redux/actions';

import App from './App';
import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';
import DeviceMessage from '../components/DeviceMessage';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/GlobalLoading';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.updateScenario = this.updateScenario.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleLeverChange = this.handleLeverChange.bind(this);
    this.handleLayerChange = this.handleLayerChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);

    this.state = {
      dashboardChangedAt: Date.now(),
      defaultFilters: [],
      filtersState: [],
      leversState: [],
      layersState: [],
      year: null,
      appliedState: {}
    };
  }

  async componentDidMount () {
    await this.fetchModelData();
    this.updateScenario();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.modelId !== this.props.match.params.modelId) {
      this.fetchModelData();
    }
  }

  handleLeverChange (leverIdx, optionIdx) {
    const leversState = cloneArrayAndChangeCell(
      this.state.leversState,
      leverIdx,
      optionIdx
    );
    this.setState({ leversState });
  }

  handleFilterChange (filterIdx, value) {
    const filter = this.props.model.getData().filters[filterIdx];
    const filtersState = clone(this.state.filtersState);
    const defaultFilters = clone(this.state.defaultFilters);

    if (filter.type === 'range') {
      let newRange = clone(value);

      // Ensure that range values are between min and max
      const { min, max } = filter.range;
      if (newRange.min <= min) newRange.min = min;

      // Compare using Math.floor because the input uses step=1 and returns a lower integer value when max is float.
      if (newRange.max >= Math.floor(max)) newRange.max = max;

      filtersState[filterIdx] = newRange;

      // Set flag if filter is not default
      defaultFilters[filterIdx] = isEqual(filter.range, newRange);
    } else {
      // Get current selected options
      let selectedOptions = clone(this.state.filtersState[filterIdx]);

      // Toggle filter value from select options
      if (selectedOptions.indexOf(value) > -1) {
        pull(selectedOptions, value);
      } else {
        selectedOptions.push(value);
      }

      // Do not allow less than one option selected
      if (selectedOptions.length > 0) {
        filtersState[filterIdx] = selectedOptions;
      }

      // Set flag if filter is not default
      defaultFilters[filterIdx] = filter.options.length === selectedOptions.length;
    }

    this.setState({
      defaultFilters: defaultFilters,
      filtersState: filtersState
    });
  }

  handleLayerChange (leverIdx) {
    const active = this.state.layersState[leverIdx];
    const layersState = cloneArrayAndChangeCell(
      this.state.layersState,
      leverIdx,
      !active
    );

    this.setState({ layersState });
  }

  handleYearChange (year) {
    this.setState({ year });
  }

  async fetchModelData () {
    showGlobalLoading();
    await this.props.fetchModel(this.props.match.params.modelId);
    const { hasError, getData } = this.props.model;
    if (!hasError()) {
      const model = getData();

      // Fetch country data to render titles
      this.props.fetchCountry(model.country);

      // Initialize levers and filters
      this.setState({
        defaultFilters: new Array(model.filters.length).fill(true),
        leversState: makeZeroFilledArray(model.levers.length),
        filtersState: model.filters
          ? model.filters.map(filter => {
            if (filter.type === 'range') {
              return filter.range;
            } else return filter.options.map(option => option.value);
          })
          : [],
        layersState: model.map.layers.map(() => false),
        year: get(model.timesteps, '0', null)
      });
    }

    hideGlobalLoading();
  }

  async updateScenario () {
    showGlobalLoading();
    const model = this.props.model.getData();
    const { leversState: levers, filtersState: filters, year } = this.state;

    this.setState({
      appliedState: {
        filtersState: filters,
        leversState: levers,
        year: year
      }
    });

    const selectedFilters = [];

    // Compare filters to model defaults to identify actionable filters
    for (let i = 0; i < model.filters.length; i++) {
      const { key } = model.filters[i];
      const type = model.filters[i].type;

      if (type === 'range') {
        const defaultRange = model.filters[i].range;
        const { min, max } = filters[i];
        if (min !== defaultRange.min) {
          selectedFilters.push({ key, min });
        }
        if (max !== defaultRange.max) {
          selectedFilters.push({ key, max });
        }
      } else {
        const defaultOptions = model.filters[i].options;

        if (defaultOptions.length !== filters[i].length) {
          selectedFilters.push({ key, options: filters[i] });
        }
      }
    }

    await this.props.fetchScenario(
      `${model.id}-${levers.join('_')}`,
      selectedFilters,
      year
    );
    hideGlobalLoading();
  }

  render () {
    const { isReady, getData } = this.props.model;
    const model = getData();

    /**
     * Get country data. If there is only one model for this country, disable "Change Model" button.
     */
    let countryName = '';
    let hasMultipleModels = false;
    if (this.props.country.isReady()) {
      const { name, models } = this.props.country.getData();
      countryName = name;
      hasMultipleModels = models.length > 1;
    }

    return (
      <App pageTitle='Explore'>
        {isReady() && (
          <section className='inpage inpage--single inpage--horizontal inpage--explore'>
            <header className='inpage__header'>
              <div className='inpage__subheader'>
                <div className='inpage__headline'>
                  <h1 className='inpage__title'>
                    <span className='visually-hidden'>Explore</span>
                    {countryName}
                  </h1>
                  <p className='inpage__subtitle'>{model.name}</p>
                </div>
                <div className='inpage__hactions'>
                  <Link
                    to={`/countries/${model.country}/models`}
                    className={c('exp-change-button', {
                      disabled: !hasMultipleModels
                    })}
                    title='Change model'
                  >
                    <span>Change</span>
                  </Link>
                </div>
              </div>

              <Dashboard
                model={model}
                updateScenario={this.updateScenario}
                handleLeverChange={this.handleLeverChange}
                handleFilterChange={this.handleFilterChange}
                handleYearChange={this.handleYearChange}
                leversState={this.state.leversState}
                filtersState={this.state.filtersState}
                year={this.state.year}
              />
            </header>
            <div className='inpage__body'>
              <Map
                scenario={this.props.scenario}
                year={this.state.year}
                externalLayers={model.map.layers}
                layersState={this.state.layersState}
                handleLayerChange={this.handleLayerChange}
              />
              <Summary
                country={this.props.country}
                model={this.props.model}
                scenario={this.props.scenario}
                defaultFilters={this.state.defaultFilters}
                appliedState={this.state.appliedState}
              />
            </div>
            <DeviceMessage />
          </section>
        )}
      </App>
    );
  }
}

if (environment !== 'production') {
  Explore.propTypes = {
    fetchModel: T.func,
    fetchScenario: T.func,
    fetchCountry: T.func,
    match: T.object,
    model: T.object,
    country: T.object,
    scenario: T.object
  };
}

function mapStateToProps (state, props) {
  const model = wrapApiResult(
    getFromState(state.individualModels, props.match.params.modelId)
  );

  return {
    model,
    country: wrapApiResult(
      getFromState(state.individualCountries, model.getData().country)
    ),
    scenario: wrapApiResult(state.scenario)
  };
}

function dispatcher (dispatch) {
  return {
    fetchModel: (...args) => dispatch(fetchModel(...args)),
    fetchScenario: (...args) => dispatch(fetchScenario(...args)),
    fetchCountry: (...args) => dispatch(fetchCountry(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Explore);
