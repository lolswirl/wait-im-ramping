import React from 'react';
import { Chip, SxProps, Theme } from '@mui/material';
import { T } from '@util/T';

interface WarningChipProps {
    message: string;
    size?: 'small' | 'medium';
    showIcon?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
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
    iconPosition = 'left',
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
    
    const customSx: SxProps<Theme> = {
        fontSize: fontSize,
        fontWeight: 500,
        maxWidth: 'none',
        height: 'auto',
        '& .MuiChip-label': {
            px: 1,
            overflow: 'visible',
            whiteSpace: 'normal',
            textAlign: 'center',
        },
        '& .MuiChip-icon': {
            fontSize: fontSize,
            marginLeft: '4px',
            color: 'inherit',
        },
        // deleteIcon used to pseudo-position icons on the right side via MUI
        '& .MuiChip-deleteIcon': {
            fontSize: fontSize,
            marginRight: '4px',
            color: 'inherit',
            opacity: 1,
            pointerEvents: 'none',
            '&:hover': {
                color: 'inherit',
                opacity: 1,
            },
        },
        borderRadius: "4px",
        ...(hasCustomColor && {
            color: borderColor,
            borderColor: `color-mix(in srgb, ${borderColor} 40%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${borderColor} 8%, transparent)`,
            '&:hover': {
                backgroundColor: `color-mix(in srgb, ${borderColor} 18%, transparent)`,
            },
        }),
        ...(onClick && { cursor: 'pointer' }),
        ...sx
    };
    
    const iconElement = (showIcon && !isStringIcon) ? icon as React.ReactElement : undefined;
    
    return (
        <Chip 
            label={(displayMessage)}
            icon={iconPosition === 'left' ? iconElement : undefined}
            deleteIcon={iconPosition === 'right' ? iconElement : undefined}
            onDelete={iconPosition === 'right' && iconElement ? () => {} : undefined}
            size={size}
            variant={variant}
            onClick={onClick}
            color={color}
            sx={customSx}
        />
    );
};

export default WarningChip;
