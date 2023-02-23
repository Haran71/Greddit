import React from "react";
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

function Tag(props){

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
      }));

    return (
        <ListItem>
            <Chip label={props.text} onMouseDown={() => {props.handleDelete(props.id)}} />
        </ListItem>
    )
}

export default Tag;