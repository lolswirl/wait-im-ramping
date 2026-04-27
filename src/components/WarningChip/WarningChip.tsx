import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';
import { GetTitle } from '@util/stringManipulation';

interface WarningChipProps {
    message: string;
    size?: 'small' | 'medium';
    showIcon?: boolean;
    icon?: React.ReactNode;
    borderColor?: string;
    fontSize?: string;
    variant?: 'outlined' | 'filled';
    onClick?: () => void;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    sx?: SxProps<Theme>;
}

const WarningChip: React.FC<WarningChipProps> = ({ 
    message, 
    size = 'small',
    showIcon = false,
    icon = '⚠︎',
    borderColor,
    fontSize = '0.875rem',
    variant = 'outlined',
    onClick,
    color,
    sx = {},
}) => {
    const isStringIcon = typeof icon === 'string';
    const displayMessage = (showIcon && isStringIcon) ? `${icon} ${message}` : message;
    
    const hasCustomColor = borderColor !== undefined;
    
    const customSx: SxProps<Theme> = hasCustomColor ? {
        fontSize: fontSize,
        fontWeight: 500,
        '& .MuiChip-label': {
            px: 1
        },
        '& .MuiChip-icon': {
            fontSize: fontSize,
            marginLeft: '4px',
        },
        color: borderColor,
        borderColor: borderColor,
        borderRadius: "4px",
        backgroundColor: `color-mix(in srgb, ${borderColor} 20%, transparent)`,
        '&:hover': {
            backgroundColor: `color-mix(in srgb, ${borderColor} 35%, transparent)`,
        },
        ...(onClick && { cursor: 'pointer' }),
        ...sx
    } : {
        fontSize: fontSize,
        fontWeight: 500,
        '& .MuiChip-label': {
            px: 1
        },
        '& .MuiChip-icon': {
            fontSize: fontSize,
            marginLeft: '4px',
        },
        borderRadius: "4px",
        ...(onClick && { cursor: 'pointer' }),
        ...sx
    };
    
    return (
        <Chip 
            label={GetTitle(displayMessage)}
            icon={(showIcon && !isStringIcon) ? icon as React.ReactElement : undefined}
            size={size}
            variant={variant}
            onClick={onClick}
            color={color}
            sx={customSx}
        />
    );
};

export default WarningChip;
