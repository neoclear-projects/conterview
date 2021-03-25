import React from 'react';
import { Button, Grid, Label, Modal } from 'semantic-ui-react';
import { deleteProblemSet } from '../../api/problem-set-api';
import { singleProblem, PlaceHolderSingleProblem } from './single-problem';
import ProblemSingleIO from './problem-single-IO';
import ProblemOperation from './problem-operation';


class ProblemIOSet extends React.Component {
    state = {
        NeedUpdate: false
    };
    public StandaloneInputContent: Array<string>  = [];
    public StandaloneOutputContent: Array<string> = [];
    RC: { [key: string]: string; } = {};
    PO: ProblemOperation;
    // props = { BelongingProblem: PlaceHolderSingleProblem } // NEED COMMENT OUT
    constructor(props: { BelongingProblem: singleProblem, PO: ProblemOperation }) {
        super(props);
        this.StandaloneInputContent = props.BelongingProblem.InputData;
        this.StandaloneOutputContent = props.BelongingProblem.OutputResult;
        this.PO = props.PO;
    }

    setOpen(newOpen: boolean) {
        this.setState({
            open: newOpen,
        });
    }

    public UpdateMe(content: Array<string>, ind: number) {
        var NewIndex = 0;
        if (ind != -1) {
            this.StandaloneInputContent[ind] = content[0];
            this.StandaloneOutputContent[ind] = content[1];
            // this.setState({
            //     InputContent: this.StandaloneInputContent,
            //     OutputContent: this.StandaloneOutputContent
            // });
            NewIndex = ind;
        }
        else {
            // var NewListIn = this.state.InputContent.push(content[0]);
            // var NewListOut = this.state.OutputContent.push(content[1]);
            this.StandaloneInputContent.push(content[0]);
            this.StandaloneOutputContent.push(content[1]);
            NewIndex = this.StandaloneInputContent.length - 1;
            // this.setState({
            //     InputContent: NewListIn,
            //     OutputContent: NewListOut
            // })

        }
        this.updator();
        this.ContentCleaner();
        this.PO.UpdateIO(this.StandaloneInputContent, this.StandaloneOutputContent);
        this.setState({ NeedUpdate: true });

        return NewIndex;
    }

    public Remover(ind: number) {
        if (ind != -1) {
            var _ = this.StandaloneInputContent.splice(ind, 1);
            _ = this.StandaloneOutputContent.splice(ind, 1);
            // this.setState({
            //     InputContent: this.StandaloneInputContent,
            //     OutputContent: this.StandaloneOutputContent
            // });
        }
        this.updator();
        this.ContentCleaner();
        this.PO.UpdateIO(this.StandaloneInputContent, this.StandaloneOutputContent);
        this.setState({ NeedUpdate: true });
    }

    ContentCleaner() {
        // console.log(this.state.InputContent.splice(-1, 1));
        // // this.state.InputContent.splice(-1, 1);
        // this.state.OutputContent.splice(-1, 1);
    }

    updator(){
        this.setState({NeedUpdate:true});
    }

    // render2() {
    //     this.state.NeedUpdate = false;
    //     // var IOLength = this.state.InputContent.length;
    //     var ArrayOfSingleIO: Array<JSX.Element> = [];
    //     var i = 0;
    //     this.StandaloneInputContent.forEach(singleInput => {
    //         ArrayOfSingleIO.push(<ProblemSingleIO ProblemInput={this.StandaloneInputContent[i]} ProblemOutput={this.StandaloneOutputContent[i]} Index={i} Set={this} />)
    //         i += 1
    //     });
    //     ArrayOfSingleIO.push((<ProblemSingleIO ProblemOutput={""} ProblemInput={""} Index={-1} Set={this} />))
    //     return (
    //         <Grid divided='vertically'>
    //             <Grid.Row columns={1}>
    //                 {ArrayOfSingleIO}
    //             </Grid.Row>
    //         </Grid>
    //     )
    // }

    render() {
        this.state.NeedUpdate = false;
        // var IOLength = this.state.InputContent.length;
        var ArrayOfSingleIO: Array<ProblemSingleIO> = [];
        var i = 0;
        this.StandaloneInputContent.forEach(singleInput => {
            ArrayOfSingleIO.push(new ProblemSingleIO({ NewInput: this.StandaloneInputContent[i], NewOutput: this.StandaloneOutputContent[i], Index: i, Set: this }))
            i += 1;
        });
        ArrayOfSingleIO.push(new ProblemSingleIO({ NewInput: "", NewOutput: "", Index: -1, Set: this }))

        var ArrayOfSingleIOElem: Array<JSX.Element> = [];
        ArrayOfSingleIO.forEach(singleInput => {
            singleInput.tryUpdate();
            ArrayOfSingleIOElem.push(singleInput.render());
        });
        return (
            <Grid divided='vertically'>
                <Grid.Row columns={1}>
                    {ArrayOfSingleIOElem}
                </Grid.Row>
            </Grid>
        )
    }
}

export default ProblemIOSet;