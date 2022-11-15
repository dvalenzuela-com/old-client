import { ABCategory } from "@dvalenzuela-com/alabarra-types";
import { Grid, Typography } from "@mui/material";


type CategoryHeaderProps = {
    category: ABCategory
}

const CategoryHeader = (props: CategoryHeaderProps) => {
    return (
        <Grid item xs={12} textAlign='center'>
            <Typography variant="h5">{props.category.title}</Typography>
        </Grid>
    );
}

export default CategoryHeader;