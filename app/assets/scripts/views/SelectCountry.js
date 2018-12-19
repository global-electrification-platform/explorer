import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';

import { wrapApiResult } from '../redux/utils';
import { fetchCountries } from '../redux/actions';
import { environment } from '../config';

import App from './App';
import DeviceMessage from '../components/DeviceMessage';
import {
  showGlobalLoading,
  hideGlobalLoading
} from '../components/GlobalLoading';

const CountryCard = ({ iso, name }) => {
  return (
    <article className='card card--sumary card--country'>
      <Link
        to={`/countries/${iso}/models`}
        className='card__contents'
        title={`Select ${name}`}
      >
        <figure className='card__media'>
          <div className='card__thumb'>
            <img
              width='640'
              height='480'
              src={`/assets/graphics/content/flags-4x3/${iso}.svg`}
              alt='Country flag'
            />
          </div>
        </figure>
        <header className='card__header'>
          <h1 className='card__title'>{name}</h1>
        </header>
      </Link>
    </article>
  );
};

if (environment !== 'production') {
  CountryCard.propTypes = {
    iso: T.string,
    name: T.string
  };
}

class SelectCountry extends Component {
  async componentDidMount () {
    showGlobalLoading();
    await this.props.fetchCountries();
    hideGlobalLoading();
  }

  renderCountryList () {
    const { isReady, hasError, getData } = this.props.countries;

    if (!isReady()) return null;
    if (hasError()) return <p>Something went wrong. Try again.</p>;

    const countries = getData();

    if (countries.length === 1) {
      const country = countries[0];
      return <Redirect push to={`/countries/${country.id}/models`} />;
    }

    return (
      <ol className='country-list card-list'>
        {countries.map(c => (
          <li key={c.id} className='country-list__item'>
            <CountryCard iso={c.id} name={c.name} />
          </li>
        ))}
      </ol>
    );
  }

  render () {
    return (
      <App pageTitle='Select country'>
        <section className='inpage inpage--hub inpage--explore'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Explore</h1>
                <p className='inpage__subtitle'>Select country</p>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            {this.renderCountryList()}
            <DeviceMessage />
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  SelectCountry.propTypes = {
    fetchCountries: T.func,
    countries: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    countries: wrapApiResult(state.countries)
  };
}

function dispatcher (dispatch) {
  return {
    fetchCountries: (...args) => dispatch(fetchCountries(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(SelectCountry);
