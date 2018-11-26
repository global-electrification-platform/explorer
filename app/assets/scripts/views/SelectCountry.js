import React, { Component } from 'react';

import App from './App';

class SelectCountry extends Component {
  render () {
    return (
      <App pageTitle='Select country'>
        <section className='inpage inpage--hub inpage--explore'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>Explore</h1>
                <h2 className='inpage__sectitle'>Select country</h2>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <ol className='country-list card-list'>
              <li className='country-list__item'>
                <article className='card card--sumary card--country'>
                  <a href='#' className='card__contents' title='Select country'>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img width='640' height='480' src='/assets/graphics/content/flags-4x3/mw.svg' alt='Country flag' />
                      </div>
                    </figure>
                    <header className='card__header'>
                      <h1 className='card__title'>Malawi</h1>
                    </header>
                  </a>
                </article>
              </li>

              <li className='country-list__item'>
                <article className='card card--sumary card--country'>
                  <a href='#' className='card__contents' title='Select country'>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img width='640' height='480' src='/assets/graphics/content/flags-4x3/mw.svg' alt='Country flag' />
                      </div>
                    </figure>
                    <header className='card__header'>
                      <h1 className='card__title'>Malawi</h1>
                    </header>
                  </a>
                </article>
              </li>

              <li className='country-list__item'>
                <article className='card card--sumary card--country'>
                  <a href='#' className='card__contents' title='Select country'>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img width='640' height='480' src='/assets/graphics/content/flags-4x3/mw.svg' alt='Country flag' />
                      </div>
                    </figure>
                    <header className='card__header'>
                      <h1 className='card__title'>Malawi</h1>
                    </header>
                  </a>
                </article>
              </li>

              <li className='country-list__item'>
                <article className='card card--sumary card--country'>
                  <a href='#' className='card__contents' title='Select country'>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img width='640' height='480' src='/assets/graphics/content/flags-4x3/mw.svg' alt='Country flag' />
                      </div>
                    </figure>
                    <header className='card__header'>
                      <h1 className='card__title'>Malawi</h1>
                    </header>
                  </a>
                </article>
              </li>

              <li className='country-list__item'>
                <article className='card card--sumary card--country'>
                  <a href='#' className='card__contents' title='Select country'>
                    <figure className='card__media'>
                      <div className='card__thumb'>
                        <img width='640' height='480' src='/assets/graphics/content/flags-4x3/mw.svg' alt='Country flag' />
                      </div>
                    </figure>
                    <header className='card__header'>
                      <h1 className='card__title'>Malawi</h1>
                    </header>
                  </a>
                </article>
              </li>
            </ol>
          </div>
        </section>
      </App>
    );
  }
}

export default SelectCountry;
