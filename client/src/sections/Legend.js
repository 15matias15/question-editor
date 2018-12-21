import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSquare, } from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faSquare);

const legend = () => {
    return (
        <div className="col-sm-6" >
            <h5><strong>Legend</strong></h5>
            <label className="legend-label">
                <FontAwesomeIcon
                    icon={faSquare}
                    className="fa-xs "
                    style={{ color: "grey", width: 15, height: 15 }} />
                <p>&emsp;Images or add image button</p>
            </label>
            <label className="legend-label">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-xs"
                    style={{ color: "green", width: 15, height: 15 }} />
                <p> &emsp;Add row/column buttons</p>
            </label>
            <label className="legend-label">
                <FontAwesomeIcon
                    icon={faPlus}
                    className="fa-xs"
                    style={{ color: "grey", width: 15, height: 15 }} />
                <p>&emsp;Add image</p>
            </label>
        </div>
    )
}

export default legend;