import React from 'react';
import { Typography, Box } from '@mui/material';
import { GetTitle } from '../../util/stringManipulation.tsx';
import PageTitle from '../PageTitle/PageTitle.tsx';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
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
            <PageTitle title={GetTitle(title)} />
            <h1 style={{ marginBottom: "0px", textAlign: align }}>
                {GetTitle(title)}
            </h1>
            
            {subtitle && (
                <Typography 
                    variant="body1" 
                    align={align} 
                    color="text.secondary" 
                    sx={{ 
                        maxWidth: maxWidth, 
                        mx: align === 'center' ? 'auto' : 0
                    }}
                >
                    {GetTitle(subtitle)}
                </Typography>
            )}
        </Box>
    );
};

export default PageHeader;