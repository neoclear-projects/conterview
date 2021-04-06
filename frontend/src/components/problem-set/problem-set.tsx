import { PageHeader, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import React from 'react';
import * as semanticUiReact from 'semantic-ui-react';
import { getProblemSet, getProblemSetPageCount, updateBatchProblemSet } from '../../api/problem-set-api';
import PageWrap from '../header/page-wrap';
import ProblemOperation from './problem-operation';
import singleProblem, { Languages } from './single-problem';
import { string } from 'prop-types';





// export function DispatchAndGenerateStringBunkWithREGEX(ProblemSet: Array<singleProblem>, Regex: string): Array<JSX.Element> {
//   var re = new RegExp(_.escapeRegExp(Regex), 'i');

//   let a: Array<JSX.Element> = [];
//   ProblemSet.forEach(element => {
//     var isMatch = (oneSingleProblem: singleProblem) => re.test(oneSingleProblem.problemName) || re.test(oneSingleProblem.description) || re.test(oneSingleProblem.LanGenerate())
//     if (isMatch(element)) {
//       a.push(element.render());
//     }
//   });
//   return a;
// }

class ProblemSet extends React.Component {
  MakeNewProblemTemplate(): singleProblem {
    return new singleProblem({ NewName: "New Problem Name", NewDescription: "# Description \r\n - Markdown is supported for description!", newCorrectRate: 100, newPreferredLanguage: Languages['Python'], newID: "N/A" }, this, ["0\n",], ["1\n",], []);
  }

  state = { queryString: '', loading: false, results: [], value: '', needAnUpdate: false, ReallyNeedFetching: true, NewProblemTemplate: this.MakeNewProblemTemplate(), PageNum: 1, };
  TotalPages = 1;
  userProblemSet: Array<singleProblem> = [];
  // userProblemSetPlaceholder = [
  //   new singleProblem({ NewName: "Break Bedrock in Vanilla Survival", NewDescription: "In Minecraft Java Edition, break any bedrock in surivial mode", newCorrectRate: 82.3, newPreferredLanguage:Languages['Java'], newID: "0" }, this),
  //   new singleProblem({ NewName: "Get Bedrock in Vanilla Survival", NewDescription: "In Minecraft Java Edition, get a bedrock item in surivial mode", newCorrectRate: 19.5, newPreferredLanguage:Languages['Java'], newID: "1" }, this),
  //   new singleProblem({ NewName: "Get Bedrock in Survival", NewDescription: "In Minecraft Bedrock Edition, get a bedrock item in surivial mode", newCorrectRate: 40, newPreferredLanguage:Languages.CPP, newID: "2" }, this),
  //   new singleProblem({ NewName: "Duplicate Dragon Egg", NewDescription: "In Minecraft Java Edition, get multiple Dragon Eggs in one world", newCorrectRate: 98.7, newPreferredLanguage:Languages['JavaScript'], newID: "3" }, this),
  //   new singleProblem({ NewName: "Duplicate TNTs", NewDescription: "In Minecraft Java Edition, Generate a TNT entity without losing a TNT block", newCorrectRate: 95.3, newPreferredLanguage:Languages['Java'], newID: "4" }, this),
  //   new singleProblem({ NewName: "Remotely Load chunks", NewDescription: "In Minecraft Java Edition, Load a chunk that's not in player's view range and not a spawn chunk.", newCorrectRate: 49.7, newPreferredLanguage:Languages['Java'], newID: "5" }, this),
  //   new singleProblem({ NewName: "Interrupt Light Update", NewDescription: "In Minecraft Java Edition, Build a Nether Portal without its surrounding lightened.", newCorrectRate: 8.3, newPreferredLanguage:Languages['Java'], newID: "6" }, this)
  // ];

  constructor(props: any) {
    super(props);
    this.GetPageCount();
  }

  GetPageCount() {
    getProblemSetPageCount((value) => {
      this.TotalPages = Number(value.data.count);
      return value;
    },
      (err) => {
        this.TotalPages = 1;
        return err;
      });
  }

  GetFromBackend(Query: string, PageNum: number, OnSuccess: () => void = (() => { })) {
    if (!this.state.ReallyNeedFetching) {
      return;
    }
    getProblemSet(Query.length < 3?"":Query, PageNum,
      (value) => {
        // console.log(value);
        this.GenerateProblemsFromJSON(value.data);
        this.setState({ needAnUpdate: true, ReallyNeedFetching: false });
        OnSuccess();
        return value;
      },
      (err) => {
        return err;
      });
  }


  GenerateProblemsFromJSON(JSON: Array<{ problemName: string, description: string, correctRate: number, preferredLanguage: string, _id: string, problemInputSet: Array<string>, problemOutputSet: Array<string>, problemRubric: Array<{ name: string, desc: string, rating: number }>, starterCodes: {} }>) {
    this.userProblemSet = [];
    if (JSON.length === 0) {
      // this.userProblemSet = this.userProblemSetPlaceholder;
    }
    else {
      JSON.forEach(prob => {
        this.userProblemSet.push(new singleProblem({ NewName: prob.problemName, NewDescription: prob.description, newCorrectRate: prob.correctRate, newPreferredLanguage: Languages[`${prob.preferredLanguage}`], newID: prob._id }, this, prob.problemInputSet, prob.problemOutputSet, prob.problemRubric, prob.starterCodes))
      });
    }
  }

  public quickUpdateState(message = "") {
    // console.log(message);
    updateBatchProblemSet(
      this.userProblemSet,
      (value) => {
        this.setState({ needAnUpdate: true, ReallyNeedFetching: true });
        // console.log(message, message);
        return value;
      },
      (err) => {
        console.error(err);
        return err;
      });
  }

  GenerateStringBunk(ProblemSet: Array<singleProblem>): Array<JSX.Element> {
    // var re = new RegExp(_.escapeRegExp(this.state.queryString), 'i');

    let a: Array<JSX.Element> = [];
    ProblemSet.forEach(element => {
      // var isMatch = (oneSingleProblem: singleProblem) => re.test(oneSingleProblem.problemName) || re.test(oneSingleProblem.description) || re.test(oneSingleProblem.ID)
      // if (isMatch(element)) {
        a.push(element.renderWithState(this));
      // }
    });
    return a;
  }

  PrestoredStringBunk = this.GenerateStringBunk(this.userProblemSet);

  render() {

    this.GetPageCount();
    this.GetFromBackend(this.state.queryString, this.state.PageNum);

    if(this.state.queryString.length < 3){
      this.PrestoredStringBunk = this.GenerateStringBunk(this.userProblemSet);
    }
    var userProblemDisplay = this.PrestoredStringBunk;

    const routes = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to='/'>Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to='/problem-set'>Problem Set</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    var HTML = (
      <PageWrap selected='problem-set'>
        <PageHeader
          title="Problem Set"
          style={{ backgroundColor: 'white', marginTop: '5px' }}
          extra={[
            <semanticUiReact.Grid>
              <semanticUiReact.Search
                loading={this.state.loading}
                noResultsMessage={"Please type in at least 3 character..."}
                onSearchChange={(e, data) => {
                  
                  this.setState({
                    queryString: data.value,
                    loading: true,
                    ReallyNeedFetching: true
                  }, () => {
                    if (data.value == undefined || data.value.length < 3 ){
                      return;
                    }
                    this.GetFromBackend(String(data.value), -1, () => {
                      this.PrestoredStringBunk = this.GenerateStringBunk(this.userProblemSet);
                      userProblemDisplay = this.PrestoredStringBunk;
                      this.setState({
                        loading: false,
                        ReallyNeedFetching: true,
                        needAnUpdate: true
                      });
                      this.quickUpdateState();
                    });
                  });


                }}
                value={this.state.queryString}
              />
              <ProblemOperation BelongingProblem={this.state.NewProblemTemplate} />
            </semanticUiReact.Grid>
          ]}
          breadcrumbRender={() => routes}
        >
        </PageHeader>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignContent: "stretch",
          padding: '30px 60px',
          backgroundColor: 'white',
          margin: '2%',
          marginBottom: '10%'
        }}>
          <semanticUiReact.Divider horizontal section color='blue' >
            {/* <Label color='blue'> */}
            {/* <div style={{ fontSize: 24 }}>Your problem set</div> */}

            {/* </Label> */}
          </semanticUiReact.Divider>
          {/* <SearchExampleStandard setQueryCallback={this.setState}/> */}

          {/* <semanticUiReact.Button inverted color='blue' onClick={() => window.location.href = '/editProblem/New'}>
              Make a new problem?
            </semanticUiReact.Button> */}
          <semanticUiReact.Table celled padded striped basic='very'>
            <semanticUiReact.Table.Body>
              <semanticUiReact.Table.Row>
                <semanticUiReact.Table.HeaderCell singleLine>Problem Name</semanticUiReact.Table.HeaderCell>
                {/* <semanticUiReact.Table.HeaderCell>Languages</semanticUiReact.Table.HeaderCell> */}
                {/* <semanticUiReact.Table.HeaderCell singleLine>Pass Rate</semanticUiReact.Table.HeaderCell> */}
                <semanticUiReact.Table.HeaderCell>Description</semanticUiReact.Table.HeaderCell>
                <semanticUiReact.Table.HeaderCell>OPEN</semanticUiReact.Table.HeaderCell>
              </semanticUiReact.Table.Row>
              {userProblemDisplay}
              {/* {this.userProblemSet} */}
            </semanticUiReact.Table.Body>
          </semanticUiReact.Table>
          {this.state.queryString.length<3?(<semanticUiReact.Pagination
            activePage={this.state.PageNum}
            totalPages={this.TotalPages}
            onPageChange={(e, NewPage) => {
              var NewPageNum = Math.ceil(Number(NewPage.activePage));
              this.setState({ PageNum: NewPageNum });
              this.GetFromBackend(this.state.queryString, NewPageNum);
              this.quickUpdateState();
            }}
          />):<div/>}
        </div>
      </PageWrap>
    );
    return HTML;
    // document.getElementById("goods_detail_content").innerHTML = this.state.goods_desc;
  }
}

export default ProblemSet;