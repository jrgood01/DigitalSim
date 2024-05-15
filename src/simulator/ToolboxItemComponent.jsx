import React from 'react';
import './ToolboxItemComponent.css';

function ToolboxItemComponent(props) {
  return (
    <div className="toolbox-item" draggable="true" onDragStart={props.onDragStart}>
        <div className='toolbox-container'>
            <div className="canvas-container">
                <img src={props.svg} alt={props.label} width="50" height="50" />
            </div>
            <div>
                <p>{props.label}</p>
            </div>
        </div>
    </div>
  );
}

export default ToolboxItemComponent;