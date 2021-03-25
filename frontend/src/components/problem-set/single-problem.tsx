import { Button, Table } from 'semantic-ui-react';
import { postProblemSet } from '../../api/problem-set-api';
import ProblemDeletion from './problem-deletion';
import ProblemOperation from './problem-operation';
import ProblemSet from './problem-set';



const TemplateStarterCodes: { [key: string]: string; } = {
  'C++':
    'class Solution {\r\n' +
    '  \tpublic:\r\n \tString solve(String s) {\r\n\r\n' +
    '  }\r\n' +
    '}',
  'Java':
    'class Solution {\r\n' +
    '  \tpublic String solve(String s) {\r\n\r\n' +
    '  }\r\n' +
    '}',
  'Python': 'class Solution:\r\n' +
    '\tdef solve(self, s: str) -> str:',
  'JavaScript': 'var solve = function(s) {\r\n\r\n};',
  'TypeScript': 'var solve = function(s: string): string {\r\n\r\n};',

};

export enum Languages {
  CPP ="C++",
  Java ="Java",
  Python ="Python",
  JavaScript ="JavaScript",
  TypeScript ="TypeScript"
}

export const LanguageOptions = [
  {
    key: Languages.CPP,
    text: "C++",
    value: Languages.CPP,
  },
  {
    key: Languages['Java'],
    text: "Java",
    value: Languages['Java'],
  },
  {
    key: Languages['Python'],
    text: "Python",
    value: Languages['Python'],
  },
  {
    key: Languages['JavaScript'],
    text: "JavaScript",
    value: Languages['JavaScript'],
  },
  {
    key: Languages['TypeScript'],
    text: "TypeScript",
    value: Languages['TypeScript'],
  },
];

// export class singleProblem extends Component {
export class singleProblem {
  parentProblemSet: ProblemSet;
  props = {};
  public problemName: string = "Name";
  public getProblemName() { return this.problemName };
  public description: string = "Description";
  public getDescription() { return this.description };

  public correctRate: Number = 100.0;
  public getCorrectRate() { return this.correctRate };
  public preferredLanguage: Languages = Languages.CPP;

  public StarterCodes: { [key: string]: string; } = TemplateStarterCodes;
  public InputData:Array<string> = [];
  public OutputResult:Array<string> = [];

  public Rubric = [];

  states = {
    problemName: this.problemName,
    description: this.description,
    correctRate: this.correctRate,
    preferredLanguage: this.preferredLanguage,
    StarterCodes: this.StarterCodes[0] === undefined?this.StarterCodes:this.StarterCodes[0],
    InputData: this.InputData,
    OutputResult: this.OutputResult
  };

  public updateModifiableData(NewName: string, NewDescription: string, newStarterCode: { [key: string]: string; }, In:Array<string>, Out:Array<string>) {
    this.problemName = NewName;
    this.description = NewDescription;
    this.StarterCodes = newStarterCode;
    this.InputData = In;
    this.OutputResult = Out;
    if (this.ID === "N/A") {
      postProblemSet(this, (value) => {
        // console.log(value);
        this.parentProblemSet.setState({ NewProblemTemplate: this.parentProblemSet.MakeNewProblemTemplate() });
        this.parentProblemSet.quickUpdateState("");
        return value;
      },
        (err) => {
          if(String(err).indexOf("409") !== -1){
            alert("There's a same problem name existing already! Please consider create the problem with another name! \r\nNote that your problem content is still here locally :)")
          }
          console.log(err);
          return err;
        });
    }
    else {
      this.parentProblemSet.quickUpdateState();
    }
  }

  public ID: string = "0";
  getID() { return this.ID };
  public editButton = (<Button inverted color='green'>Edit</Button>);

  constructor(props: { NewName: string, NewDescription: string, newCorrectRate: number, newPreferredLanguage: Languages, newID: string }, parentPS: any, In:Array<string>, Out:Array<string>, newStarterCode = TemplateStarterCodes ) {
    // super(props);
    this.problemName = (props.NewName);
    this.description = (props.NewDescription);
    this.correctRate = props.newCorrectRate;
    this.preferredLanguage = props.newPreferredLanguage;
    this.ID = props.newID;
    this.parentProblemSet = parentPS;
    this.StarterCodes = newStarterCode;
    if(this.StarterCodes[0] !== undefined){
      this.StarterCodes = this.StarterCodes[0];
    }
    if (this.ID === "N/A") {
      this.editButton = <Button content="Make a new problem?" icon="plus" inverted color='blue' />;
    }
    this.InputData = In;
    this.OutputResult = Out;
  }

  /**
   * toJSONString
   */
  public toJSONString(): string {
    // console.log(JSON.stringify({
    //   ID: this.ID,
    //   problemName: this.problemName,
    //   description: this.description,
    //   correctRate: this.correctRate,
    //   preferredLanguage: this.preferredLanguage,
    //   StarterCodes: this.StarterCodes,
    //   problemInputSet: this.InputData,
    //   problemOutputSet: this.OutputResult,
    // }))
    return JSON.stringify({
      ID: this.ID,
      problemName: this.problemName,
      description: this.description,
      correctRate: this.correctRate,
      preferredLanguage: this.preferredLanguage,
      StarterCodes: this.StarterCodes,
      problemInputSet: this.InputData,
      problemOutputSet: this.OutputResult,
    })
  }

  renderWithState(a: ProblemSet) {

    // let MeRef = '/editProblem/' + this.ID;
    // let MeDel = '/editProblem/' + this.ID + '/delete';
    // let metta = this.LanGenerate();
    return (
      <Table.Row>
        <Table.Cell singleLine>{this.problemName}</Table.Cell>
        {/* <Table.Cell >{metta}</Table.Cell> */}
        {/* <Table.Cell singleLine>{this.correctRate}</Table.Cell> */}
        <Table.Cell >{this.description}</Table.Cell>
        <Table.Cell singleLine>
          {/* {this.editButton} */}
          <ProblemOperation BelongingProblem={this} />
          {/* <Button inverted color='red'>Delete</Button> */}
          <ProblemDeletion BelongingProblem={this} />
        </Table.Cell>

      </Table.Row>
    );
  };
}

export const PlaceHolderSingleProblem = new singleProblem({ NewName: "Placeholder", NewDescription: "Placeholder", newCorrectRate: 100, newPreferredLanguage: Languages.CPP, newID: "-1" }, null, ["0",], ["1",]);

export default singleProblem;