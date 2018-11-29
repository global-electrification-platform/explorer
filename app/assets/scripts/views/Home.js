import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { wrapApiResult } from '../redux/utils';
import { fetchStats } from '../redux/actions';
import { environment } from '../config';
import { padNumber } from '../utils/string';

import App from './App';

class Home extends Component {
  componentDidMount () {
    this.props.fetchStats();
  }

  renderStatsList () {
    const { isReady, hasError, getData } = this.props.stats;

    let totals = {
      countries: '00',
      models: '00'
    };

    if (hasError()) {
      totals = {
        countries: '--',
        models: '--'
      };
    } else if (isReady()) {
      const tot = getData().totals;
      totals = {
        countries: padNumber(tot.models, 2),
        models: padNumber(tot.countries, 2)
      };
    }

    return (
      <dl className='stats-list'>
        <dt>Models</dt>
        <dd>{totals.models}</dd>
        <dt>Countries</dt>
        <dd>{totals.countries}</dd>
      </dl>
    );
  }

  render () {
    return (
      <App>
        <article className='inpage inpage--home'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Homepage</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <section className='home-intro prose'>
              <h2 className='home-intro__title'>
                <span>Welcome to the</span> Global Electrification Platform
                Explorer
              </h2>
              <div className='home-intro__lead'>
                <p>
                  Explore least cost electrification strategies around the
                  world, interacting with country contextual data and diferent
                  investment scenarios.
                </p>
              </div>

              {this.renderStatsList()}

              <p className='cta-wrapper'>
                <Link
                  to='/explore'
                  title='Explore the data'
                  className='ctab ctab--explore'
                >
                  <span>Start exploring</span>
                </Link>
                <small>or</small>
                <Link
                  to='/about'
                  title='Learn about the tool'
                  className='ctab ctab--about'
                >
                  <span>Learn more</span>
                </Link>
              </p>
            </section>
          </div>
        </article>
      </App>
    );
  }
}

if (environment !== 'production') {
  Home.propTypes = {
    fetchStats: T.func,
    stats: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    stats: wrapApiResult(state.stats)
  };
}

function dispatcher (dispatch) {
  return {
    fetchStats: (...args) => dispatch(fetchStats(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(Home);
