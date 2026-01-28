import React from 'react';
import { Chip } from '@mui/material';
import { GetTitle } from '@util/stringManipulation';

interface WarningChipProps {
    message: string;
    size?: 'small' | 'medium';
    showIcon?: boolean;
}

const WarningChip: React.FC<WarningChipProps> = ({ message, size = 'small', showIcon = false }) => {
    const displayMessage = showIcon ? `⚠︎ ${message}` : message;
    
    return (
        <Chip 
            label={GetTitle(displayMessage)} 
            color="warning" 
            size={size}
            variant="outlined"
            sx={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                '& .MuiChip-label': {
                    px: 1
                },
                borderColor: 'warning.main',
                borderRadius: 1,
                backgroundColor: 'rgba(255, 152, 0, 0.08)',
                '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.12)',
                }
            }}
        />
    );
};

export default WarningChip;
