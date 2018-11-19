import React, { Component } from 'react';
import T from 'prop-types';
import c from 'classnames';

import MetaTags from '../components/MetaTags';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';

import { environment, appTitle, appDescription } from '../config';

class App extends Component {
  render () {
    const { pageTitle, className, children, location } = this.props;

    const title = pageTitle ? `${pageTitle} — ` : '';
    return (
      <div className={c('page', className)}>
        <MetaTags title={`${title}${appTitle} `} description={appDescription} />

        <PageHeader location={location} />
        <main className='page__body' role='main'>
          {children}
        </main>
        <PageFooter location={location} />
      </div>
    );
  }
}

if (environment !== 'production') {
  App.propTypes = {
    className: T.string,
    pageTitle: T.string,
    location: T.object,
    children: T.node
  };
}

export default App;
