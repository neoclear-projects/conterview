import { Button } from 'semantic-ui-react';
import { useHistory, Link } from 'react-router-dom';
import PageWrap from '../header/page-wrap';
import { logout } from '../../api/auth-api';
import { PageHeader, Breadcrumb } from 'antd';

function Home() {
  const history = useHistory();

  const routes = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to='/'>Home</Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  return (
    <PageWrap selected='home'>
      <PageHeader
        title="Home"
        style={{backgroundColor:'white',marginTop:'5px'}}
        extra={[
          <Button basic color='blue' onClick={() => history.push('/editor')}>
            Try Editor!
          </Button>,
          <Button basic color='green' onClick={() => history.push('/note')}>
            View Notes
          </Button>,
        ]}
        breadcrumbRender = {() => routes}
      >
      </PageHeader>
    </PageWrap>
  );
}

export default Home;
