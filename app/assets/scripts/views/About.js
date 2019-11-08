import React, { Component } from 'react';

import App from './App';

class About extends Component {
  render () {
    return (
      <App pageTitle='About'>
        <article className='inpage inpage--single inpage--about'>
          <header className='inpage__header'>
            <div className='inpage__subheader'>
              <div className='inpage__headline'>
                <h1 className='inpage__title'>About</h1>
              </div>
            </div>
          </header>
          <div className='inpage__body'>
            <div className='prose'>
              <h2>The tool</h2>
              <p>
                The Global Electrification Platform (GEP) is an open access,
                interactive, online platform that allows for overview of
                electrification investment scenarios for a selection of
                countries. The scenarios present pathways for achieving
                universal electricity access, split into an intermediate
                strategy for 2025 and full electrification by 2030.
              </p>

              <p>
                Users can explore 216 different scenarios to meet the access
                goals. These different combinations and parameters are presented
                in the form of "levers". Users can overlay additional layers as
                well (e.g. wind potential, electricity networks, location of
                health facilities) to help illustrate useful contextual
                information about a selected country.
              </p>

              <p>
                The current set of results in the GEP were created using the
                Open Source Spatial Electrification Tool (
                <a
                  href='https://github.com/global-electrification-platform/gep-onsset'
                  target='_blank'
                >
                  gep-onsset
                </a>
                ). In the interests of transparency and collaboration, the
                modelling process has been{' '}
                <a
                  href='https://docs.google.com/spreadsheets/d/1JiV6QT1IBkJR7Q-FntC2zl3aZI2X5IMxrDI9gWupG5M/edit?usp=sharing'
                  target='_blank'
                >
                  opened
                </a>{' '}
                for feedback and improvements from other institutions, experts
                and practitioners. Based on this process, the GEP will be
                updated annually with improved data and processes, as well as
                new models.
              </p>

              <p>
                For any inquiries and potential collaboration please contact the
                development team:
              </p>
              <ul>
                <li>
                  <b>The World Bank:</b> Chiara Odetta Rogate –{' '}
                  <a href='mailto:crogate@worldbank.org'>
                    crogate@worldbank.org
                  </a>
                </li>
                <li>
                  <b>KTH dESA:</b> Mark Howells –{' '}
                  <a href='mailto:mark.howells@energy.kth.se'>
                    mark.howells@energy.kth.se
                  </a>
                </li>
                <li>
                  <b>Development Seed:</b> Olaf Veerman –{' '}
                  <a href='mailto:olaf@developmentseed.org'>
                    olaf@developmentseed.org
                  </a>
                </li>
                <li>
                  <b>WRI:</b> Dimitrios Mentis –{' '}
                  <a href='mailto:Dimitrios.Mentis@wri.org'>
                    Dimitrios.Mentis@wri.org
                  </a>
                </li>
                <li>
                  <b>Google:</b> Saleem Van Groenou –{' '}
                  <a href='mailto:svangroenou@google.com'>
                    svangroenou@google.com
                  </a>
                </li>
                <li>
                  <b>ABB:</b> Alexandre Oudalov –{' '}
                  <a href='mailto:alexandre.oudalov@ch.abb.com'>
                    alexandre.oudalov@ch.abb.com
                  </a>
                </li>
              </ul>

              <h2 className='visually-hidden'>Credits</h2>
              <dl className='logo-list'>
                <dt>Consortium</dt>
                <dd>
                  <a
                    href='https://www.worldbank.org/'
                    title='Visit World Bank'
                    target='_blank'
                  >
                    <img
                      alt='WBG Logo'
                      src='/assets/graphics/content/logos/logo-wbg.png'
                    />
                    <span>KTH</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.esmap.org/'
                    title='Visit Energy Sector Management Assistance Program'
                    className='logo-esmap'
                    target='_blank'
                  >
                    <img
                      alt='ESMAP Logo'
                      src='/assets/graphics/content/logos/logo-esmap.png'
                    />
                    <span>ESMAP</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.kth.se/en'
                    title='Visit KTH'
                    target='_blank'
                  >
                    <img
                      alt='KTH Logo'
                      src='/assets/graphics/content/logos/logo-kth.png'
                    />
                    <span>KTH</span>
                  </a>
                </dd>
                <dd>
                  <a
                    className='logo-devseed'
                    href='https://developmentseed.org/'
                    title='Visit Development Seed'
                    target='_blank'
                  >
                    <img
                      alt='Development Seed logo'
                      src='/assets/graphics/content/logos/logo-devseed.svg'
                    />
                    <span>Development Seed</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.wri.org/'
                    title='Visit World Resources Institute'
                    target='_blank'
                  >
                    <img
                      alt='WRI Logo'
                      src='/assets/graphics/content/logos/logo-wri.png'
                    />
                    <span>WRI</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.abb.com/'
                    title='Visit ABB'
                    target='_blank'
                  >
                    <img
                      alt='ABB logo'
                      src='/assets/graphics/content/logos/logo-abb.png'
                    />
                    <span>ABB</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.google.com/'
                    title='Visit Google'
                    target='_blank'
                  >
                    <img
                      alt='Google logo'
                      src='/assets/graphics/content/logos/logo-google.png'
                    />
                    <span>Google</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.cam.ac.uk/'
                    title='Visit University of Cambridge'
                    target='_blank'
                  >
                    <img
                      alt='University of Cambridge logo'
                      src='/assets/graphics/content/logos/logo-university-of-cambridge.png'
                    />
                    <span>Google</span>
                  </a>
                </dd>
                <dt>In collaboration with</dt>
                <dd>
                  <a
                    href='https://socialgood.fb.com'
                    title='Visit Facebook'
                    target='_blank'
                  >
                    <img
                      alt='Facebook logo'
                      src='/assets/graphics/content/logos/logo-facebook.png'
                    />
                    <span>Facebook</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='http://www.optimus.community/'
                    title='Visit Optimus Community'
                    target='_blank'
                  >
                    <img
                      alt='Optimus logo'
                      src='/assets/graphics/content/logos/optimus.png'
                    />
                    <span>Optimus</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.powerforall.org/'
                    title='Visit Power for All'
                    target='_blank'
                  >
                    <img
                      alt='Power for All logo'
                      src='/assets/graphics/content/logos/logo-powerforall.png'
                    />
                    <span>Power for All</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.seforall.org/'
                    title='Visit SE for All'
                    target='_blank'
                  >
                    <img
                      alt='SE4All logo'
                      src='/assets/graphics/content/logos/logo-seforall.png'
                    />
                    <span>SE for All</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.unsdsn.org/'
                    title='Visit Sustainable Development Solutions Network'
                    target='_blank'
                  >
                    <img
                      alt='SDSN logo'
                      src='/assets/graphics/content/logos/logo-sdsn.png'
                    />
                    <span>Sustainable Development Solutions Network</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.un.org/development/desa/en/'
                    title='Visit UNDESA'
                    target='_blank'
                  >
                    <img
                      alt='UNDESA logo'
                      src='/assets/graphics/content/logos/logo-undesa.png'
                    />
                    <span>
                      United Nations Department of Economic and Social Affairs
                    </span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.undp.org/'
                    title='Visit UNDP'
                    target='_blank'
                  >
                    <img
                      alt='UNDP logo'
                      src='/assets/graphics/content/logos/logo-undp.png'
                    />
                    <span>UNDP</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.uneca.org/'
                    title='Visit UNECA'
                    target='_blank'
                  >
                    <img
                      alt='UNECA logo'
                      src='/assets/graphics/content/logos/logo-uneca.png'
                    />
                    <span>United Nations for Africa</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://www.ukaiddirect.org/'
                    title='Visit UK Aid'
                    target='_blank'
                  >
                    <img
                      alt='UKaid logo'
                      src='/assets/graphics/content/logos/logo-ukaid.jpg'
                    />
                    <span>UK Aid</span>
                  </a>
                </dd>
              </dl>
            </div>
          </div>
        </article>
      </App>
    );
  }
}

export default About;
