import { IconButton, IconButtonProps, SxProps, Theme } from "@mui/material";

interface GlassIconButtonProps extends Omit<IconButtonProps, 'sx'> {
    tint?: 'default' | 'danger';
    width?: number | string;
    height?: number | string;
    sx?: SxProps<Theme>;
}

const STYLES = {
    default: {
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'text.secondary' as const,
        hoverBorder: 'rgba(255,255,255,0.35)',
        hoverBg: 'rgba(255,255,255,0.08)',
        disabledBorder: 'rgba(255,255,255,0.08)',
    },
    danger: {
        border: '1px solid rgba(244,67,54,0.3)',
        color: 'error.light' as const,
        hoverBorder: 'error.light',
        hoverBg: 'rgba(244,67,54,0.08)',
        disabledBorder: 'rgba(244,67,54,0.1)',
    },
};

export const GlassIconButton = ({
    tint = 'default',
    width,
    height,
    sx,
    ...props
}: GlassIconButtonProps) => {
    const s = STYLES[tint];

    return (
        <IconButton
            size="small"
            {...props}
            sx={[
                {
                    ...(width  !== undefined && { width  }),
                    ...(height !== undefined && { height }),
                    p: 0.5,
                    border: s.border,
                    borderRadius: 1,
                    color: s.color,
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                        borderColor: s.hoverBorder,
                        backgroundColor: s.hoverBg,
                    },
                    '&.Mui-disabled': {
                        opacity: 0.25,
                        borderColor: s.disabledBorder,
                    },
                },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        />
    );
};
