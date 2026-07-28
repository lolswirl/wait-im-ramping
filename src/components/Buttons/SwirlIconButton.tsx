import { IconButton, IconButtonProps, SxProps, Theme, useTheme } from "@mui/material";
import { HAIRLINE_SOFT } from "@components/Theme/tokens";

interface SwirlIconButtonProps extends Omit<IconButtonProps, 'sx'> {
    tint?: 'default' | 'danger';
    width?: number | string;
    height?: number | string;
    sx?: SxProps<Theme>;
}

// the neutral tint has no accent to derive from, so it keeps its own ladder
const NEUTRAL = {
    border: 'rgba(255,255,255,0.15)',
    color: 'text.secondary',
    hoverBorder: 'rgba(255,255,255,0.35)',
    hoverBg: 'rgba(255,255,255,0.08)',
};

export const SwirlIconButton = ({
    tint = 'default',
    width,
    height,
    sx,
    ...props
}: SwirlIconButtonProps) => {
    const theme = useTheme();
    // same accent ladder as SwirlButton: 66 border at rest, full accent on hover, 14 wash
    const accent = tint === 'danger' ? theme.palette.error.main : null;
    const s = accent
        ? { border: accent + '66', color: accent, hoverBorder: accent, hoverBg: accent + '14' }
        : NEUTRAL;

    return (
        <IconButton
            size="small"
            {...props}
            sx={[
                {
                    ...(width  !== undefined && { width  }),
                    ...(height !== undefined && { height }),
                    p: 0.5,
                    border: '1px solid',
                    borderColor: s.border,
                    borderRadius: 1,
                    color: s.color,
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                    '&:hover': {
                        borderColor: s.hoverBorder,
                        backgroundColor: s.hoverBg,
                    },
                    // no blanket opacity — it would multiply against the border alpha and erase the outline.
                    // must stay well clear of the neutral tint's resting 0.15 border / 0.7 ink or the
                    // two states read the same
                    '&.Mui-disabled': {
                        borderColor: HAIRLINE_SOFT,
                        color: 'rgba(255,255,255,0.22)',
                    },
                },
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        />
    );
};
