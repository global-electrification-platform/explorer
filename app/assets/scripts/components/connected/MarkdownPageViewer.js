import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import ReactMarkdown from 'react-markdown';

import { environment } from '../../config';
import { fetchAboutPage } from '../../redux/actions';
import { wrapApiResult, getFromState } from '../../redux/utils';

class MarkdownPageViewer extends PureComponent {
  componentDidMount () {
    this.props.fetchAboutPage(this.props.fileUrl);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.fileUrl !== nextProps.fileUrl) {
      this.props.fetchAboutPage(nextProps.fileUrl);
    }
  }

  render () {
    const { title } = this.props;
    const { getData, isReady, hasError, error } = this.props.pageData;

    if (!isReady()) {
      return (
        <React.Fragment>
          <h1>{title}</h1>
          <p>Loading page data</p>
        </React.Fragment>
      );
    }

    if (hasError()) {
      return error.statusCode === 404 ? (
        <React.Fragment>
          <h1>{title} - Not Found</h1>
          <p>This page was not found</p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1>{title}</h1>
          <p>Something went wrong while loading the page</p>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h1>{title}</h1>
        <ReactMarkdown source={getData()} />
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  MarkdownPageViewer.propTypes = {
    fetchAboutPage: T.func,
    title: T.string,
    fileUrl: T.string,
    pageData: T.object
  };
}

function mapStateToProps (state, props) {
  return {
    pageData: wrapApiResult(
      getFromState(state.individualAboutPages, props.fileUrl)
    )
  };
}

function dispatcher (dispatch) {
  return {
    fetchAboutPage: (...args) => dispatch(fetchAboutPage(...args))
  };
}

export default connect(
  mapStateToProps,
  dispatcher
)(MarkdownPageViewer);
