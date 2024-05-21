'use client'
import React from 'react';
import ReactJson from 'react-json-view';

interface Props {
    data: Record<string, any>;
}

const JsonViewer: React.FC<Props> = ({ data }) => {
    return (
        <div>
            <ReactJson src={data} style={{ padding: "5px", borderRadius: "20px" }} theme={"harmonic"} displayDataTypes={false} />
        </div>
    );
};

export default JsonViewer;
