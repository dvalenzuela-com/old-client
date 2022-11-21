import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { CartContext, CartLine } from "@Context/CartContext";
import ProductDialog, { ProductDialogMode } from "./ProductDialog";
import { ABProduct, ABProductOptionMultipleSelectedValues, ABProductOptionSelections, ABProductOptionSingleSelectedValue, ABProductOptionsType } from "@dvalenzuela-com/alabarra-types";
import { useTranslation } from "react-i18next";
import CurrencyText from "./CurrencyText";
import { BusinessConfigContext } from "@Context/BusinessConfigContext";


const CartContent = () => {

    const cart = useContext(CartContext);

    const businessConfig = useContext(BusinessConfigContext);

    const { t } = useTranslation();

    const [activeProduct, setActiveProduct] = useState<ABProduct | undefined>(undefined);
    const [activeLineId, setActiveLineId] = useState<string>('');
    const [activeQuantity, setActiveQuantity] = useState<number>(1);
    const [activeOptions, setActiveOptions] = useState<ABProductOptionSelections[]>([]);
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
                            <TableCell>{t('CartContent.TableHeader.Count')}</TableCell>
                            <TableCell>{t('CartContent.TableHeader.Product')}</TableCell>
                            <TableCell>{t('CartContent.TableHeader.Price')}</TableCell>
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
                                        <>
                                            <Typography variant="body1" display='inline'>{line.product.title}</Typography>

                                            {/** Print line options */}                                            
                                            {line.options.map((selectedOption, index) => {
                                                // Original product option
                                                if (line.product.options) {
                                                    const productOption = line.product.options[index];

                                                    if (productOption.type == ABProductOptionsType.SINGLE_SELECTION) {
                                                        //Get selected option
                                                        const singleSelectedOption = line.options[index] as ABProductOptionSingleSelectedValue;

                                                        if (singleSelectedOption) {
                                                            // Find product option that is selected to find price adjustment value
                                                            const originOption = productOption.possible_values.find(possible_value => possible_value.title == singleSelectedOption);
                                                            // TODO: Improve key
                                                            return (<Typography variant="subtitle2" key={index}>{originOption?.title}</Typography>);
                                                        }
                                                    } else if (productOption.type == ABProductOptionsType.MULTIPLE_SELECTION) {
                                                        
                                                        //Get selected option
                                                        const selectedValues = line.options[index] as ABProductOptionMultipleSelectedValues;
                                                        if (selectedValues) {
                                                            return selectedValues.map((selectedValue, index) => {
                                                                if (selectedValue) {
                                                                    // TODO: Improve key
                                                                    return (<Typography variant="subtitle2" key={index}>{productOption.possible_values[index].title}</Typography>);
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                                })
                                            }
                                            {/** Print comments */}
                                            {line.note != null && <Typography variant="subtitle2" style={{fontStyle: "italic"}}>{t('CartContent.TableRow.Comment')} &quot;{line.note}&quot;</Typography>}
                                        
                                            <Typography variant='subtitle2'>{t('CartContent.TableRow.Edit')}</Typography>
                                        </>
                                    </TableCell>
                                    <TableCell onClick={() => {handleRowClick(line)}}>
                                        <CurrencyText value={cart.calculateTotalPrice(line.product, line.options, line.quantity)} businessConfig={businessConfig} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>{t('CartContent.TableFooter.Total')}</TableCell>
                            <TableCell><CurrencyText value={cart.getCartTotal()} businessConfig={businessConfig} /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {activeProduct && <ProductDialog mode={ProductDialogMode.EditLine} lineId={activeLineId} product={activeProduct} quantity={activeQuantity} options={activeOptions} comment={activeComment} onClose={() => {setActiveProduct(undefined)}} />}
        </>
    )
}

export default CartContent;