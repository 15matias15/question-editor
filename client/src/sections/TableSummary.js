import React from 'react'

const tableSummary = (props) => {
    props.labels.sort((a, b) => a - b);
    const index = props.labels.length;
    const longest = props.labels[index - 1];

    return (
        <div>
            <p>Number of rows: {props.rows.length}</p>
            <p>Number of columns: {props.cols.length}</p>
            <p>Number of images uploades: {props.numberFiles}</p>
            <p>Longest label: {longest | 0}</p>
            <p>Shortest label: {props.labels[0] | 0}</p>
        </div>
    )
};

export default tableSummary;