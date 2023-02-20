import { Typography } from "@mui/material";
import { CSSProperties } from "react";

type CategorySwiperSlideProps = {
    title: string;
    active: boolean;
    onClick: () => void;
}

const style: CSSProperties = {
    padding: 10
}

const activeStyle: CSSProperties = {
    ...style,
    fontWeight: 'bold',
    textDecoration: 'underline',
}

const inactiveStyle = {
    ...style,
}

const CategorySwiperSlide = (props: CategorySwiperSlideProps) => {
    const { title, active, onClick } = props;

    return <Typography style={active ? activeStyle : inactiveStyle}  onClick={onClick}>{title}</Typography>

}

export default CategorySwiperSlide;
