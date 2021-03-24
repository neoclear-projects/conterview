import React from 'react';
import * as semanticUiReact from 'semantic-ui-react';
import { Languages } from './single-problem';
import singleProblem from './single-problem';
import ProblemOperation from './problem-operation'

import _ from 'lodash'

import PageWrap from '../header/page-wrap';
import PageHeader from '../header/page-header';
import PageContent from '../header/page-content';

import { getProblemSet, updateBatchProblemSet } from '../../api/problem-set-api';


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
    return new singleProblem({ NewName: "New Problem Name", NewDescription: "Description", newCorrectRate: 100, newPreferredLanguage:Languages['Python'], newID: "N/A" }, this);
  }

  state = { queryString: '', loading: false, results: [], value: '', needAnUpdate: false, ReallyNeedFetching: true, NewProblemTemplate: this.MakeNewProblemTemplate() };

  userProblemSet: Array<singleProblem> = [];
  userProblemSetPlaceholder = [
    new singleProblem({ NewName: "Break Bedrock in Vanilla Survival", NewDescription: "In Minecraft Java Edition, break any bedrock in surivial mode", newCorrectRate: 82.3, newPreferredLanguage:Languages['Java'], newID: "0" }, this),
    new singleProblem({ NewName: "Get Bedrock in Vanilla Survival", NewDescription: "In Minecraft Java Edition, get a bedrock item in surivial mode", newCorrectRate: 19.5, newPreferredLanguage:Languages['Java'], newID: "1" }, this),
    new singleProblem({ NewName: "Get Bedrock in Survival", NewDescription: "In Minecraft Bedrock Edition, get a bedrock item in surivial mode", newCorrectRate: 40, newPreferredLanguage:Languages.CPP, newID: "2" }, this),
    new singleProblem({ NewName: "Duplicate Dragon Egg", NewDescription: "In Minecraft Java Edition, get multiple Dragon Eggs in one world", newCorrectRate: 98.7, newPreferredLanguage:Languages['JavaScript'], newID: "3" }, this),
    new singleProblem({ NewName: "Duplicate TNTs", NewDescription: "In Minecraft Java Edition, Generate a TNT entity without losing a TNT block", newCorrectRate: 95.3, newPreferredLanguage:Languages['Java'], newID: "4" }, this),
    new singleProblem({ NewName: "Remotely Load chunks", NewDescription: "In Minecraft Java Edition, Load a chunk that's not in player's view range and not a spawn chunk.", newCorrectRate: 49.7, newPreferredLanguage:Languages['Java'], newID: "5" }, this),
    new singleProblem({ NewName: "Interrupt Light Update", NewDescription: "In Minecraft Java Edition, Build a Nether Portal without its surrounding lightened.", newCorrectRate: 8.3, newPreferredLanguage:Languages['Java'], newID: "6" }, this)
  ];


  StartGetFromBackend() {
    if (!this.state.ReallyNeedFetching) {
      return;
    }
    getProblemSet(
      (value) => {
        // console.log(value);
        this.GenerateProblemsFromJSON(value.data);
        this.setState({ needAnUpdate: true, ReallyNeedFetching: false });
        return value;
      },
      (err) => {
        return err;
      });
  }


  GenerateProblemsFromJSON(JSON: Array<{ problemName: string, description: string, correctRate: number, preferredLanguage: string, _id: string, starterCodes: {} }>) {
    this.userProblemSet = [];
    if (JSON.length === 0) {
      // this.userProblemSet = this.userProblemSetPlaceholder;
    }
    else {
      JSON.forEach(prob => {
        this.userProblemSet.push(new singleProblem({ NewName: prob.problemName, NewDescription: prob.description, newCorrectRate: prob.correctRate, newPreferredLanguage: Languages[`${prob.preferredLanguage}`], newID: prob._id }, this, prob.starterCodes))
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
        console.log(err);
        return err;
      });
  }

  GenerateStringBunk(ProblemSet: Array<singleProblem>): Array<JSX.Element> {
    var re = new RegExp(_.escapeRegExp(this.state.queryString), 'i');

    let a: Array<JSX.Element> = [];
    ProblemSet.forEach(element => {
      var isMatch = (oneSingleProblem: singleProblem) => re.test(oneSingleProblem.problemName) || re.test(oneSingleProblem.description) || re.test(oneSingleProblem.LanGenerate())
      if (isMatch(element)) {
        a.push(element.renderWithState(this));
      }
    });
    return a;
  }


  render() {
    this.state.needAnUpdate = false;

    this.StartGetFromBackend();

    var userProblemDisplay = this.GenerateStringBunk(this.userProblemSet);


    var HTML = (
      <PageWrap selected='problem-set'>
        <PageHeader>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignContent: "stretch",
          }}>
            <h1>Problem Set</h1>
            <semanticUiReact.Search
              loading={this.state.loading}
              noResultsMessage={"Please type in any content you want to find..."}
              onSearchChange={(e, data) => {
                this.setState({
                  queryString: data.value,
                  loading: true
                });
                userProblemDisplay = this.GenerateStringBunk(this.userProblemSet);
                this.setState({
                  loading: false
                });
              }}
              // results={[this.state.queryString]}
              value={this.state.queryString}
            />
            <ProblemOperation BelongingProblem={this.state.NewProblemTemplate} />
          </div>
        </PageHeader>
        <PageContent>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignContent: "stretch",
            padding: '30px 60px',
            backgroundColor: 'white',
            borderBottomWidth: 100,
            borderColor: 'black'
          }}>
            <semanticUiReact.Divider horizontal section color='blue' >
              {/* <Label color='blue'> */}
              <div style={{ fontSize: 24 }}>Your problem set</div>

              {/* </Label> */}
            </semanticUiReact.Divider>
            {/* <SearchExampleStandard setQueryCallback={this.setState}/> */}

            {/* <semanticUiReact.Button inverted color='blue' onClick={() => window.location.href = '/editProblem/New'}>
              Make a new problem?
            </semanticUiReact.Button> */}
            <semanticUiReact.Table celled padded striped>
              <semanticUiReact.Table.Body>
                <semanticUiReact.Table.Row>
                  <semanticUiReact.Table.HeaderCell singleLine>Problem</semanticUiReact.Table.HeaderCell>
                  {/* <semanticUiReact.Table.HeaderCell>Languages</semanticUiReact.Table.HeaderCell> */}
                  {/* <semanticUiReact.Table.HeaderCell singleLine>Pass Rate</semanticUiReact.Table.HeaderCell> */}
                  <semanticUiReact.Table.HeaderCell>Description</semanticUiReact.Table.HeaderCell>
                  <semanticUiReact.Table.HeaderCell>Operation</semanticUiReact.Table.HeaderCell>
                </semanticUiReact.Table.Row>
                {userProblemDisplay}
                {/* {this.userProblemSet} */}
              </semanticUiReact.Table.Body>
            </semanticUiReact.Table>
          </div>
        </PageContent>
      </PageWrap>
    );
    return HTML;
    // document.getElementById("goods_detail_content").innerHTML = this.state.goods_desc;
  }
}

export default ProblemSet;