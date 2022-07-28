import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { blue, green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

type LoadingButtonProps = {
    title: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    buttonColor?:  'primary' | 'success' | 'error';
    spinnerColor?:  'primary' | 'success' | 'error';
}

const LoadingButton = (props: LoadingButtonProps) => {

    const [fullWidthStyle, setFullWidthStyle] = useState({});
    const [buttonColor, setButtonColor] = useState<'primary' | 'success' | 'error'>('primary');
    const [spinnerColor, setSpinnerColor] = useState<string>(blue[500]);
    useEffect(() => {
        setFullWidthStyle(props.fullWidth ? {width: '100%'} : {})
    }, [props.fullWidth]);

    useEffect(() => {
        setButtonColor(props.buttonColor ?? 'primary');

        // Use the given value for the spinner. If not available, use the one for the button. If not available, default to primary.
        let valueForSpinner = props.spinnerColor ?? (props.buttonColor ?? 'primary');
        switch (valueForSpinner) {
            case 'error':
                setSpinnerColor(red[500]);
                break;
            case 'success':
                setSpinnerColor(green[500]);
                break;
            case 'primary':
                setSpinnerColor(blue[500]);
                break;
        }
    }, [props.buttonColor, props.spinnerColor]);
  
    const handleButtonClick = () => {
        props.onClick();
    };
  
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }} style={fullWidthStyle}>
            <Box sx={{ m: 1, position: 'relative' }}  style={fullWidthStyle}>
                <Button
                variant="contained"
                //sx={buttonSx}
                disabled={props.disabled || props.loading}
                onClick={handleButtonClick}
                fullWidth={props.fullWidth}
                color={buttonColor}
                >
                {props.title}
                </Button>
                {props.loading && (
                <CircularProgress
                    size={24}
                    sx={{
                    color: spinnerColor,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                    }}
                />
                )}
            </Box>
        </Box>  
    );
}

export default LoadingButton;