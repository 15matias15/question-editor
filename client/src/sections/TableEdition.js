import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faSquare, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faCircle, faSquare, faMinusCircle);

const tableEdition = (props) => {
    const drawCols = () => {
        let data = props.cols;
        return (
            data.map((col) => (
                <th key={col.id} className="button-header">
                    <input
                        type={col.icon ? "file" : ""}
                        id={"col " + String(col.id)}
                        name="col"
                        onChange={(e) => col.icon ? handleUploadFile(e) : null}
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

    const drawColNumber = () => {
        let data = props.cols;
        return (
            data.map((col) => (
                <th
                    key={col.id}
                    className="col-header">
                    {col.name}
                </th>
            ))
        )
    };

    const drawRows = () => {
        let data = props.rows;
        return (
            data.map((row) => (
                <tr key={row.id}>
                    <td className="button-header">
                        <input
                            type={row.icon ? "file" : ""}
                            id={"row " + String(row.id)}
                            name="row"
                            onChange={(e) => row.icon ? handleUploadFile(e) : null}
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
        const id = parseInt(event.target.id.split(" ")[1]);
        const type = event.target.name;
        const file = event.target.files[0];

        props.uploadFile(type, id, file);
    };

    const _header = () => {
        return (
            <>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    component="tr">
                    <td rowSpan={2} colSpan={2}></td>
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