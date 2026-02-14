import React from 'react';
import { Box, Radio, Typography } from '@mui/material';

interface RadioOptionProps<T> {
  value: T;
  currentValue: T;
  onChange: (value: T) => void;
  title: string;
  description?: string;
  color?: string;
}

function RadioOption<T extends string>({ 
  value, 
  currentValue, 
  onChange, 
  title, 
  description,
  color = '54, 162, 235'
}: RadioOptionProps<T>) {
  const isSelected = value === currentValue;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1, 
        borderRadius: 1,
        border: `1px solid rgba(${color}, 0.2)`,
        backgroundColor: isSelected ? `rgba(${color}, 0.1)` : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: `rgba(${color}, 0.05)`,
          borderColor: `rgba(${color}, 0.4)`,
        }
      }}
      onClick={() => onChange(value)}
    >
      <Radio
        checked={isSelected}
        onChange={() => onChange(value)}
        onClick={(e) => e.stopPropagation()}
        sx={{
          color: `rgba(${color}, 0.6)`,
          '&.Mui-checked': { color: `rgb(${color})` },
          '&:hover': { backgroundColor: `rgba(${color}, 0.1)` },
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ 
          fontWeight: 'bold',
          color: isSelected ? `rgb(${color})` : 'text.primary',
          transition: 'color 0.2s ease'
        }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default RadioOption;
