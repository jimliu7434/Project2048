/// <reference path="../typings/react/react.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts" />

class TableGrid extends React.Component<IGridProps, any> {
    render() {
        return( 
            <span>{"　"}{this.props.value}{"　"}</span>
        );
    }
}

class TableRow extends React.Component<IRowProps, any> {
    private grid0 = this.props.values[0];
    private grid1 = this.props.values[1];
    private grid2 = this.props.values[2];
    private grid3 = this.props.values[3];

    render() {
        return (
            <div>
                <TableGrid index_x={this.grid0.index_x} index_y={this.grid0.index_y} value={this.grid0.value} />
                <TableGrid index_x={this.grid1.index_x} index_y={this.grid1.index_y} value={this.grid1.value} />
                <TableGrid index_x={this.grid2.index_x} index_y={this.grid2.index_y} value={this.grid2.value} />
                <TableGrid index_x={this.grid3.index_x} index_y={this.grid3.index_y} value={this.grid3.value} /><br/><br/>
            </div>
        );
    }
}

function GenNewGrids(index_x:number) {
    let rtn : Array<IGridProps> = [,,,];

    for (var i = 0; i < 4; i++) {
        let rtnGrid ={
            index_x : index_x,
            index_y : i,
            value : Math.pow(2, i + 1)
        };

        rtn[i] = rtnGrid;       
    }

    return rtn;
}

class Table2048 extends React.Component<any, any> {
    render() {
        return (
            <div>
                <TableRow values={GenNewGrids(0)} />
                <TableRow values={GenNewGrids(1)} />
                <TableRow values={GenNewGrids(2)} />
                <TableRow values={GenNewGrids(3)} />
            </div>
        );
    }   
}

ReactDOM.render(
    <Table2048 />,
    document.getElementById('content')
);




