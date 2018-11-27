import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import App from './App';

import Dashboard from '../components/explore/dashboard';
import Map from '../components/explore/Map';
import Summary from '../components/explore/Summary';

import { environment } from '../config';
import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchModel } from '../redux/actions';

class Explore extends Component {
  constructor (props) {
    super(props);

    this.updateMap = this.updateMap.bind(this);

    this.state = {
      dashboardChangedAt: Date.now()
    };
  }

  componentDidMount () {
    this.props.fetchModel(this.props.match.params.modelId);
  }

  componentDidUpdate (prevProps) {
    if (prevProps.match.params.modelId !== this.props.match.params.modelId) {
      this.props.fetchModel(this.props.match.params.modelId);
    }
  }

  updateMap () {
    this.setState({ dashboardChangedAt: Date.now() });
  }

  render () {
    const { isReady, getData } = this.props.model;
    const model = getData();

    return (
      <App pageTitle='Explore'>
        {isReady() && (
          <section className='inpage inpage--single inpage--horizontal inpage--explore'>
            <header className='inpage__header'>
              <div className='inpage__subheader'>
                <div className='inpage__headline'>
                  <h1 className='inpage__title'>Explore</h1>
                  <h2 className='inpage__sectitle'>Country Name</h2>
                  <p className='inpage__subtitle'>OnSSET v2.1</p>
                </div>
                <div className='inpage__hactions'>
                  <button
                    type='button'
                    className='exp-change-button disabled'
                    title='Change country and model'
                  >
                    <span>Change</span>
                  </button>
                </div>
              </div>

              <Dashboard updateMap={this.updateMap} model={model} />
            </header>
            <div className='inpage__body'>
              <Map dashboardChangedAt={this.state.dashboardChangedAt} />
              <Summary />
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
    match: T.object,
    model: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    model: wrapApiResult(
      getFromState(state.individualModels, props.match.params.modelId)
    )
  };
}

function dispatcher (dispatch) {
  return {
    fetchModel: (...args) => dispatch(fetchModel(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Explore);
