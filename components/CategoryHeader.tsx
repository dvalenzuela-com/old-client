import { ABCategory } from "@dvalenzuela-com/alabarra-types";
import { Grid, Typography } from "@mui/material";
import { RefObject } from "react";


type CategoryHeaderProps = {
    category: ABCategory;
    ref: RefObject<HTMLDivElement>;
}

const CategoryHeader = (props: CategoryHeaderProps, ) => {
    return (
        <Grid item xs={12} textAlign='center' ref={props.ref}>
            <Typography variant="h5">{props.category.title}</Typography>
        </Grid>
    );
}

export default CategoryHeader;