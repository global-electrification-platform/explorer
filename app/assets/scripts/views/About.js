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
              <p>The Global Electrification Platform (GEP) is an open access, interactive, online platform that allows for overview of electrification investment scenarios for a selection of countries. The scenarios present pathways for achieving universal electricity access, split into an intermediate strategy for 2025 and full electrification by 2030.</p>

              <p>Users can explore 144 different scenarios to meet the access goals. These different combinations and parameters are presented in the form of "levers". Users can overlay additional layers as well (e.g. wind potential, electricity networks, location of health facilities) to help illustrate useful contextual information about a selected country.</p>

              <p>The current set of results in the GEP were created using the Open Source Spatial Electrification Tool (gep-onsset). In the interests of transparency and collaboration, the modelling process has been opened for feedback and improvements from other institutions, experts and practitioners. Based on this process, the GEP will be updated annually with improved data and processes, as well as new models.</p>

              <p>For any inquiries and potential collaboration please refer to </p>

              <h2>Credits</h2>
              <dl className='logo-list'>
                <dt>Supporters</dt>
                <dd>
                  <a
                    href='https://www.kth.se'
                    title='Visit KTH'
                  >
                    <img
                      width='640'
                      height='320'
                      alt='KTH Logo'
                      src='/assets/graphics/content/logos/logo-kth.png'
                    />
                    <span>KTH</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://loremipsum.io/21-of-the-best-placeholder-image-generators/'
                    title='Visit placeholder'
                  >
                    <img
                      width='640'
                      height='320'
                      alt='Placeholder logo'
                      src='https://fakeimg.pl/640x320'
                    />
                    <span>Placeholder</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://loremipsum.io/21-of-the-best-placeholder-image-generators/'
                    title='Visit placeholder'
                  >
                    <img
                      width='640'
                      height='320'
                      alt='Placeholder logo'
                      src='https://fakeimg.pl/640x320'
                    />
                    <span>Placeholder</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://loremipsum.io/21-of-the-best-placeholder-image-generators/'
                    title='Visit placeholder'
                  >
                    <img
                      width='640'
                      height='320'
                      alt='Placeholder logo'
                      src='https://fakeimg.pl/640x320'
                    />
                    <span>Placeholder</span>
                  </a>
                </dd>
                <dd>
                  <a
                    href='https://loremipsum.io/21-of-the-best-placeholder-image-generators/'
                    title='Visit placeholder'
                  >
                    <img
                      width='640'
                      height='320'
                      alt='Placeholder logo'
                      src='https://fakeimg.pl/640x320'
                    />
                    <span>Placeholder</span>
                  </a>
                </dd>
                <dt>Developed by</dt>
                <dd>
                  <a
                    className='logo-devseed'
                    href='http://developmentseed.org/'
                    title='Visit Development Seed'
                  >
                    <img
                      width='750'
                      height='128'
                      alt='Development Seed logo'
                      src='/assets/graphics/content/logos/logo-devseed-flat-pos.svg'
                    />
                    <span>Development Seed</span>
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
