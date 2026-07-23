"use client";
import { useState } from "react";
import { TextField, InputAdornment, Box, Typography } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { GlassIconButton } from '@components/Buttons/GlassIconButton';

interface SwirlFieldProps {
    label?: string;
    value: number | "";
    onChange: (value: number | "") => void;
    suffix?: string;
    min?: number;
    width?: string;
}

const SwirlField: React.FC<SwirlFieldProps> = ({ label, value, onChange, suffix, min = 0, width = '10ch' }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {label && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.45, px: 0.5 }}>
                    {label}
                </Typography>
            )}
            <TextField
                type="number"
                value={value}
                onChange={(e) => {
                    const newValue = e.target.value;
                    onChange(newValue === "" ? "" : parseFloat(newValue));
                }}
                onBlur={() => onChange(value === "" ? min : value)}
                error={value === ""}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    m: 0,
                    width,
                    '& input[type=number]': { MozAppearance: 'textfield' },
                    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& .MuiOutlinedInput-root': {
                        height: 42,
                        fontSize: '0.8rem',
                        '& fieldset': { borderColor: 'divider' },
                        '&:hover fieldset': { borderColor: 'text.secondary' },
                        '&.Mui-focused fieldset': { borderColor: 'text.secondary' },
                    },
                }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease' }}>
                                        <GlassIconButton
                                            onClick={() => onChange(value === "" ? min + 1 : value + 1)}
                                            sx={{ p: '1px', minWidth: 0, height: 18, width: 18 }}
                                        >
                                            <ArrowDropUp sx={{ fontSize: 16 }} />
                                        </GlassIconButton>
                                        <GlassIconButton
                                            onClick={() => onChange(value === "" ? min : Math.max(min, value - 1))}
                                            sx={{ p: '1px', minWidth: 0, height: 18, width: 18 }}
                                        >
                                            <ArrowDropDown sx={{ fontSize: 16 }} />
                                        </GlassIconButton>
                                    </Box>
                                    {suffix && <Typography variant="body2" color="text.secondary">{suffix}</Typography>}
                                </Box>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};

export default SwirlField;
