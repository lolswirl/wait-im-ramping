import React from 'react';
import { Chip } from '@mui/material';
import { GetTitle } from '@util/stringManipulation';

interface WarningChipProps {
    message: string;
    size?: 'small' | 'medium';
    showIcon?: boolean;
    borderColor?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    fontSize?: string;
}

const WarningChip: React.FC<WarningChipProps> = ({ 
    message, 
    size = 'small', 
    showIcon = false,
    borderColor = '#ffa726',
    backgroundColor = `${borderColor}20`,
    hoverBackgroundColor = `${borderColor}35`,
    fontSize = '0.875rem'
}) => {
    const displayMessage = showIcon ? `⚠︎ ${message}` : message;
    
    return (
        <Chip 
            label={GetTitle(displayMessage)} 
            size={size}
            variant="outlined"
            sx={{ 
                fontSize: fontSize,
                '& .MuiChip-label': {
                    px: 1
                },
                color: borderColor,
                borderColor: borderColor,
                borderRadius: "4px",
                backgroundColor: backgroundColor,
                '&:hover': {
                    backgroundColor: hoverBackgroundColor,
                }
            }}
        />
    );
};

export default WarningChip;
