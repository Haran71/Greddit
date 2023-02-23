import React from 'react';

function FollowItem(props) {
    return (
        <li className="list-group-item"
          onClick={() => {
            props.onChecked(props.id);
          }}
        >
          {props.text}
        </li>
      );
}

export default FollowItem;