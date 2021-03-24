import React from 'react';

class RunningInterview extends React.Component {
	render() {
		return (
			<p>welcome to interview #{this.props.match.params.interviewId}</p>
		);
	}
}

export default RunningInterview;
