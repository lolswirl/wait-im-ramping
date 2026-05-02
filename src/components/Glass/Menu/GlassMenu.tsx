import { Popover, PopoverProps } from "@mui/material";

export const GlassMenu = (props: PopoverProps) => {
    const { PaperProps, slotProps, ...otherProps } = props;
    
    return (
        <Popover
            {...otherProps}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.3) !important",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        maxHeight: 400,
                        width: 'fit-content',
                        overflow: 'visible',
                        borderRadius: 1,
                        backgroundImage: 'none',
                        ...PaperProps?.sx,
                    }
                }
            }}
        />
    );
};
