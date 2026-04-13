import React from 'react';
import { Chip } from '@mui/material';
import { GetTitle } from '@util/stringManipulation';

interface WarningChipProps {
    message: string;
    size?: 'small' | 'medium';
    showIcon?: boolean;
    icon?: string;
    borderColor?: string;
    fontSize?: string;
}

const WarningChip: React.FC<WarningChipProps> = ({ 
    message, 
    size = 'small', 
    showIcon = false,
    icon = '⚠︎',
    borderColor = '#ffa726',
    fontSize = '0.875rem',
}) => {
    const displayMessage = showIcon ? `${icon} ${message}` : message;
    
    return (
        <Chip 
            label={GetTitle(displayMessage)} 
            size={size}
            variant="outlined"
            sx={{
                fontSize: fontSize,
                fontWeight: 500,
                '& .MuiChip-label': {
                    px: 1
                },
                color: borderColor,
                borderColor: borderColor,
                borderRadius: "4px",
                backgroundColor: `color-mix(in srgb, ${borderColor} 20%, transparent)`,
                '&:hover': {
                    backgroundColor: `color-mix(in srgb, ${borderColor} 35%, transparent)`,
                }
            }}
        />
    );
};

export default WarningChip;
