import React from 'react';
import { useDraggable } from '@dnd-kit/core';

let Draggable = (props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: {
            type: props.type,
        },
        disabled: props.ok
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined;

    let a = false;

    return (
        <div ref={setNodeRef} style={props.ok ? { visibility: "hidden" } : style} {...listeners} {...attributes}>
            <svg height="90" width="125">
                {a ? <rect x="1" y="12" width="120" height="70" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" /> : <ellipse cx="60" cy="50" rx="60" ry="40" fill="white" stroke="rgb(0, 0, 0)" />}
                <image x="35" y="15" width="50" height="50" href="mano.png" />
                <text x="33" y="80" fill="black">La mano</text>
            </svg>
        </div>
    );
};

export default Draggable;