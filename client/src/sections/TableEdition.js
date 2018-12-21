import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faCircle, faSquare, faMinusCircle);

export default class TableEdition extends Component {
    drawCols = () => {
        let data = this.props.cols;
        return (
            data.map((col) => (
                <th key={col.id} className="button-header">
                    <input
                        type={col.icon ? "file" : ""}
                        id={"col " + String(col.id)}
                        name="col"
                        onChange={(e) => col.icon ? this.handleUploadFile(e) : null}
                        style={{ display: 'none' }} />
                    <label htmlFor={"col " + String(col.id)} className="btn-upload">
                        <FontAwesomeIcon
                            icon={col.icon ? faPlus : faSquare}
                            className="fa-sm"
                            style={{ color: "grey" }} />
                    </label>
                </th>
            ))
        )
    };

    drawColNumber = () => {
        let data = this.props.cols;
        return (
            data.map((col) => (
                <th key={col.id}>
                    {col.name}
                </th>
            ))
        )
    };

    drawRows = () => {
        let data = this.props.rows;
        return (
            data.map((row) => (
                <tr key={row.id}>
                    <td className="button-header">
                        <input
                            type={row.icon ? "file" : ""}
                            id={"row " + String(row.id)}
                            name="row"
                            onChange={(e) => row.icon ? this.handleUploadFile(e) : null}
                            style={{ display: 'none' }} />
                        <label htmlFor={"row " + String(row.id)} className="btn-upload" >
                            <FontAwesomeIcon
                                icon={row.icon ? faPlus : faSquare}
                                className="fa-sm"
                                style={{ color: "grey" }} />
                        </label>
                    </td>
                    <td>
                        {row.name}
                    </td>
                    {this.props.cols.map((col) => {
                        return (
                            <td key={col.id} className="circle">
                                <FontAwesomeIcon icon={faCircle} className="fa-sm" />
                            </td>
                        )
                    })}
                </tr>
            ))
        )
    };

    handleUploadFile = (event) => {
        const id = parseInt(event.target.id.split(" ")[1]);
        const type = event.target.name;
        const file = event.target.files[0];

        this.props.uploadFile(type, id, file);
    };

    _header() {
        return (
            <>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    component="tr">
                    <td rowSpan={2} colSpan={2}></td>
                    {this.drawCols()}
                    <th className="add" onClick={this.props.addCol}>
                        <label>
                            <FontAwesomeIcon icon={faPlus} className="fa-sm add-btn" />
                        </label>
                    </th>
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    component="tr">
                    {this.drawColNumber()}
                </ReactCSSTransitionGroup>
            </>
        )
    };

    _body() {
        return (
            <>
                {this.drawRows()}
                <tr>
                    <td className="add" onClick={this.props.addRow}>
                        <label>
                            <FontAwesomeIcon icon={faPlus} className="fa-sm add-btn" />
                        </label>
                    </td>
                </tr>
            </>
        )
    };

    render() {
        return (
            <div className="col-sm-6" >
                <h5><strong>{this.props.title} EDITION VIEW</strong></h5>
                {this.props.title || <p style={{ fontStyle: 'italic' }}>Title of the question</p>}
                <table>
                    <thead>
                        {this._header()}
                    </thead>
                    <tbody>
                        {this._body()}
                    </tbody>
                </table >
            </div>
        )
    }
};