import React from 'react';
import { Button, Divider, Dropdown, Form, Grid, Label, Modal, TextArea } from 'semantic-ui-react';
import { LanguageOptions, Languages, PlaceHolderSingleProblem, singleProblem } from './single-problem';
import MonacoEditor from '@monaco-editor/react';
import ProblemIOSet from './problem-IO-set'
import ProblemRubric from './problem-rubric-modal';
import ProblemDeletion from './problem-deletion';
import { Upload } from 'antd';


class ProblemOperation extends React.Component {
    state = {
        open: false,
        content: [],
        currentDisplayLanguage: Languages.CPP,
        TempName: this.props.BelongingProblem.problemName,
        TempDescription: this.props.BelongingProblem.description,

        CPP: this.props.BelongingProblem.StarterCodes['C++'],
        Java: this.props.BelongingProblem.StarterCodes['Java'],
        Python: this.props.BelongingProblem.StarterCodes['Python'],
        JavaScript: this.props.BelongingProblem.StarterCodes['JavaScript'],
        TypeScript: this.props.BelongingProblem.StarterCodes['TypeScript'],

        TempInput: this.props.BelongingProblem.InputData,
        TempOutput: this.props.BelongingProblem.OutputResult,

        TempRub: this.props.BelongingProblem.Rubric,
        fileList: [],
    };

