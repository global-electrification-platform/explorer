import React, { Component } from 'react';
import T from 'prop-types';
import c from 'classnames';

import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';

class App extends Component {
  render () {
    const { className, children, location } = this.props;

    return (
      <div className={c('page', className)}>
        <PageHeader location={location} />
        <main className='page__body' role='main'>
          {children}
        </main>
        <PageFooter location={location} />
      </div>
    );
  }
}

App.propTypes = {
  children: T.node,
  location: T.object,
  className: T.string
};

export default App;
