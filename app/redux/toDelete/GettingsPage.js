// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route, Redirect, IndexRoute } from 'react-router';
import GettingsPageOne from './GettingsPageOne';
import GettingsPageTwo from './GettingsPageTwo';
import GettingsPageThree from './GettingsPageThree';


class GettingsPage extends Component<Props> {
  props: Props;

  render() {
    const { goOne, goTwo, match } = this.props;
    console.log('match', match);
    return (
      <div>
        <div>gettingsPage</div>
        <span
          onClick={() => { goOne() }}
        >
          goToGettings one
        </span>
        <br/>
        <span
          onClick={() => { goTwo() }}
        >
          goToGettings two
        </span>
        <br/>

        <Switch>
          <Route path={`${match.path}/one`} component={GettingsPageOne} />
          <Route path={`${match.path}/two`} component={GettingsPageTwo} />
          <Route path={`${match.path}/tree`} component={GettingsPageThree} />
          <Route component={GettingsPageOne}/>
        </Switch>

      </div>
    );
  }
}


//<Route path="/two" component={GettingsPageTwo} />
//<Route path="/tree" component={GettingsPageThree} />

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goOne: () => dispatch => dispatch(push('/gettings/one')),
      goTwo: () => dispatch => dispatch(push('/gettings/Two'))
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(GettingsPage);
