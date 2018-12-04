import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchCountry } from '../redux/actions';
import { environment } from '../config';

import App from './App';
import { showGlobalLoading, hideGlobalLoading } from '../components/GlobalLoading';

class SelectModel extends Component {
  async componentDidMount () {
    showGlobalLoading();
    await this.props.fetchCountry(this.props.match.params.countryId);
    hideGlobalLoading();
  }

  async componentDidUpdate (prevProps) {
    if (prevProps.match.params.countryId !== this.props.match.params.countryId) {
      showGlobalLoading();
      await this.props.fetchCountry(this.props.match.params.countryId);
      hideGlobalLoading();
    }
  }

  renderModelList () {
    const { isReady, hasError, getData } = this.props.country;

    if (!isReady()) return null;
    if (hasError()) return <p>Something went wrong. Try again.</p>;

    const models = getData().models;
    return (
      <ol className='country-list card-list'>
        {models.map(m => (
          <li key={m.id} className='country-list__item'>
            <Link to={`/explore/${m.id}`} title={'Explore scenario'}>{m.name}</Link>
            <p>{m.description}</p>
          </li>
        ))}
      </ol>
    );
  }

  render () {
    return (
      <App pageTitle='Select model'>
        <section className='inpage inpage--hub inpage--explore'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Explore</h1>
                <h2 className='inpage__sectitle'>Select model</h2>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            {this.renderModelList()}
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  SelectModel.propTypes = {
    match: T.object,
    fetchCountry: T.func,
    country: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    country: wrapApiResult(getFromState(state.individualCountries, props.match.params.countryId))
  };
}

function dispatcher (dispatch) {
  return {
    fetchCountry: (...args) => dispatch(fetchCountry(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(SelectModel);
