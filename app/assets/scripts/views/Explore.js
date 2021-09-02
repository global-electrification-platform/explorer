import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import clone from 'lodash.clone';
import isEqual from 'lodash.isequal';
import pull from 'lodash.pull';

import { environment } from '../config';
import { makeZeroFilledArray, cloneArrayAndChangeCell, round } from '../utils';
import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchModel, fetchScenario, fetchCountry } from '../redux/actions';
import QsState from '../utils/qs-state';

import App from './App';
import UhOh from './UhOh';
import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';
import DeviceMessage from '../components/DeviceMessage';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/GlobalLoading';
import { getCountryBoundsNWSE } from '../utils/ne-110m_bbox';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.onApplyClick = this.onApplyClick.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
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

    // Setup the qsState for url state management.
    this.qsState = new QsState({
      year: {
        accessor: 'year',
        hydrator: v => parseInt(v)
      },
      scenario: {
        accessor: 'leversState',
        hydrator: v => (v ? v.split('_').map(v => parseFloat(v)) : null),
        dehydrator: v => (v ? v.join('_') : null)
      },
      // The filters have a complex structure.
      // To ensure that the look good on the url and that it doesn't get too
      // big, we're encoding them.
      filters: {
        accessor: 'filtersState',
        // Filters that are ranges are decoded to a {min, max} object.
        // Filters that are options are decoded as an [1, 2, 3] of options.
        hydrator: v => {
          if (!v) return null;
          const pieces = v.split('|');
          return pieces.map(p => {
            if (p.match(/^r/)) {
              const [min, max] = p.substr(1).split('_');
              return { min: parseFloat(min), max: parseFloat(max) };
            }
            return p.split('_').map(v => parseFloat(v));
          });
        },
        // The filters that are a range are encoded as r[min]_[max]
        // The filters that are options are encoded as [opt]_[opt]_[opt]
        // The various filters are concatenated with a |
        dehydrator: v => {
          if (!v) return null;
          return v
            .map(s => {
              if (typeof s.min !== 'undefined' || typeof s.max !== 'undefined') {
                return `r${s.min || 0}_${s.max || 0}`;
              }
              return s.join('_');
            })
            .join('|');
        }
      }
    });
  }

  initialLeverState(model) {
    return model.levers.map(l => l.default !== undefined ? l.default : 0);
  }

  async componentDidMount () {
    await this.fetchModelData();
    const { hasError } = this.props.model;
    if (!hasError()) this.updateScenario();
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
      // If all fiters are selected and user clicks option, disable all and select the selected option
      // only of Andmin1
      if (selectedOptions.length === filter.options.length) {
        selectedOptions = [value];
      } else {
        if (selectedOptions.indexOf(value) > -1) {
          pull(selectedOptions, value);
        } else {
          selectedOptions.push(value);
        }
      }

      // Do not allow less than one option selected
      if (selectedOptions.length > 0) {
        filtersState[filterIdx] = selectedOptions;
      }

      // Set flag if filter is not default
      defaultFilters[filterIdx] =
        filter.options.length === selectedOptions.length;
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

  onApplyClick () {
    // Update location.
    const qString = this.qsState.getQs(this.state);
    this.props.history.push({ search: qString });

    this.updateScenario();
  }

  onResetClick () {
    const { hasError, getData } = this.props.model;
    if (hasError()) return;

    const model = getData();

    this.setState({
      filtersState: model.filters
        ? model.filters.map(filter => {
          if (filter.type === 'range') {
            return filter.range;
          } else return filter.options.map(option => option.value);
        })
        : [],
      leversState: this.initialLeverState(model),
    }, () => {
      this.onApplyClick();
    });
  }

  async fetchModelData () {
    showGlobalLoading();
    await this.props.fetchModel(this.props.match.params.modelId);
    const { hasError, getData } = this.props.model;
    if (!hasError()) {
      const model = getData();

      // Fetch country data to render titles
      this.props.fetchCountry(model.country);

      const externalLayers = model.map.externalLayers || [];

      // Initialize levers and filters
      this.setState({
        defaultFilters: new Array(model.filters.length).fill(true),
        leversState: this.initialLeverState(model),
        filtersState: model.filters
          ? model.filters.map(filter => {
            if (filter.type === 'range') {
              return filter.range;
            } else return filter.options.map(option => option.value);
          })
          : [],
        layersState: externalLayers.map(() => false),
        year: model.timesteps
          ? model.timesteps[model.timesteps.length - 1]
          : null
      });

      // Use levers and filters from the qstring if they exist.
      // Clean up undefined keys.
      let qsState = this.qsState.getState(this.props.location.search.substr(1));
      Object.keys(qsState).forEach(k => {
        if (qsState[k] === undefined) delete qsState[k];
      });

      this.setState({ ...qsState });
    }

    hideGlobalLoading();
  }

  async updateScenario () {
    showGlobalLoading(1, 'Loading model results. This may take a while');
    try {
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
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log('error', error);
    }
    hideGlobalLoading();
  }

  render () {
    const { isReady, getData, hasError } = this.props.model;
    const model = getData();

    if (hasError()) {
      hideGlobalLoading();
      return <UhOh />;
    }

    let bounds = null;
    if (isReady()) {
      bounds = getCountryBoundsNWSE(model.country);
    }

    // Get country data. If there is only one model for this country,
    // disable "Change Model" button.
    let countryName = '';
    let riseScore = 'N/A';
    let hasMultipleModels = false;
    if (this.props.country.isReady()) {
      const { name, riseScores: rs, models } = this.props.country.getData();
      riseScore = rs ? (
        <a
          href='https://rise.worldbank.org/scores'
          title='View World Bank rise score page'
          target='_blank'
          rel='noopener noreferrer'
        >
          {round(rs.overall, 0)} / 100
        </a>
      ) : riseScore;
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
                  {hasMultipleModels ? <p className='inpage__subtitle'>{model.name}</p> : null}
                  <dl className='inpage__details'>
                    <dt>Rise score</dt>
                    <dd>{riseScore}</dd>
                  </dl>
                </div>
                <div className='inpage__hactions'>
                  <Link
                    to={hasMultipleModels ? `/countries/${model.country}/models` : `/countries`}
                    className='exp-change-button'
                    title={hasMultipleModels ? 'Change model' : 'Change country'}
                  >
                    <span>Change</span>
                  </Link>
                </div>
              </div>

              <Dashboard
                model={model}
                onApplyClick={this.onApplyClick}
                onResetClick={this.onResetClick}
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
                bounds={bounds}
                scenario={this.props.scenario}
                year={this.state.year}
                modelVT={model.map.modelVT}
                externalLayers={model.map.externalLayers || []}
                techLayers={model.map.techLayersConfig}
                layersState={this.state.layersState}
                handleLayerChange={this.handleLayerChange}
              />
              <Summary
                country={this.props.country}
                model={model}
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
    history: T.object,
    location: T.object,
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
