import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faEye } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faCircle, faSquare, faMinusCircle, faEye);

const tableEdition = (props) => {
    const drawDeleteButton = () => {
        let data = props.cols;
        return (
            data.map((col) => (
                <th key={col.id} className="delete-header">
                    <label className="btn-delete">
                        <FontAwesomeIcon
                            icon={faMinusCircle}
                            className="fa-sm"
                            style={{ color: "red" }}
                            onClick={() => props.delete(col._id, "col")} />
                    </label>
                </th>
            ))
        )
    };

    const drawCols = () => {
        let data = props.cols;
        return (
            data.map((col) => (
                <th key={col.id} className="button-header">
                    {col.filename === ""
                        ?
                        <>
                            <input
                                type="file"
                                id={"col " + col._id + " " + col.id}
                                name="col"
                                onChange={(e) => handleUploadFile(e)}
                                style={{ display: 'none' }} />
                            <label htmlFor={"col " + col._id + " " + col.id} className="btn-upload">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="fa-sm"
                                    style={{ color: "grey" }} />
                            </label>
                        </>
                        :
                        <label
                            className="btn-upload"
                            onClick={() => handleShowFile(col.id, 'col')}>
                            <FontAwesomeIcon
                                icon={faEye}
                                className="fa-sm"
                            />
                        </label>
                    }
                </th>
            ))
        )
    };

    const drawColNumber = () => {
        let data = props.cols;
        return (
            data.map((col) => (
                <th
                    key={col.id}
                    className="col-header">
                    <input
                        type="input"
                        className="table-label"
                        defaultValue={col.name}
                        onBlur={(e) => handleUpdateLabel("col", col.id, e, col._id)} />
                </th>
            ))
        )
    };

    const drawRows = () => {
        let data = props.rows;
        return (
            data.map((row) => (
                <tr key={row.id}>
                    <td className="delete-header">
                        <label className="btn-delete">
                            <FontAwesomeIcon
                                icon={faMinusCircle}
                                className="fa-sm"
                                style={{ color: "red" }}
                                onClick={() => props.delete(row._id, "row")} />
                        </label>
                    </td>
                    {row.filename === ""
                        ?
                        <td className="button-header">
                            <input
                                type="file"
                                id={"row " + row._id + " " + row.id}
                                name="row"
                                onChange={(e) => handleUploadFile(e)}
                                style={{ display: 'none' }} />
                            <label htmlFor={"row " + row._id + " " + row.id} className="btn-upload" >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="fa-sm"
                                    style={{ color: "grey" }} />
                            </label>
                        </td>
                        :
                        <td className="button-header">
                            <label
                                className="btn-upload"
                                onClick={() => handleShowFile(row.id, 'row')}>
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="fa-sm" />
                            </label>
                        </td>
                    }
                    <td>
                        <input
                            type="input"
                            className="table-label"
                            defaultValue={row.name}
                            onBlur={(e) => handleUpdateLabel("row", row.id, e, row._id)} />
                    </td>
                    {props.cols.map((col) => {
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

    const handleUploadFile = (event) => {
        const id = event.target.id.split(" ")[1];
        const idArray = event.target.id.split(" ")[2];
        const type = event.target.name;
        const file = event.target.files[0];
        props.uploadFile(type, id, file, idArray);
    };

    const handleUpdateLabel = (type, idArray, event, id) => {
        const labelName = event.target.value;
        props.updateLabel(type, id, labelName, idArray, event);
    };

    const handleShowFile = (id, type) => {
        let fileName = '';
        if (type === 'col') {
            fileName = props.cols.filter(col => col.id === id)[0].filename;
        }
        if (type === 'row') {
            fileName = props.rows.filter(row => row.id === id)[0].filename;
        }
        window.open(require(`../../../backend/uploads/${fileName}`));
    }

    const _header = () => {
        return (
            <>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    component="tr">
                    <td rowSpan={3} colSpan={3}></td>
                    {drawDeleteButton()}
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    component="tr">
                    {drawCols()}
                    <th className="add" onClick={props.addCol}>
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
                    {drawColNumber()}
                </ReactCSSTransitionGroup>
            </>
        )
    };

    const _body = () => {
        return (
            <>
                {drawRows()}
                <tr>
                    <td className="add" onClick={props.addRow}>
                        <label>
                            <FontAwesomeIcon icon={faPlus} className="fa-sm add-btn" />
                        </label>
                    </td>
                </tr>
            </>
        )
    };

    return (
        <div className="col-sm-6" >
            <h5><strong>{props.title} EDITION VIEW</strong></h5>
            {props.title || <p style={{ fontStyle: 'italic' }}>Title of the question</p>}
            <table>
                <thead>
                    {_header()}
                </thead>
                <tbody>
                    {_body()}
                </tbody>
            </table >
        </div>
    )
};

export default tableEdition;