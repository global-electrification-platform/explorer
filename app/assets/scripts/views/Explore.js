import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import App from './App';
import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';
import DeviceMessage from '../components/DeviceMessage';

import { environment } from '../config';
import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchModel, fetchScenario, fetchCountry } from '../redux/actions';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.updateScenario = this.updateScenario.bind(this);

    this.state = {
      dashboardChangedAt: Date.now()
    };
  }

  async fetchModelData () {
    await this.props.fetchModel(this.props.match.params.modelId);
    const { hasError, getData } = this.props.model;
    if (!hasError()) {
      this.props.fetchCountry(getData().country);
    }
  }

  componentDidMount () {
    this.fetchModelData();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.modelId !== this.props.match.params.modelId) {
      this.fetchModelData();
    }
  }

  updateScenario (scenarioId) {
    const { modelId } = this.props.match.params;
    this.props.fetchScenario(`${modelId}-${scenarioId}`);
  }

  render () {
    const { isReady, getData } = this.props.model;

    const model = getData();
    const scenario = this.props.scenario.getData();

    const countryName = this.props.country.isReady() ? this.props.country.getData().name : '';

    return (
      <App pageTitle='Explore'>
        {isReady() && (
          <section className='inpage inpage--single inpage--horizontal inpage--explore'>
            <header className='inpage__header'>
              <div className='inpage__subheader'>
                <div className='inpage__headline'>
                  <h1 className='inpage__title'><span className='visually-hidden'>Explore</span> {countryName}</h1>
                  <p className='inpage__subtitle'>{model.name}</p>
                </div>
                <div className='inpage__hactions'>
                  <Link
                    to={`/countries/${model.country}/models`}
                    className='exp-change-button'
                    title='Change model'
                  >
                    <span>Change</span>
                  </Link>
                </div>
              </div>

              <Dashboard updateScenario={this.updateScenario} model={model} />
            </header>
            <div className='inpage__body'>
              <Map scenario={this.props.scenario} />
              <Summary scenario={scenario} />
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
