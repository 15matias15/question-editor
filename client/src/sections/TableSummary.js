import React, { Component } from 'react'

export default class TableSummary extends Component {
    handleLabels = () => {
        this.props.Labels.sort((a, b) => a - b);
        const index = this.props.Labels.length;
        const longest = this.props.Labels[index - 1];
        return (
            <>
                <p>Longest label: {longest | 0}</p>
                <p>Shortest label: {this.props.Labels[0] | 0}</p>
            </>
        )
    };

    render() {
        return (
            <div>
                <p>Number of rows: {this.props.Rows.length}</p>
                <p>Number of columns: {this.props.Cols.length}</p>
                <p>Number of images uploades: {this.props.numberFiles}</p>
                {this.handleLabels()}
            </div>
        )
    };
};