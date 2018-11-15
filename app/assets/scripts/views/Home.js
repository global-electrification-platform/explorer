import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  render () {
    return (
      <article className='inpage inpage--home'>
        <header className='inpage__header'>
          <div class='inpage__subheader'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Homepage</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <section className='home-intro prose'>
            <h2 className='home-intro__title'><span>Welcome to the</span> Global Electrification Platform Explorer</h2>
            <div className='home-intro__lead'>
              <p>Explore least cost electrification strategies around the world, interacting with country contextual data and diferent investment scenarios.</p>
            </div>

            <dl className='stats-list'>
              <dt>Models</dt>
              <dd>03</dd>
              <dt>Countries</dt>
              <dd>32</dd>
            </dl>

            <p className='cta-wrapper'>
              <Link to='/explore' title='Explore the data' className='ctab ctab--explore'><span>Start exploring</span></Link>
              <small>or</small>
              <Link to='/about' title='Learn about the tool' className='ctab ctab--about'><span>Learn more</span></Link>
            </p>
          </section>
        </div>
      </article>
    );
  }
}

export default Home;
