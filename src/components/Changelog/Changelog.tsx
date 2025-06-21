import { ChangelogEntry } from '../../data/changelog/changelog.ts'
import { GetTitle } from "../../util/stringManipulation.tsx";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';

interface Props {
  changelog: ChangelogEntry[];
  limit?: number;
}

const formatDate = (date: Date): string => {
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  return sameYear
    ? `${date.getMonth() + 1}/${date.getDate()}`
    : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const Changelog = ({ changelog, limit }: Props) => {
  const sorted = [...changelog].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <List
      dense
      sx={{
        p: 0,
        maxHeight: 360,
        overflowY: 'auto',
      }}
    >
      {sorted.slice(0, limit).map((entry, index) => (
        <ListItem key={index} divider sx={{ px: 0 }}>
          <ListItemText
            primary={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ mt: 0, color: 'text.secondary', fontStyle: 'italic' }}
                >
                  updated on {formatDate(entry.date)} by
                </Typography>
                <Stack direction="row" flexWrap="wrap">
                  {entry.contributors.map((contributor) => (
                    <Chip
                      avatar={<Avatar alt="contributor.name" src={contributor.avatar} />}
                      key={contributor.name}
                      label={contributor.name}
                      component="a"
                      href={`https://github.com/lolswirl/wait-im-ramping/commits/master/?author=${contributor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      clickable
                      size="small"
                      variant="outlined"
                      sx={{
                        color: contributor.color ?? 'primary.main',
                        borderColor: contributor.color ?? 'primary',
                        height: 20,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            }
            secondary={
              <Typography
                variant="body2"
                sx={{ color: 'text.primary' }}
              >
                {GetTitle(entry.changes)}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default Changelog;
