import React from 'react';
import { Button, Form, GridColumn, Input, Label, Modal } from 'semantic-ui-react';
import ProblemIOSet from './problem-IO-set';
import { singleProblem, PlaceHolderSingleProblem } from './single-problem';



class ProblemSingleIO extends React.Component {
    state = {
        ProblemInput: "",
        ProblemOutput: "",
        Update: false
    };

    TheSet: ProblemIOSet;
    FirstTimeConsume = 1;
    public index = 0;
    public key: number;
    // props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { NewInput: String, NewOutput: String, Index: number, Set: ProblemIOSet }) {
        super(props);
        this.setState({ ProblemInput: props.NewInput, ProblemOutput: props.NewOutput });
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
            var INP = "";
            var OUP = "";
        if (this.index != -1) {
            INP = this.TheSet.StandaloneInputContent[this.index + this.FirstTimeConsume];
            OUP = this.TheSet.StandaloneOutputContent[this.index + this.FirstTimeConsume];
            this.FirstTimeConsume = 0;
        }

        return (
            <GridColumn>
                <Input placeholder={INP}
                    value={INP}
                    onChange={(e) => { this.index = this.TheSet.UpdateMe([e.target.value, this.state.ProblemOutput,], this.index); this.setState({ ProblemInput: e.target.value }); }}
                />
                <Input placeholder={OUP}
                    value={OUP}
                    onChange={(e) => { this.index = this.TheSet.UpdateMe([this.state.ProblemInput, e.target.value,], this.index); this.setState({ ProblemOutput: e.target.value }); }}
                />
                {ifThereIsOne}
                {this.index}
            </GridColumn>
        )
    }
}

export default ProblemSingleIO;