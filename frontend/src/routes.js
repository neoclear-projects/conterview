import React from 'react';
import { Switch, Route } from "react-router-dom";
import Login from './auth/login';
import Register from './auth/register';
import RegisterOrganization from './auth/register-organization';
import NotFoundPage from './doc/not-found-page';
import Note from './page/note/note';
import Editor from './page/editor/editor';
import RunningInterview from './page/running-interview/running-interview';

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

import PrivateRoute from './auth/private-route';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register-organization' component={RegisterOrganization} />
        <Route exact path='/editor' component={Editor} />
        <Route exact path='/note' component={Note} />
        <Route exact path='/position/:positionId/interview/:interviewId/running' component={Editor} />
        <PrivateRoute exact path='/' component={Home} />
        <PrivateRoute exact path='/position' component={Position} />
        <PrivateRoute exact path='/position/:positionId' component={PositionItem} />
        <PrivateRoute exact path='/position/:positionId/interview/:interviewId' component={InterviewItem} />
        <PrivateRoute exact path='/interview' component={Interview} />
        <PrivateRoute exact path='/problem-set' component={ProblemSet} />
        <PrivateRoute exact path='/statistics' component={Statistics} />
        <PrivateRoute exact path='/position/:positionId/statistics' component={PositionStat} />
        <PrivateRoute exact path='/position/:positionId/interview/:interviewId/statistics' component={InterviewStat} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <Route path='*' component={NotFoundPage} />
      </Switch>
    );
  }
}

export default Routes;
