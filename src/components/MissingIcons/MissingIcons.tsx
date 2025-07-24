import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    List, 
    ListItem, 
    Button, 
    Container,
    Alert,
    Link,
    LinearProgress,
    Grid
} from '@mui/material';
import { GetTitle, pluralize } from '../../util/stringManipulation';
import { FormatIconImg, FormatIconLink } from '../../util/FormatIconImg';
import { getSpecs } from '../../data/class/class';
import PageHeader from '../PageHeader/PageHeader';
import type Spell from "../../data/spells/spell";

interface MissingIconData {
    iconName: string;
    spellName: string;
    specName: string;
    className: string;
}

const MissingIcons: React.FC = () => {
    const [missingIconsList, setMissingIcons] = useState<MissingIconData[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [totalIcons, setTotalIcons] = useState(0);

    const getAllSpellsFromAllSpecs = (): { spell: Spell, spec: string, className: string }[] => {
        const allSpells: { spell: Spell, spec: string, className: string }[] = [];
        
        getSpecs().forEach(spec => {
            Object.values(spec.spells).forEach(spell => {
                allSpells.push({
                    spell,
                    spec: spec.name,
                    className: spec.class
                });
            });
            Object.values(spec.talents ?? {}).forEach(talent => {
                allSpells.push({
                    spell: talent,
                    spec: spec.name,
                    className: spec.class
                });
            }); 
        });

        return allSpells;
    };

    // Wrap checkAllIcons in useCallback to avoid recreating it on every render
    const checkAllIcons = useCallback(async () => {
        setLoading(true);
        setMissingIcons([]);

        const allSpells = getAllSpellsFromAllSpecs();
        setTotalIcons(allSpells.length);

        const missingIcons: MissingIconData[] = [];
        let processed = 0;

        const batchSize = 10;
        for (let i = 0; i < allSpells.length; i += batchSize) {
            const batch = allSpells.slice(i, i + batchSize);

            await Promise.all(batch.map(({ spell, spec, className }) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    const localSrc = FormatIconImg(spell.icon);

                    img.onload = () => {
                        resolve();
                    };

                    img.onerror = () => {
                        missingIcons.push({
                            iconName: spell.icon,
                            spellName: spell.name,
                            specName: spec,
                            className: className
                        });
                        resolve();
                    };

                    if (localSrc) {
                        img.src = localSrc;
                    } else {
                        missingIcons.push({
                            iconName: spell.icon,
                            spellName: spell.name,
                            specName: spec,
                            className: className
                        });
                        resolve();
                    }
                });
            }));

            processed += batch.length;
            setProgress((processed / allSpells.length) * 100);

            await new Promise(resolve => setTimeout(resolve, 10));
        }

        const uniqueMissingIcons = missingIcons.filter((icon, index, self) =>
            index === self.findIndex(i => i.iconName === icon.iconName)
        );

        setMissingIcons(uniqueMissingIcons);
        setLoading(false);
        setProgress(100);
    }, []);

    useEffect(() => {
        checkAllIcons();
    }, [checkAllIcons]);

    const handleRefresh = () => {
        checkAllIcons();
    };

    return (
        <Container maxWidth="lg">
            <PageHeader 
                title={"Missing Icons"}
            />
            
            <Box sx={{ py: 4, maxWidth: 600, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {missingIconsList.length} {GetTitle("missing")} {pluralize(missingIconsList.length, "icon")} {GetTitle("found")}
                        {totalIcons > 0 && ` (${totalIcons} ${GetTitle("total")} ${pluralize(totalIcons, "icon")} ${GetTitle("checked")})`}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            {loading ? GetTitle("Checking...") : GetTitle("Refresh")}
                        </Button>
                    </Box>
                </Box>

                {loading && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            {GetTitle("Checking icons...")} ({Math.round(progress)}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )}

                {!loading && missingIconsList.length === 0 ? (
                    <Alert severity="success">
                        <Typography>
                            {GetTitle("All icons are available locally. No missing icons found.")}
                        </Typography>
                    </Alert>
                ) : (
                    <Paper sx={{ p: 2 }}>
                        <List>
                            {missingIconsList.map((iconData) => (
                                <ListItem 
                                    key={iconData.iconName}
                                    sx={{ 
                                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                                        '&:last-child': { borderBottom: 'none' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                        <img 
                                            src={FormatIconLink(iconData.iconName)} 
                                            alt={iconData.iconName}
                                            width={40}
                                            height={40}
                                            style={{ borderRadius: '4px' }}
                                        />
                                        
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {iconData.iconName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {GetTitle(`${iconData.spellName} • ${iconData.specName} ${iconData.className}`)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button 
                                                size="small" 
                                                variant="text"
                                                component={Link}
                                                href={FormatIconLink(iconData.iconName)}
                                                target="_blank"
                                                rel="noopener"
                                            >
                                                {GetTitle("Wowhead Link")}
                                            </Button>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}

                {!loading && missingIconsList.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            {GetTitle("Summary by Class")}
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(
                                missingIconsList.reduce((acc, icon) => {
                                    const key = icon.className;
                                    acc[key] = (acc[key] || 0) + 1;
                                    return acc;
                                }, {} as Record<string, number>)
                            ).map(([className, count]) => (
                                <Grid item xs={6} sm={4} md={3} key={className}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">{count}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {GetTitle(className)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default MissingIcons;