import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CHANGELOG } from "@data/changelog";
import { formatDate, GetTitle } from "@util/stringManipulation";

const MAX_ENTRIES = 3;

const Changelog: React.FC = () => {
    return (
        <Stack spacing={1.5}>
            {CHANGELOG.slice(0, MAX_ENTRIES).map((entry, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ minWidth: 80, pt: 0.3, whiteSpace: 'nowrap' }}>
                        {GetTitle(formatDate(entry.date))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {GetTitle(entry.text)}
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
};

export default Changelog;
