import { Alert, Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import CartContent from "../CartContent";

type CheckoutDialogProps = {
    open: boolean;
    close: () => void;
}

const CheckoutDialog = ({ open, close }: CheckoutDialogProps) => {

    const cart = useContext(CartContext)

    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const [createOrderLoading, setCreateOrderLoading] = useState(false)
    const [createOrderSuccess, setCreateOrderSuccess] = useState(false)


    const [tableOptions, setTableOptions] = useState(['1', '2', '3'])

    const handleCloseCheckoutDialog = () => {
        close()
    };

    const [paymentType, setPaymentType] = useState('presential')

    const handleSelectPaymentType = (event: React.MouseEvent<HTMLElement>, selectedPaymentType: string | null) => {
        if (selectedPaymentType !== null) {
            setPaymentType(selectedPaymentType)
        }
    }

    const handleCreateOrder = () => {
        // Show loading spinner
        setCreateOrderSuccess(false)
        setCreateOrderLoading(true)

        // Create order
        cart.createOrderWithManualPayment()
            .then(orderId => {

                // Mark order as successful
                setCreateOrderSuccess(true)
                setCreateOrderLoading(false)

                handleCloseCheckoutDialog()
                cart.clearCart()
                setSnackbarOpen(true)
            })
            .catch(error => {
                // Remove spinner
                setCreateOrderSuccess(false)
                setCreateOrderLoading(false)
            });
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false)
    }

    return (
        <>
            <Dialog open={open} onClose={handleCloseCheckoutDialog}>
                <DialogTitle>Checkout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This is your current cart
                    </DialogContentText>
                    <CartContent />
                    <br />
                    <DialogContentText>Please select your table</DialogContentText>
                    <Autocomplete
                        disablePortal
                        id="select-table"
                        options={tableOptions}
                        
                        renderInput={(params) => <TextField {...params} label="Table number" variant="standard"/>}
                    />

                    <br />
                    <DialogContentText>Payment type</DialogContentText>
                    
                    <ToggleButtonGroup exclusive value={paymentType} onChange={handleSelectPaymentType}>
                        <ToggleButton value='online' disabled>Online</ToggleButton>
                        <ToggleButton value='presential'>Presential</ToggleButton>
                    </ToggleButtonGroup>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseCheckoutDialog}>Close</Button>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button onClick={handleCreateOrder} disabled={createOrderLoading || cart.getNumberOfItems() == 0}>Create order</Button>
                        {createOrderLoading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                        )}
                    </Box>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar} action={null}>
                <Alert severity="success">Order send successfuly! We will be with your shortly!</Alert>
            </Snackbar>
        </>
    );
}

export default CheckoutDialog;