    // props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { BelongingProblem: singleProblem }) {
        super(props);
    }
    // TempStarterCodes: { [key: string]: string; } = {
    //     'C++': this.props.BelongingProblem.StarterCodes['C++'],
    //     'Java': this.props.BelongingProblem.StarterCodes['Java'],
    //     'Python': this.props.BelongingProblem.StarterCodes['Python'],
    //     'JavaScript': this.props.BelongingProblem.StarterCodes['JavaScript'],
    //     'TypeScript': this.props.BelongingProblem.StarterCodes['TypeScript'],
    // };

    // TempDescription: string = this.props.BelongingProblem.description;

    CopyDown = this.props.BelongingProblem.StarterCodes;

    UpdateIO(In: Array<string>, Out: Array<string>) {
        this.setState({
            TempInput: In,
            TempOutput: Out
        });
    }

    UpdateRub(Rub: Array<{ name: string, desc: string, rating: number }>) {
        this.setState({
            TempRub: Rub
        });
    }

    setOpen(newOpen: boolean) {
        this.CopyDown = this.props.BelongingProblem.StarterCodes;
        this.setState({
            open: newOpen,
            TempName: this.props.BelongingProblem.problemName,
            TempDescription: this.props.BelongingProblem.description,
            CPP: this.CopyDown['C++'] === undefined ? this.CopyDown[0]['C++'] : this.CopyDown['C++'],
            Java: this.CopyDown['Java'] === undefined ? this.CopyDown[0]['Java'] : this.CopyDown['Java'],
            Python: this.CopyDown['Python'] === undefined ? this.CopyDown[0]['Python'] : this.CopyDown['Python'],
            JavaScript: this.CopyDown['JavaScript'] === undefined ? this.CopyDown[0]['JavaScript'] : this.CopyDown['JavaScript'],
            TypeScript: this.CopyDown['TypeScript'] === undefined ? this.CopyDown[0]['TypeScript'] : this.CopyDown['TypeScript'],

            TempInput: this.props.BelongingProblem.InputData,
            TempOutput: this.props.BelongingProblem.OutputResult,
        });
    }

    render() {
        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={this.props.BelongingProblem.editButton}
                size='large'
            >
                {/* <Modal.Header>{this.props.BelongingProblem.problemName}</Modal.Header> */}
                <Modal.Header>
                    Problem Name
                    <Form>
                        <div style={{ color: 'white', marginBottom: "15px" }}></div>
                        <Label color='blue'> Problem ID: {this.props.BelongingProblem.getID()}</Label>
                        <div style={{ color: 'white', marginBottom: "15px" }}></div>
                        <TextArea
                            rows={1}
                            value={this.state.TempName}
                            onChange={(e) => this.setState({ TempName: e.target.value })}
                        />
                    </Form>
                </Modal.Header>
                <Modal.Content>



                    <h3>Problem Description</h3>
                    <Form>
                        <div style={{ fontFamily: 'monospace' }} >
                            <TextArea
                                rows={6}
                                value={this.state.TempDescription}
                                onChange={(e) => this.setState({ TempDescription: e.target.value })}
                            />
                        </div>
                    </Form>
                    {/* <Form>
                        <MonacoEditor
                            value={this.state.TempDescription}
                            onChange={(e) => this.setState({ TempDescription: e })}
                        />
                    </Form> */}
                    <Divider />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignContent: "normal",
                        }}
                    >
                        <h3>Problem Starter code</h3>
                        <Label color='yellow'> - It is recommended to have the starter code in your local machine completed, since the editor here does not provide linting.</Label>
                        <div style={{ color: 'white', marginBottom: "1%" }}></div>
                        <Form>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignContent: 'flex-start',
                                    marginBottom: '1%'
                                }}
                            >
                                <Dropdown
                                    placeholder={this.state.currentDisplayLanguage}
                                    // fluid
                                    selection
                                    options={LanguageOptions}
                                    onChange={(e, data) => this.setState({ currentDisplayLanguage: data.value })}
                                />
                                {/* <div style={{color:'white'}}>.</div> */}
                                <Upload
                                    beforeUpload={(file) => {
                                        var fileReader = new FileReader();
                                        fileReader.onload = event => {
                                            var Kontent = event.target?.result;
                                            console.log(event);
                                            this.state.currentDisplayLanguage === Languages.CPP ? this.setState({ CPP: Kontent }) :
                                                this.state.currentDisplayLanguage === Languages.Java ? this.setState({ Java: Kontent }) :
                                                    this.state.currentDisplayLanguage === Languages.Python ? this.setState({ Python: Kontent }) :
                                                        this.state.currentDisplayLanguage === Languages.JavaScript ? this.setState({ JavaScript: Kontent }) :
                                                            this.setState({ TypeScript: Kontent });
                                        }
                                        fileReader.readAsText(file);
                                        return false;
                                    }}
                                    fileList={this.state.fileList}
                                >
                                    <Button icon="upload" content="Read from local" labelPosition='right' />
                                </Upload>
                            </div>
                            <div style={{ fontFamily: 'monospace' }} >
                                <TextArea
                                    rows={10}
                                    value={
                                        this.state.currentDisplayLanguage === Languages.CPP ? this.state.CPP :
                                            this.state.currentDisplayLanguage === Languages.Java ? this.state.Java :
                                                this.state.currentDisplayLanguage === Languages.Python ? this.state.Python :
                                                    this.state.currentDisplayLanguage === Languages.JavaScript ? this.state.JavaScript :
                                                        this.state.TypeScript
                                    }
                                    onChange={
                                        (e) => {
                                            this.state.currentDisplayLanguage === Languages.CPP ? this.setState({ CPP: e.target.value }) :
                                                this.state.currentDisplayLanguage === Languages.Java ? this.setState({ Java: e.target.value }) :
                                                    this.state.currentDisplayLanguage === Languages.Python ? this.setState({ Python: e.target.value }) :
                                                        this.state.currentDisplayLanguage === Languages.JavaScript ? this.setState({ JavaScript: e.target.value }) :
                                                            this.setState({ TypeScript: e.target.value });
                                            // console.log(this.state.currentDisplayLanguage);
                                        }
                                    }
                                />
                            </div>
                            <Divider />
                            <h3>
                                Problem Data sets
                        </h3>
                            <ProblemIOSet BelongingProblem={this.props.BelongingProblem} PO={this} />

                        </Form>
                    </div>
                </Modal.Content>
                <Modal.Actions>

                    <Button.Group>
                        <ProblemRubric BelongingProblem={this.props.BelongingProblem} PO={this} />
                        <Button.Or />
                        <Button
                            color='orange'
                            content="Cancel Without Save"
                            labelPosition='right'
                            icon='x'
                            onClick={() => this.setOpen(false)} />

                        <Button.Or />
                        <ProblemDeletion BelongingProblem={this.props.BelongingProblem} Source={this} />
                        <Button.Or />
                        <Button
                            content="Save"
                            labelPosition='right'
                            icon='save'
                            onClick={() => {
                                this.props.BelongingProblem.updateModifiableData(
                                    this.state.TempName,
                                    this.state.TempDescription,
                                    {
                                        'C++': this.state.CPP,
                                        'Java': this.state.Java,
                                        'Python': this.state.Python,
                                        'JavaScript': this.state.JavaScript,
                                        'TypeScript': this.state.TypeScript,
                                    },
                                    this.state.TempInput,
                                    this.state.TempOutput
                                );
                                this.setOpen(false);
                            }}
                            positive
                        />
                    </Button.Group>
                </Modal.Actions>
            </Modal>
        )
    }

}


export default ProblemOperation