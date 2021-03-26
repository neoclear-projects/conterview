import React from 'react';
import { Button, Form, Grid, GridColumn, Input, Label, Modal, TextArea } from 'semantic-ui-react';
import ProblemIOSet from './problem-IO-set';
import { singleProblem, PlaceHolderSingleProblem } from './single-problem';



class ProblemSingleIO extends React.Component {
    state = {
        Update: false
    };

    ProblemInput = "";
    ProblemOutput = "";
    TheSet: ProblemIOSet;
    FirstTimeConsume = 0;
    public index = 0;
    public key: number;
    // props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { NewInput: string, NewOutput: string, Index: number, Set: ProblemIOSet }) {
        super(props);
        // this.setState({ ProblemInput: props.NewInput, ProblemOutput: props.NewOutput });
        this.ProblemInput = props.NewInput;
        this.ProblemOutput = props.NewOutput;
        this.index = props.Index;
        this.TheSet = props.Set;
        this.key = props.Index;
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    public tryUpdate() {
        if (this.index == this.TheSet.StandaloneInputContent.length) {
            this.index = 0;
            this.setState({ Update: true });
        }
    }

    render() {

        this.state.Update = false;

        var ifThereIsOne: JSX.Element = (this.index != -1 ?
            (<Button inverted color='red' onClick={(e) => this.TheSet.Remover(this.index)}>
                Remove this I/O
            </Button>)
            : <div />);
        var INP = this.ProblemInput;
        var OUP = this.ProblemOutput;
        if (this.index != -1) {
            INP = this.TheSet.StandaloneInputContent[this.index + this.FirstTimeConsume];
            OUP = this.TheSet.StandaloneOutputContent[this.index + this.FirstTimeConsume];
            this.FirstTimeConsume = 0;
        }

        return (
            <GridColumn>
                <h6>
                    {this.index == -1 ? "New I/O" : `I/O #${this.index}`}
                </h6>

                <div
                // style={{
                //     display: 'flex',
                //     flexDirection: 'column',
                //     flexWrap: 'wrap',
                //     justifyContent: 'space-around',
                //     alignContent: "normal",
                // }}
                >
                    <Grid
                    columns={3}
                    >
                        <GridColumn>


                            <TextArea
                                placeholder={INP}
                                value={INP}
                                onChange={(e) => {
                                    this.index = this.TheSet.UpdateMe([e.target.value, this.ProblemOutput,], this.index);
                                    // this.setState({ ProblemInput: e.target.value });
                                    this.ProblemInput = e.target.value;
                                }}
                            />
                        </GridColumn>
                        <GridColumn>
                            <TextArea
                                placeholder={OUP}
                                value={OUP}
                                onChange={(e) => {
                                    this.index = this.TheSet.UpdateMe([this.ProblemInput, e.target.value,], this.index);
                                    // this.setState({ ProblemOutput: e.target.value });
                                    this.ProblemOutput = e.target.value;
                                }}
                            />
                        </GridColumn>
                        <GridColumn>
                            {ifThereIsOne}
                        </GridColumn>
                    </Grid>
                </div>

            </GridColumn>
        )
    }
}

export default ProblemSingleIO;