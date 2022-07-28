import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { CartContext, CartLine, ProductOptionSelection } from "../context/CartContext";
import NumberFormat from 'react-number-format';
import ProductDialog, { ProductDialogMode } from "./ProductDialog";
import { AlabarraProduct } from "@dvalenzuela-com/alabarra-types";
import { CurrencyNumberFormat } from "../lib/helper";


const CartContent = () => {

    const cart = useContext(CartContext)

    const [activeProduct, setActiveProduct] = useState<AlabarraProduct | undefined>(undefined);
    const [activeLineId, setActiveLineId] = useState<string>('');
    const [activeQuantity, setActiveQuantity] = useState<number>(1);
    const [activeOptions, setActiveOptions] = useState<ProductOptionSelection[]>([]);
    const [activeComment, setActiveComment] = useState<string | null>(null);

    const handleRowClick = (cartLine: CartLine) => {
        
        setActiveQuantity(cartLine.quantity);
        setActiveLineId(cartLine.lineId);
        setActiveComment(cartLine.note);
        setActiveOptions(cartLine.options);
        setActiveProduct(cartLine.product);
    }

    return (
        <>
            <TableContainer>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Count</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {cart.getLines().map( line => {
                            return (
                                <TableRow key={`${line.lineId}`}>
                                    <TableCell onClick={() => {handleRowClick(line)}}>
                                        <Typography variant='body2' display='inline'>{line.quantity} x </Typography>
                                    </TableCell>
                                    <TableCell onClick={() => {handleRowClick(line)}}>
                                        <Typography variant="body1" display='inline'>{line.product.title}</Typography>
                                        {line.note != null && <Typography variant="subtitle2" style={{fontStyle: "italic"}}>{line.note}</Typography>}
                                    </TableCell>
                                    <TableCell onClick={() => {handleRowClick(line)}}>
                                        <NumberFormat value={cart.calculateTotalPrice(line.product, line.options, line.quantity)} displayType='text' {...CurrencyNumberFormat} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>TOTAL</TableCell>
                            <TableCell><NumberFormat value={cart.getCartTotal()} displayType='text' {...CurrencyNumberFormat} /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {activeProduct && <ProductDialog mode={ProductDialogMode.EditLine} lineId={activeLineId} product={activeProduct} quantity={activeQuantity} options={activeOptions} comment={activeComment} onClose={() => {setActiveProduct(undefined)}} />}
        </>
    )
}

export default CartContent;