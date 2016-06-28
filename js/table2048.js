/// <reference path="../typings/react/react.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./interfaces.d.ts" />
class TableGrid extends React.Component {
    render() {
        return (React.createElement("div", {style: { backgroundColor: "yellow" }}, "[ ", this.props.index_x, " : ", this.props.index_y, " ]- ", this.props.value));
    }
}
class TableRow extends React.Component {
    constructor(...args) {
        super(...args);
        this.grid0 = this.props.values[0];
        this.grid1 = this.props.values[1];
        this.grid2 = this.props.values[2];
        this.grid3 = this.props.values[3];
    }
    render() {
        return (React.createElement("div", null, React.createElement(TableGrid, {index_x: this.grid0.index_x, index_y: this.grid0.index_y, value: this.grid0.value}), React.createElement(TableGrid, {index_x: this.grid1.index_x, index_y: this.grid1.index_y, value: this.grid1.value}), React.createElement(TableGrid, {index_x: this.grid2.index_x, index_y: this.grid2.index_y, value: this.grid2.value}), React.createElement(TableGrid, {index_x: this.grid3.index_x, index_y: this.grid3.index_y, value: this.grid3.value}), React.createElement("br", null)));
    }
}
function GenNewGrids(index_x) {
    let rtn = [, , ,];
    for (var i = 0; i < 4; i++) {
        let rtnGrid = {
            index_x: index_x,
            index_y: i,
            value: 0
        };
        rtn[i] = rtnGrid;
    }
    return rtn;
}
class Table2048 extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement(TableRow, {values: GenNewGrids(0)}), React.createElement(TableRow, {values: GenNewGrids(1)}), React.createElement(TableRow, {values: GenNewGrids(2)}), React.createElement(TableRow, {values: GenNewGrids(3)})));
    }
}
ReactDOM.render(React.createElement(Table2048, null), document.getElementById('content'));
