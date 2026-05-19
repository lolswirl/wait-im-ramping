import React from 'react';
import { Typography, Box } from '@mui/material';
import { T } from '@util/T';

interface PageHeaderProps {
    title: string;
    subtitle?: string | string[];
    maxWidth?: number | string;
    align?: 'left' | 'center' | 'right';
    marginBottom?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    subtitle, 
    maxWidth = 700, 
    align = 'center',
    marginBottom = 1
}) => {
    return (
        <Box sx={{ mb: marginBottom }}>
            <Typography
                variant="h1"
                sx={{
                    mb: 0,
                    textAlign: align,
                    fontWeight: 'bold',
                    color: 'text.primary',
                    fontSize: '2em',
                }}
            >
                <T>{title}</T>
            </Typography>
            
            {subtitle && (
                <Typography
                    variant="body1"
                    align={align}
                    color="text.secondary"
                    sx={{
                        maxWidth: maxWidth,
                        mx: align === 'center' ? 'auto' : 0,
                        '& a': {
                            color: 'primary.light',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline wavy'
                            }
                        }
                    }}
                    {...((typeof subtitle === "string" || Array.isArray(subtitle))
                        ? { dangerouslySetInnerHTML: { __html: T(Array.isArray(subtitle) ? subtitle.join("<br>") : subtitle) } }
                        : {})}
                >
                    {typeof subtitle === "string" || Array.isArray(subtitle) ? null : subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default PageHeader;