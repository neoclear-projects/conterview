import React, { Component } from 'react';
import { Button, Card, Divider, Dropdown, Form, Grid, Header, Label, List, Modal, Segment, Table, TextArea } from 'semantic-ui-react';
import { Layout } from 'antd';
import { groupEnd } from 'node:console';
import axios from 'axios';
import { Session } from 'node:inspector';
import { singleProblem, Languages, PlaceHolderSingleProblem, LanguageOptions } from './single-problem';
import { deleteProblemSet } from '../../api/problem-set-api';


class ProblemDeletion extends React.Component {
    state = {
        open: false
    };

    // props = { BelongingProblem: PlaceHolderSingleProblem }
    constructor(props:{BelongingProblem:singleProblem}) {
        super(props);
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    render() {
        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button inverted color='red'>Delete</Button>}
                size='small'
            >
                {/* <Modal.Header>{this.props.BelongingProblem.problemName}</Modal.Header> */}
                <Label color='red' size='large' attached='top'>This cannot be UNDONE!</Label>
                <Modal.Header>
                    <div style={{ overflow:"hidden",wordWrap:"break-word"}}>Are you sure you want to delete problem with ID: {this.props.BelongingProblem.ID}</div>
                </Modal.Header>
                <Modal.Actions>
                    <Button  content = "Cancel" color='red' icon='undo' onClick={() => this.setOpen(false)} />
                    <Button
                        content="Yes and Delete"
                        labelPosition='right'
                        icon='trash alternate'
                        onClick={() => {
                            this.setState({ open: false });
                            deleteProblemSet(this.props.BelongingProblem,
                                (value) => {
                                    console.log(value);
                                    this.props.BelongingProblem.parentProblemSet.quickUpdateState("DEL");
                                    return value;
                                },
                                (err) => {
                                    console.log(err);
                                    return err;
                                });
                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ProblemDeletion;