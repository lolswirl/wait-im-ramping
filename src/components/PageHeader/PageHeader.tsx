import React from 'react';
import { Typography, Box } from '@mui/material';
import { RAINBOW_GRADIENT } from '@components/Buttons/RainbowCard';
import { T } from '@util/T';

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: string | string[] | React.ReactNode;
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
    const mx = align === 'center' ? 'auto' : 0;

    const isStringSubtitle = typeof subtitle === 'string' || Array.isArray(subtitle);
    const subtitleText = isStringSubtitle
        ? (Array.isArray(subtitle) ? (subtitle as string[]).join("<br>") : subtitle as string)
        : null;

    const subtitleContent = isStringSubtitle ? (
        subtitleText && (
            <Typography
                sx={{
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    opacity: 0.6,
                    minWidth: 0,
                    maxWidth: maxWidth,
                    '& a': {
                        color: 'primary.light',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline wavy' }
                    }
                }}
                dangerouslySetInnerHTML={{ __html: T(subtitleText) }}
            />
        )
    ) : (
        subtitle && (
            <Typography
                component="div"
                sx={{
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    opacity: 0.6,
                    minWidth: 0,
                    maxWidth: maxWidth,
                    '& a': {
                        color: 'primary.light',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline wavy' }
                    }
                }}
            >
                <T>{subtitle as React.ReactNode}</T>
            </Typography>
        )
    );

    return (
        <Box sx={{ mb: marginBottom, mx }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
                <Box sx={{ flexShrink: 0 }}>
                    <Typography
                        variant="h1"
                        sx={{ fontWeight: "bold", fontSize: "2em", color: "text.primary", lineHeight: 1.2, mb: 0.4 }}
                    >
                        <T>{title}</T>
                    </Typography>
                    <Box sx={{ height: 2, borderRadius: 1, background: RAINBOW_GRADIENT }} />
                </Box>
                {subtitleContent && (
                    <>
                        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", opacity: 0.4, flexShrink: 0 }}>/</Typography>
                        {subtitleContent}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default PageHeader;
