import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { wrapApiResult, getFromState } from '../redux/utils';
import { fetchCountry } from '../redux/actions';
import { environment } from '../config';

import App from './App';
import UhOh from './UhOh';
import DeviceMessage from '../components/DeviceMessage';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/GlobalLoading';

class SelectModel extends Component {
  async componentDidMount () {
    showGlobalLoading();
    await this.props.fetchCountry(this.props.match.params.countryId);
    hideGlobalLoading();
  }

  async componentDidUpdate (prevProps) {
    if (
      prevProps.match.params.countryId !== this.props.match.params.countryId
    ) {
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

    if (models.length === 1) {
      const model = models[0];
      return <Redirect push to={`/explore/${model.id}`} />;
    }

    return (
      <ol className='model-list card-list'>
        {models.map(m => (
          <li key={m.id} className='model-list__item'>
            <article className='card card--sumary card--model'>
              <Link
                to={`/explore/${m.id}`}
                className='card__contents'
                title={`Select ${name}`}
              >
                <header className='card__header'>
                  <h1 className='card__title'>
                    <span>{m.name}</span>{' '}
                    <small className='label'>
                      <span>{m.version}</span>
                    </small>
                  </h1>
                </header>
                <div className='card__body'>
                  <div className='card__prose'>
                    <p>{m.description}</p>
                  </div>
                  <dl className='card__details'>
                    <dt>Updated</dt>
                    <dd>{m.updatedAt}</dd>
                    <dt>Author</dt>
                    <dd>{m.attribution && m.attribution.author}</dd>
                  </dl>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ol>
    );
  }

  render () {
    const { hasError } = this.props.country;
    if (hasError()) return <UhOh />;

    const countryName = this.props.country.isReady()
      ? this.props.country.getData().name
      : '';

    return (
      <App pageTitle='Select model'>
        <section className='inpage inpage--hub inpage--explore'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Explore {countryName}</h1>
                <p className='inpage__subtitle'>Select model</p>
              </div>
              <div className='inpage__hactions'>
                <Link
                  to='/countries'
                  className='exp-change-button'
                  title='Change country'
                >
                  <span>Change</span>
                </Link>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            {this.renderModelList()}
            <DeviceMessage />
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
    country: wrapApiResult(
      getFromState(state.individualCountries, props.match.params.countryId)
    )
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
