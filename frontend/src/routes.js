import React from 'react';
import { Switch, Route } from "react-router-dom";
import Login from './auth/login';
import Register from './auth/register';
import RegisterOrganization from './auth/register-organization';
import NotFoundPage from './doc/not-found-page';
import Editor from './page/editor/editor';

import Position from './components/position/position';
import PositionItem from './components/position/position-item';
import Interview from './components/interview/interview';
import InterviewItem from './components/interview/interview-item';
import Home from './components/home/home';
import ProblemSet from './components/problem-set/problem-set';
import Statistics from './components/statistics/statistics';
import PositionStat from './components/statistics/position-stat';
import InterviewStat from './components/statistics/interview-stat';
import Profile from './components/profile/profile';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register-organization' component={RegisterOrganization} />

        <Route exact path='/position/:positionId/interview/:interviewId/running' component={Editor} />

        <Route exact path='/' component={Home} />
        <Route exact path='/position' component={Position} />
        <Route exact path='/position/:positionId' component={PositionItem} />
        <Route exact path='/position/:positionId/interview/:interviewId' component={InterviewItem} />
        <Route exact path='/interview' component={Interview} />
        <Route exact path='/problem-set' component={ProblemSet} />
        <Route exact path='/statistics' component={Statistics} />
        <Route exact path='/position/:positionId/statistics' component={PositionStat} />
        <Route exact path='/position/:positionId/interview/:interviewId/statistics' component={InterviewStat} />
        <Route exact path='/profile' component={Profile} />

        <Route path='*' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
