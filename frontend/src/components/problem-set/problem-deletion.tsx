import React from 'react';
import { Button, Label, Modal } from 'semantic-ui-react';
import { deleteProblemSet } from '../../api/problem-set-api';
import ProblemOperation from './problem-operation';
import { singleProblem } from './single-problem';


class ProblemDeletion extends React.Component {
    state = {
        open: false
    };

    // props = { BelongingProblem: PlaceHolderSingleProblem }
    constructor(props:{BelongingProblem:singleProblem, Source:ProblemOperation}) {
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
                trigger={<Button color='red' icon='trash alternate outline' content='Delete This' labelPosition='right' disabled={this.props.BelongingProblem.ID == "N/A"}/>}
                size='small'
            >
                {/* <Modal.Header>{this.props.BelongingProblem.problemName}</Modal.Header> */}
                <Label color='red' size='large' attached='top'>This cannot be UNDONE!</Label>
                <Modal.Header>
                    <div style={{ overflow:"hidden",wordWrap:"break-word"}}>Are you sure you want to delete problem with ID: {this.props.BelongingProblem.ID}</div>
                </Modal.Header>
                <Modal.Actions>
                    <Button  content = "Cancel" positive icon='undo' onClick={() => this.setOpen(false)} />
                    <Button
                        content="Yes and Delete"
                        labelPosition='right'
                        icon='trash alternate'
                        onClick={() => {
                            this.setState({ open: false });
                            this.props.Source.setState({ open: false });
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
                        negative
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ProblemDeletion;