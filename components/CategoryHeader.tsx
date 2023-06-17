import { ABCategory } from '@Alabarra/alabarra-types';
import { Grid, Typography } from '@mui/material';
import React from 'react';

type CategoryHeaderProps = {
  category: ABCategory;
};

const CategoryHeader = React.forwardRef<HTMLDivElement, CategoryHeaderProps>((props, ref) => {
  return (
    <Grid item xs={12} textAlign='center' ref={ref}>
      <Typography variant='h5'>{props.category.title}</Typography>
    </Grid>
  );
});

CategoryHeader.displayName = 'CategoryHeader';

export default CategoryHeader;
