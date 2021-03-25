import React from 'react';
import { Button, Label, Modal } from 'semantic-ui-react';
import { deleteProblemSet } from '../../api/problem-set-api';
import { singleProblem, PlaceHolderSingleProblem } from './single-problem';


class ProblemRubric extends React.Component {
    state = {
        open: false,
        RubricContent: []
    };
    RC:{ [key: string]: string; }={};

    props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props:{BelongingProblem:singleProblem}) {
        super(props);
        this.setState({RubricContent:props.BelongingProblem.Rubric});
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    render() {
        var RubricLength = this.state.RubricContent.length + 1;
        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button inverted color='red'>Delete</Button>}
                size='small'
            >
                {/* <Modal.Header>{this.props.BelongingProblem.problemName}</Modal.Header> */}
                <Modal.Header>
                    <div style={{ overflow:"hidden",wordWrap:"break-word"}}>Rubric of :{this.props.BelongingProblem.problemName}</div>
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

export default ProblemRubric;