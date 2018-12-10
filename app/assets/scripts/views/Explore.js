import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import { makeZeroFilledArray } from '../utils';
import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchModel, fetchScenario, fetchCountry } from '../redux/actions';

import App from './App';
import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.updateScenario = this.updateScenario.bind(this);

    this.state = {
      dashboardChangedAt: Date.now(),
      activeFilters: [],
      activeLevers: []
    };
  }

  componentDidMount () {
    this.fetchModelData();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.modelId !== this.props.match.params.modelId) {
      this.fetchModelData();
    }
  }

  async fetchModelData () {
    await this.props.fetchModel(this.props.match.params.modelId);
    const { hasError, getData } = this.props.model;
    if (!hasError()) {
      const model = getData();

      // Fetch country data to render titles
      this.props.fetchCountry(model.country);

      // Initialize levers and filters
      this.setState({
        activeLevers: makeZeroFilledArray(model.levers.length),
        activeFilters: model.filters
          ? model.filters.map(filter => {
            if (filter.type === 'range') {
              return filter.range;
            } else return 0;
          })
          : []
      });
    }
  }

  updateScenario (options) {
    const model = this.props.model.getData();
    const levers = options.levers || this.state.activeLevers;
    const filters = options.filters || this.state.activeFilters;
    const selectedFilters = [];

    // Compare filters to model defaults to identify actionable filters
    for (let i = 0; i < model.filters.length; i++) {
      const { key } = model.filters[i];
      const type = model.filters[i].type;
      const defaultRange = model.filters[i].range;

      if (type === 'range') {
        const { min, max } = filters[i];
        if (min !== defaultRange.min) {
          selectedFilters.push({ key, min });
        }
        if (max !== defaultRange.max) {
          selectedFilters.push({ key, max });
        }
      }
    }

    // Update state if levers are changed
    this.setState({ activeLevers: levers, activeFilters: filters });

    this.props.fetchScenario(
      `${model.id}-${levers.join('_')}`,
      selectedFilters
    );
  }

  render () {
    const { filtersState, leversState } = this.state;

    const { isReady, getData } = this.props.model;
    const model = getData();
    const scenario = this.props.scenario.getData();

    const countryName = this.props.country.isReady()
      ? this.props.country.getData().name
      : '';

    return (
      <App pageTitle='Explore'>
        {isReady() && (
          <section className='inpage inpage--single inpage--horizontal inpage--explore'>
            <header className='inpage__header'>
              <div className='inpage__subheader'>
                <div className='inpage__headline'>
                  <h1 className='inpage__title'>Explore</h1>
                  <h2 className='inpage__sectitle'>{countryName}</h2>
                  <p className='inpage__subtitle'>{model.name}</p>
                </div>
                <div className='inpage__hactions'>
                  <Link
                    to={`/countries/${model.country}/models`}
                    className='exp-change-button'
                    title='Change country and model'
                  >
                    <span>Change</span>
                  </Link>
                </div>
              </div>

              <Dashboard
                filtersState={filtersState}
                leversState={leversState}
                model={model}
                updateScenario={this.updateScenario}
              />
            </header>
            <div className='inpage__body'>
              <Map scenario={this.props.scenario} />
              <Summary scenario={scenario} />
            </div>
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
