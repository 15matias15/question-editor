import React from 'react';

const title = (props) => {
    return (
        <>
            <label
                id="titleLabel"
                htmlFor="titleInput">Insert a title : </label>
            <input
                type="text"
                id="titleInput"
                placeholder="Title..."
                onChange={props.changeTitle} />
        </>
    )
}

export default title;