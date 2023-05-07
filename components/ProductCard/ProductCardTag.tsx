import { ABProductTag } from "@Alabarra/alabarra-types";
import Image from "next/image";
import GlutenFree from "./../../public/icons/gluten-free.png";
import NoAddedSugar from "./../../public/icons/no-added-sugar.png";
import NoGmo from "./../../public/icons/no-gmo.png";
import Vegan from "./../../public/icons/vegan.png";
import Vegetarian from "./../../public/icons/vegetarian.png";

type ProductCardTagProps = {
    value: ABProductTag;
}

const ProductCardTag = (props: ProductCardTagProps) => {
    const { value } = props;

    const ICON_SIZE = 16;
    switch(value) {
        case ABProductTag.VEGAN:
            return <Image height={ICON_SIZE} width={ICON_SIZE} src={Vegan} alt='Vegan' />;
        case ABProductTag.VEGETARIAN:
            return <Image height={ICON_SIZE} width={ICON_SIZE} src={Vegetarian} alt='Vegetarian' />;
        case ABProductTag.GLUTEN_FREE:
            return <Image height={ICON_SIZE} width={ICON_SIZE} src={GlutenFree} alt='Gluten free' />;
        case ABProductTag.NO_ADDED_SUGAR:
            return <Image height={ICON_SIZE} width={ICON_SIZE} src={NoAddedSugar} alt='No added sugar' />;
        case ABProductTag.NO_GMO:
            return <Image height={ICON_SIZE} width={ICON_SIZE} src={NoGmo} alt='No GMO'/>;
        default:
            // TODO: Dont throw error in production!!
            throw new Error(`Non-existent Tag in switch: ${value}`);
    }
}

export default ProductCardTag;
