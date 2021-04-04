import React from 'react';
import { Popover } from 'antd';
import { Header } from 'semantic-ui-react';

class UserPopover extends React.Component {
	
	render(){
		let content = (
			<Header 
				content={`${this.props.user.title} | ${this.props.user.department} ${this.props.user.email}`}
				subheader={this.props.user.personalStatement}
			/>
		);
		
		return (
			<Popover content={content}>
				<span style={{color:'blue'}}>
					{this.props.user.username}
				</span>
			</Popover>
		);
	};
}

export default UserPopover;