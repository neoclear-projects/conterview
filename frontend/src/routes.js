import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
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

import { getStatus } from './api/auth-api';
import { Spin } from 'antd';
import req from './api/req';

//import PrivateRoute from './auth/private-route';

class Routes extends React.Component {
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     loading:true,
  //     unauthorized:false,
  //   };

  //   getStatus(res => {this.setState({loading:false});},
  //     err => {
  //       console.log(err.response);
  //       if(err.response.status === 401) {
  //         this.setState({unauthorized:true, loading:false});
  //       }
  //     }
  //   );
  // }  

  // privateRoute = () => {
  //   getStatus(res => {this.setState({loading:false});},
  //     err => {
  //       console.log(err.response);
  //       if(err.response.status === 401) {
  //         this.setState({unauthorized:true, loading:false});
  //       }
  //     }
  //   );
  // }

  render() {
    // if(this.state.loading) return <Spin/>;
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
