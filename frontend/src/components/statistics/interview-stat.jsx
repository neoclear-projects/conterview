import React from 'react';
import PageWrap from '../header/page-wrap';

class InterviewStat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      interview:{},
    }
    getInterview(this.props.match.params.positionId, this.props.match.params.interviewId, '', res => {
      this.state.interview = res.data;
      this.setState({loading: false});
    });
  }

  render() {
    return (
      <PageWrap selected='statistics'>
      </PageWrap>
    );
  }
}

export default InterviewStat;