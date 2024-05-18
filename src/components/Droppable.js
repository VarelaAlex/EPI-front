import React from 'react';
import { useDroppable } from '@dnd-kit/core';
let Droppable = (props) => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
        data: {
            accepts: props.type,
        }
    });

    const style = isOver ? "#ea9999" : "#f8cecc";

    return (
        <rect ref={setNodeRef} x={props.x} y={props.y} width="20" height="20" fill={style}  />
    );
};

export default Droppable;