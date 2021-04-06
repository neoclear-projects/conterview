import React from 'react';
import { Popover } from 'antd';
import { Header } from 'semantic-ui-react';
import '../../util/clickable.css';

class UserPopover extends React.Component {
	render(){
		let user = this.props.user;
		let headerContent = user.title && user.department ? `${user.title} | ${user.department} ${user.email}` : user.email;

		let content = (
			<Header 
				content={headerContent}
				subheader={user.personalStatement}
			/>
		);
		
		return (
			<Popover content={content}>
				<span className='clickable' style={{color:'blue'}}>
					{user.username}
				</span>
			</Popover>
		);
	};
}

export default UserPopover;