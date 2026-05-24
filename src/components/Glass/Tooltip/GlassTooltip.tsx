import { Tooltip, TooltipProps } from "@mui/material";

export const GlassTooltip = (props: TooltipProps) => {
    const { slotProps, ...otherProps } = props;
    
    return (
        <Tooltip
            {...otherProps}
            arrow
            disableInteractive
            slotProps={{
                ...slotProps,
                tooltip: {
                    ...slotProps?.tooltip,
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        ...((slotProps?.tooltip as any)?.sx),
                    }
                },
                arrow: {
                    ...slotProps?.arrow,
                    sx: {
                        color: "rgba(0, 0, 0, 0.3)",
                        "&::before": {
                            border: "1px solid rgba(255,255,255,0.1)",
                        }
                    }
                },
                popper: {
                    modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, -5],
                        },
                    },
                ],
                }
            }}
        />
    );
};
