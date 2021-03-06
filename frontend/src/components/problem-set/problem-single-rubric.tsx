import React from 'react';
import { Button, Form, Grid, GridColumn, Input, Label, Modal, TextArea } from 'semantic-ui-react';
import ProblemRubric from './problem-rubric-modal';



class ProblemSingleRubric extends React.Component {
    state = {
        Update: false
    };

    RubricName = "";
    RubricDescription = "";
    ScoreRatio = 100;
    TheSet: ProblemRubric;
    FirstTimeConsume = 0;
    public index = 0;
    // props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { NewName: string, NewDescription: string, NewScoreRatio: number, Index: number, Set: ProblemRubric }) {
        super(props);
        // this.setState({ ProblemInput: props.NewInput, ProblemOutput: props.NewOutput });
        this.RubricName = props.NewName;
        this.RubricDescription = props.NewDescription;
        this.ScoreRatio = props.NewScoreRatio;
        this.index = props.Index;
        this.TheSet = props.Set;
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    public tryUpdate() {
        if (this.index == this.TheSet.RubricList.length) {
            this.index = 0;
            this.setState({ Update: true });
        }
    }

    render() {

        this.state.Update = false;

        var ifThereIsOne: JSX.Element = (this.index != -1 ?
            (<div><h6>Remove?</h6><Button inverted color='red' onClick={(e) => this.TheSet.Remover(this.index)}>
                Remove this
            </Button>
            </div>)
            : <div />);
        var INP = this.RubricName;
        var OUP = this.RubricDescription;
        var RTO = this.ScoreRatio;
        if (this.index != -1) {
            INP = this.TheSet.RubricList[this.index].name;
            OUP = this.TheSet.RubricList[this.index].desc;
            RTO = this.TheSet.RubricList[this.index].rating;
        }

        return (
            <GridColumn>
                <h6>
                    {this.index == -1 ? "New" : `#${this.index}`}
                </h6>

                <div>
                    <Form>
                        <Grid
                            columns={4}
                        >
                            <GridColumn>
                                <h6>
                                    Name
                </h6>
                                <TextArea
                                    placeholder={INP}
                                    value={INP}
                                    onChange={(e) => {
                                        this.RubricName = e.target.value;
                                        this.index = this.TheSet.UpdateMe({ name: this.RubricName, desc: this.RubricDescription, rating: this.ScoreRatio }, this.index);
                                    }}
                                />
                            </GridColumn>
                            <GridColumn>
                                <h6>
                                    Description
                </h6>
                                <TextArea
                                    placeholder={OUP}
                                    value={OUP}
                                    onChange={(e) => {
                                        this.RubricDescription = e.target.value;

                                        this.index = this.TheSet.UpdateMe({ name: this.RubricName, desc: this.RubricDescription, rating: this.ScoreRatio }, this.index);
                                    }}
                                />
                            </GridColumn>
                            <GridColumn>
                                <h6>
                                    Ratio (0~100 Recommended)
                </h6>
                                <Input
                                    placeholder={"Ratio"}
                                    value={RTO}
                                    onChange={(e) => {
                                        const newText = e.target.value.replace(/[^\d]+/, '');
                                        this.ScoreRatio = Number(newText);
                                        this.index = this.TheSet.UpdateMe({ name: this.RubricName, desc: this.RubricDescription, rating: this.ScoreRatio }, this.index);
                                    }}
                                />
                            </GridColumn>
                            <GridColumn>
                                {ifThereIsOne}
                            </GridColumn>
                        </Grid>
                    </Form>
                </div>

            </GridColumn>
        )
    }
}

export default ProblemSingleRubric;