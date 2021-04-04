import React from 'react';
import PageWrap from '../header/page-wrap';
import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

class Statistics extends React.Component {
  render() {
    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/statistics'>Statistics</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    return (
      <PageWrap selected='statistics'>
        <PageHeader
          title='Statistics'
          style={{backgroundColor:'white',marginTop:'5px'}}
          breadcrumbRender = {() => routes}
        >
        </PageHeader>
        <div style={{margin:'25px', display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <div style={{backgroundColor:'white', width:'calc(50% - 10px)', padding:'20px'}}>
            <Header>Positions Ready</Header>
          </div>
          <div style={{backgroundColor:'white', width:'calc(50% - 10px)', padding:'20px'}}>
            <Header>Interviews Ready</Header>
          </div>
        </div>
      </PageWrap>
    );
  }
}

export default Statistics;
