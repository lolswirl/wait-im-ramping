import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CHANGELOG } from "@data/changelog";
import { formatDate } from "@util/stringManipulation";
import { T } from "@util/T";

const MAX_ENTRIES = 5;

const Changelog: React.FC = () => {
    return (
        <Stack spacing={1.5}>
            {CHANGELOG.slice(0, MAX_ENTRIES).map((entry, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ minWidth: 80, pt: 0.3, whiteSpace: 'nowrap' }}>
                        <T>{formatDate(entry.date)}</T>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <T>{entry.text}</T>
                    </Typography>
                </Box>
            ))}
        </Stack>
    );
};

export default Changelog;
