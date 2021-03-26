import React from 'react';
import { Button, Grid, Label, Modal, ModalContent } from 'semantic-ui-react';
import ProblemOperation from './problem-operation';
import ProblemSingleRubric from './problem-single-rubric';
import { singleProblem, PlaceHolderSingleProblem } from './single-problem';


class ProblemRubric extends React.Component {
    state = {
        open: false,
        NeedUpdate:false
    };
    public RubricList: Array<[string, string, number]> = [];
    PO: ProblemOperation;

    props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { BelongingProblem: singleProblem, PO: ProblemOperation  }) {
        super(props);
        this.setState({ RubricContent: props.BelongingProblem.Rubric });
        this.RubricList = props.BelongingProblem.Rubric;
        this.PO = props.PO;
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    updator(){
        this.setState({NeedUpdate:true});
    }

    public Remover(ind: number) {
        if (ind != -1) {
            var _ = this.RubricList.splice(ind, 1);
        }
        this.updator();
        this.PO.UpdateRub(this.RubricList);
        this.setState({ NeedUpdate: true });
    }

    public UpdateMe(content: [string, string, number], ind: number) {
        var NewIndex = 0;
        if (ind != -1) {
            this.RubricList[ind] = content;
            NewIndex = ind;
        }
        else {
            // var NewListIn = this.state.InputContent.push(content[0]);
            // var NewListOut = this.state.OutputContent.push(content[1]);
            this.RubricList.push(content);
            NewIndex = this.RubricList.length - 1;
            // this.setState({
            //     InputContent: NewListIn,
            //     OutputContent: NewListOut
            // })

        }
        this.updator();
        this.PO.UpdateRub(this.RubricList);
        this.setState({ NeedUpdate: true });

        return NewIndex;
    }

    render() {

        this.state.NeedUpdate = false;

        var ArrayOfSingleRubric: Array<ProblemSingleRubric> = [];
        var i = 0;
        this.RubricList.forEach(singleInput => {
            ArrayOfSingleRubric.push(new ProblemSingleRubric({ NewName: singleInput[0], NewDescription: singleInput[1], NewScoreRatio:singleInput[2], Index: i, Set: this }))
            i += 1;
        });
        ArrayOfSingleRubric.push(new ProblemSingleRubric({ NewName: "", NewDescription: "", NewScoreRatio:100, Index: -1, Set: this }))

        var ArrayOfSingleRubElem: Array<JSX.Element> = [];
        ArrayOfSingleRubric.forEach(singleInput => {
            singleInput.tryUpdate();
            ArrayOfSingleRubElem.push(singleInput.render());
        });


        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                trigger={<Button inverted color='twitter'>Open Rubric</Button>}
                size='small'
            >
                {/* <Modal.Header>{this.props.BelongingProblem.problemName}</Modal.Header> */}
                <Modal.Header>
                    <div style={{ overflow: "hidden", wordWrap: "break-word" }}>Rubric</div>
                </Modal.Header>
                <ModalContent>
                    <Grid divided='vertically'>
                        <Grid.Row columns={1}>
                            {ArrayOfSingleRubElem}
                        </Grid.Row>
                    </Grid>
                </ModalContent>
                <Modal.Actions>
                    <Button content="Return to editor" color='twitter' icon='undo' onClick={() => this.setOpen(false)} inverted />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ProblemRubric;