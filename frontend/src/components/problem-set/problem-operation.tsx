import React, { Component } from 'react';
import { Button, Card, Divider, Dropdown, Form, Grid, Header, Label, List, Modal, Segment, Table, TextArea } from 'semantic-ui-react';
import { Layout } from 'antd';
import { groupEnd } from 'node:console';
import axios from 'axios';
import { Session } from 'node:inspector';
import { singleProblem, Languages, PlaceHolderSingleProblem, LanguageOptions } from './single-problem';


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
    };

    // props = { BelongingProblem: PlaceHolderSingleProblem }
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


    setOpen(newOpen: boolean) {
        this.CopyDown = this.props.BelongingProblem.StarterCodes;
        this.setState({
            open: newOpen,
            TempName: this.props.BelongingProblem.problemName,
            TempDescription: this.props.BelongingProblem.description,
            CPP: this.CopyDown['C++'] === undefined?this.CopyDown[0]['C++']:this.CopyDown['C++'],
            Java: this.CopyDown['Java']===undefined?this.CopyDown[0]['Java']:this.CopyDown['Java'],
            Python: this.CopyDown['Python']===undefined?this.CopyDown[0]['Python']:this.CopyDown['Python'],
            JavaScript: this.CopyDown['JavaScript']===undefined?this.CopyDown[0]['JavaScript']:this.CopyDown['JavaScript'],
            TypeScript: this.CopyDown['TypeScript']===undefined?this.CopyDown[0]['TypeScript']:this.CopyDown['TypeScript']
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
                        <Label color='blue'> Problem ID: {this.props.BelongingProblem.getID()}</Label>
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
                        <TextArea
                            rows={6}
                            value={this.state.TempDescription}
                            onChange={(e) => this.setState({ TempDescription: e.target.value })}
                        />
                    </Form>
                    <br></br>
                    <h3>Problem Starter code</h3>
                    <Label color='yellow'> - It is recommended to have the starter code in your local machine completed, since the editor here does not provide linting.</Label>
                    <Form>
                        <Dropdown
                            placeholder={this.state.currentDisplayLanguage }
                            // fluid
                            selection
                            options={LanguageOptions}
                            onChange={(e, data) => this.setState({ currentDisplayLanguage: data.value })}
                        />
                        <TextArea
                            rows={6}
                            value={
                                this.state.currentDisplayLanguage === Languages.CPP ? this.state.CPP :
                                    this.state.currentDisplayLanguage === Languages.Java ? this.state.Java :
                                        this.state.currentDisplayLanguage === Languages.Python ? this.state.Python :
                                            this.state.currentDisplayLanguage === Languages.JavaScript ? this.state.JavaScript :
                                                this.state.TypeScript
                            }
                            onChange={
                                (e) =>
                                    {this.state.currentDisplayLanguage === Languages.CPP ? this.setState({ CPP: e.target.value }) :
                                        this.state.currentDisplayLanguage === Languages.Java ? this.setState({ Java: e.target.value }) :
                                            this.state.currentDisplayLanguage === Languages.Python ? this.setState({ Python: e.target.value }) :
                                                this.state.currentDisplayLanguage === Languages.JavaScript ? this.setState({ JavaScript: e.target.value }) :
                                                    this.setState({ TypeScript: e.target.value });
                                                // console.log(this.state.currentDisplayLanguage);
                                                }
                            }
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>

                    {/* Maybe another make sure modal */}
                    <Button color='red' onClick={() => this.setOpen(false)}>
                        Cancel and Do Not Save
                </Button>
                    <Button
                        content="Save and exit"
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
                                }
                            );
                            this.setOpen(false);
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }

}


export default ProblemOperation