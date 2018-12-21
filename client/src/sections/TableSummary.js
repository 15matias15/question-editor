import React, { Component } from 'react'

export default class TableSummary extends Component {
    handleLabels = () => {
        this.props.labels.sort((a, b) => a - b);
        const index = this.props.labels.length;
        const longest = this.props.labels[index - 1];
        return (
            <>
                <p>Longest label: {longest | 0}</p>
                <p>Shortest label: {this.props.labels[0] | 0}</p>
            </>
        )
    };

    render() {
        return (
            <div>
                <p>Number of rows: {this.props.rows.length}</p>
                <p>Number of columns: {this.props.cols.length}</p>
                <p>Number of images uploades: {this.props.numberFiles}</p>
                {this.handleLabels()}
            </div>
        )
    };
};