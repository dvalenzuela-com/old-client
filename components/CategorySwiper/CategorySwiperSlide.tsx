import { Typography } from "@mui/material";

type CategorySwiperSlideProps = {
    title: string;
    active: boolean
}

const CategorySwiperSlide = (props: CategorySwiperSlideProps) => {
    const { title, active} = props;

    if (active) {
        return <Typography style={{fontWeight: 'bold', textDecoration: 'underline'}}>{title}</Typography>
    } else {
        return <Typography>{title}</Typography>
    }
}

export default CategorySwiperSlide;
