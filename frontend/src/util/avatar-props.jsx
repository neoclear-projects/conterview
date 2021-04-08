function getInitials(username){
  let initials = '';
  username.split(' ').forEach(s => initials = initials + s.charAt(0));
  return initials;
}

export function avatarProps(userId, username, size){
	if(username){
		return {
      src:`${process.env.REACT_APP_SERVER}/api/organization/${window.localStorage.getItem('organizationId')}/user/${userId}/avatar`,
      size,
      children:getInitials(username)
    };
	}
}