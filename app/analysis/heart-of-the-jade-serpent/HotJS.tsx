"use client";

import React, { useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Slider,
    Chip,
    Stack,
    Tooltip,
    Divider,
    useTheme,
    Checkbox,
} from '@mui/material';

import TalentsCard from '@components/TalentsCard/TalentsCard';
import IconButtonBase from '@components/SpellButtons/IconButtonBase';
import SpellButton from '@components/SpellButtons/SpellButton';
import PageHeader from '@components/PageHeader/PageHeader';
import { useThemeContext } from '@context/ThemeContext';
import SPELLS from "@data/spells/index";
import spell, { GCD } from '@data/spells/spell';
import TALENTS from "@data/talents/monk/mistweaver";
import { GetTitle, pluralize } from '@util/stringManipulation';

const MAX_WIDTH = 1100;
const TIMELINE_HEIGHT = 500;
const MAIN_TIMELINE_Y_RATIO = 2.5;
const CAST_PRIORITY = [
    SPELLS.THUNDER_FOCUS_TEA, 
    SPELLS.RENEWING_MIST, 
    SPELLS.RISING_SUN_KICK, 
    SPELLS.LIFE_COCOON
];

interface AbilityCooldown {
    spell: spell;
    currentCooldown: number;
    availableAt: number;
    color: string;
}

interface HotJSEvent {
    castStartTime: number;
    startTime: number;
    duration: number;
    multiplier: number;
    source: spell;
    castTime: number;
}

interface CastPeriod {
    start: number;
    end: number;
}

interface AbilityData {
    availableTimes: number[];
    onCooldownPeriods: CastPeriod[];
}

interface SimulationData {
    [key: string]: AbilityData;
}

interface BaselineData {
    [key: string]: { availableTimes: number[] };
}

const createAffectedAbilities = (): AbilityCooldown[] => [
    {
        spell: SPELLS.RENEWING_MIST,
        currentCooldown: 0,
        availableAt: 0,
        color: "#6ff5d6"
    },
    {
        spell: SPELLS.RISING_SUN_KICK,
        currentCooldown: 0,
        availableAt: 0,
        color: "#fd8500"
    },
    {
        spell: SPELLS.THUNDER_FOCUS_TEA,
        currentCooldown: 0,
        availableAt: 0,
        color: "#87a1e8"
    },
    {
        spell: SPELLS.LIFE_COCOON,
        currentCooldown: 0,
        availableAt: 0,
        color: "#fbff4e"
    }
];

const roundTime = (time: number): number => Math.round(time * 10) / 10;

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
};

const isCurrentlyBlocked = (time: number, castPeriods: CastPeriod[]): boolean => {
    return castPeriods.some(cast => time >= cast.start && time < cast.end);
};

const initializeAbilityData = (abilities: AbilityCooldown[]): { abilityData: SimulationData; baselineData: BaselineData } => {
    const abilityData: SimulationData = {};
    const baselineData: BaselineData = {};
    
    abilities.forEach(ability => {
        abilityData[ability.spell.name] = { availableTimes: [], onCooldownPeriods: [] };
        baselineData[ability.spell.name] = { availableTimes: [] };
    });
    
    return { abilityData, baselineData };
};

const generateConduitCasts = (timeRange: number, celestialConduitCastTime: number): { events: HotJSEvent[], casts: CastPeriod[] } => {
    const events: HotJSEvent[] = [];
    const casts: CastPeriod[] = [];
    
    for (let time = 0; time < timeRange; time += SPELLS.CELESTIAL_CONDUIT.cooldown) {
        const castTime = celestialConduitCastTime || 3;
        
        casts.push({ start: time, end: time + castTime });
        events.push({
            castStartTime: time,
            startTime: time + castTime,
            duration: 8,
            multiplier: 2.5,
            source: SPELLS.CELESTIAL_CONDUIT,
            castTime: castTime
        });
    }
    
    return { events, casts };
};

const generateSheilunsGiftCasts = (
    timeRange: number,
    stackGenerationTime: number,
    sheilunsGiftCastTime: number,
    blockedPeriods: CastPeriod[]
): { events: HotJSEvent[], casts: CastPeriod[] } => {
    const events: HotJSEvent[] = [];
    const casts: CastPeriod[] = [];
    const maxStacks = SPELLS.SHEILUNS_GIFT.custom.maxStacks;
    let currentStacks = 0;
    
    for (let time = 0; time < timeRange; time += 0.1) {
        if (time > 0 && time % stackGenerationTime < 0.1) {
            currentStacks = Math.min(maxStacks, currentStacks + 1);
        }

        if (currentStacks === maxStacks && !isCurrentlyBlocked(time, blockedPeriods)) {
            const duration = (currentStacks / maxStacks) * stackGenerationTime;

            casts.push({ start: time, end: time + sheilunsGiftCastTime });
            events.push({
                castStartTime: time,
                startTime: time + sheilunsGiftCastTime,
                duration: duration,
                multiplier: 1.75,
                source: SPELLS.SHEILUNS_GIFT,
                castTime: sheilunsGiftCastTime
            });
            currentStacks = 0;
        }
    }
    
    return { events, casts };
};

const simulateBaseline = (
    timeRange: number,
    abilities: AbilityCooldown[],
    baselineData: BaselineData
): void => {
    const baselineAbilities = abilities.map(a => ({ ...a, nextAvailable: 0 }));
    let nextGCDFree = 0;

    for (let time = 0; time < timeRange; time += 0.1) {
        time = roundTime(time);
        
        if (time >= nextGCDFree) {
            for (const cast of CAST_PRIORITY) {
                const ability = baselineAbilities.find(a => a.spell.name === cast.name);
                if (ability && time >= ability.nextAvailable) {
                    const triggersGCD = ability.spell.gcd !== false;
                    const castTime = ability.spell.castTime || 0;
                    
                    if (!triggersGCD || time >= nextGCDFree) {
                        if (triggersGCD) {
                            nextGCDFree = time + (castTime === 0 ? GCD : Math.max(castTime, GCD));
                        }

                        ability.nextAvailable = time + (ability.spell.cooldown || 0);
                        baselineData[ability.spell.name].availableTimes.push(time);

                        if (triggersGCD) break;
                    }
                }
            }
        }
    }
};

const simulateWithHotJS = (
    timeRange: number,
    abilities: AbilityCooldown[],
    events: HotJSEvent[],
    abilityData: SimulationData,
    tierSet: boolean,
    cdrEnabled: boolean,
    allCastPeriods: CastPeriod[]
): HotJSEvent[] => {
    const updatedEvents = [...events];
    const simAbilities = abilities.map(a => ({ ...a, nextAvailable: 0 }));
    let nextGCDFree = 0;
    
    for (let time = 0; time < timeRange; time += 0.1) {
        time = roundTime(time);
        
        let activeMultiplier = 1;
        if (cdrEnabled) {
            const activeBuffs = updatedEvents.filter(event => 
                time >= event.startTime && time < event.startTime + event.duration
            );
            
            if (activeBuffs.length > 0) {
                activeMultiplier = Math.max(...activeBuffs.map(buff => buff.multiplier));
            }
        }

        simAbilities.forEach(ability => {
            if (ability.nextAvailable > time && cdrEnabled) {
                const reduction = 0.1 * (activeMultiplier - 1);
                ability.nextAvailable = Math.max(time, ability.nextAvailable - reduction);
            }
        });

        if (!isCurrentlyBlocked(time, allCastPeriods)) {
            for (const cast of CAST_PRIORITY) {
                const ability = simAbilities.find(a => a.spell.name === cast.name);
                if (ability && time >= ability.nextAvailable) {
                    const triggersGCD = ability.spell.gcd !== false;
                    
                    if (!triggersGCD || time >= nextGCDFree) {
                        const castTime = ability.spell.castTime || 0;
                        
                        if (triggersGCD) {
                            nextGCDFree = time + (castTime === 0 ? GCD : Math.max(castTime, GCD));
                        }

                        ability.nextAvailable = time + (ability.spell.cooldown || 0);

                        if (cast === SPELLS.THUNDER_FOCUS_TEA && tierSet) {
                            updatedEvents.push({
                                castStartTime: time,
                                startTime: time,
                                duration: 8,
                                multiplier: 1.75,
                                source: SPELLS.THUNDER_FOCUS_TEA,
                                castTime: 0
                            });
                            updatedEvents.sort((a, b) => a.startTime - b.startTime);
                        }
                        
                        abilityData[ability.spell.name].availableTimes.push(time);
                        abilityData[ability.spell.name].onCooldownPeriods.push({
                            start: time,
                            end: ability.nextAvailable
                        });
                        
                        if (triggersGCD) break;
                    }
                }
            }
        }
    }
    
    return updatedEvents;
};

const TimeSliderCard: React.FC<{
    timeRange: number;
    onTimeRangeChange: (value: number) => void;
}> = ({ timeRange, onTimeRangeChange }) => (
    <Card variant="outlined" sx={{ 
        p: 2, 
        background: `linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(54, 162, 235, 0.05))`, 
        borderColor: 'rgba(54, 162, 235, 0.3)',
        '& .MuiSlider-root': { color: 'rgba(54, 162, 235, 0.8)' },
        '& .MuiSlider-thumb': {
            backgroundColor: 'rgb(54, 162, 235)',
            '&:hover': { boxShadow: '0px 0px 0px 8px rgba(54, 162, 235, 0.16)' },
        },
        '& .MuiSlider-track': { backgroundColor: 'rgb(54, 162, 235)' },
        '& .MuiSlider-rail': { backgroundColor: 'rgba(54, 162, 235, 0.3)' },
    }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'rgb(54, 162, 235)' }}>
            {GetTitle("Time Range")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {timeRange} seconds ({formatTime(timeRange)})
        </Typography>
        <Slider
            value={timeRange}
            onChange={(_, newValue) => onTimeRangeChange(newValue as number)}
            min={60}
            max={600}
            step={30}
            marks={[
                { value: 120, label: '2m' },
                { value: 300, label: '5m' },
                { value: 600, label: '10m' }
            ]}
            sx={{
                '& .MuiSlider-markLabel': {
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                },
            }}
        />
    </Card>
);

const OptionsCard: React.FC<{
    tierSet: boolean;
    cdrEnabled: boolean;
    onTierSetChange: (value: boolean) => void;
    onCdrEnabledChange: (value: boolean) => void;
}> = ({ tierSet, cdrEnabled, onTierSetChange, onCdrEnabledChange }) => (
    <Card variant="outlined" sx={{ 
        p: 2, 
        background: `linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))`, 
        borderColor: 'rgba(76, 175, 80, 0.3)' 
    }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <OptionCheckbox
                checked={cdrEnabled}
                onChange={onCdrEnabledChange}
                title={GetTitle("Enable Increased Cooldown Recovery Rate")}
                description={GetTitle("Apply increased cooldown recovery rate effects from Heart of the Jade Serpent")}
            />
            <OptionCheckbox
                checked={tierSet}
                onChange={onTierSetChange}
                title={GetTitle("11.2 Tier Set")}
                description={GetTitle("Thunder Focus Tea procs Heart of the Jade Serpent for 8 seconds with the 4-set in 11.2")}
            />
        </Box>
    </Card>
);

const OptionCheckbox: React.FC<{
    checked: boolean;
    onChange: (value: boolean) => void;
    title: string;
    description: string;
}> = ({ checked, onChange, title, description }) => (
    <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            borderRadius: 1,
            border: `1px solid rgba(76, 175, 80, 0.2)`,
            backgroundColor: checked ? `rgba(76, 175, 80, 0.1)` : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: `rgba(76, 175, 80, 0.05)`,
                borderColor: `rgba(76, 175, 80, 0.4)`,
            }
        }}
        onClick={() => onChange(!checked)}
    >
        <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            sx={{
                color: `rgba(76, 175, 80, 0.6)`,
                '&.Mui-checked': { color: `rgb(76, 175, 80)` },
                '&:hover': { backgroundColor: `rgba(76, 175, 80, 0.1)` },
            }}
        />
        <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ 
                fontWeight: 'bold',
                color: checked ? `rgb(76, 175, 80)` : 'text.primary',
                transition: 'color 0.2s ease'
            }}>
                {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {description}
            </Typography>
        </Box>
    </Box>
);

const StatsCard: React.FC<{
    events: HotJSEvent[];
    timeRange: number;
    abilities: AbilityCooldown[];
    abilityData: SimulationData;
    baselineData: BaselineData;
    themeMode: string;
}> = ({ events, timeRange, abilities, abilityData, baselineData, themeMode }) => (
    <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack spacing={1}>
            <Card variant="outlined" sx={{ 
                p: 2, 
                background: `linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))`, 
                borderColor: 'rgba(156, 39, 176, 0.3)'
            }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'rgb(156, 39, 176)' }}>
                    {GetTitle("Heart of the Jade Serpent Events")}: {events.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {GetTitle("Total Uptime")}: {events.reduce((sum, event) => sum + event.duration, 0).toFixed(1)}s 
                    ({((events.reduce((sum, event) => sum + event.duration, 0) / timeRange) * 100).toFixed(1)}%)
                </Typography>
            </Card>
            {abilities.map(ability => {
                const withHotJS = abilityData[ability.spell.name].availableTimes.length;
                const baseline = baselineData[ability.spell.name].availableTimes.length;
                const extraCasts = withHotJS - baseline;
                const castsPerMinute = (withHotJS / timeRange) * 60;
                
                return (
                    <Card key={ability.spell.name} variant="outlined" sx={{ 
                        p: 2, 
                        background: `linear-gradient(135deg, ${ability.color}20, ${ability.color}10)`, 
                        borderColor: `${ability.color}50`
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SpellButton selectedSpell={ability.spell} action={() => {}} size={32} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: ability.color }}>
                                {GetTitle(ability.spell.name)}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip 
                                label={`${withHotJS} ${GetTitle(pluralize(withHotJS, "Cast"))}`}
                                size="small" 
                                variant='outlined'
                                sx={{ 
                                    backgroundColor: ability.color + '20', 
                                    color: ability.color, 
                                    borderColor: ability.color + '50',
                                    '&:hover': {
                                        backgroundColor: ability.color + '30',
                                        borderColor: ability.color + '70',
                                    }
                                }}
                            />
                            <Chip 
                                label={`+${extraCasts} ${GetTitle("Extra")}`} 
                                size="small" 
                                variant='outlined'
                                sx={{ 
                                    backgroundColor: extraCasts > 0 ? '#4ade8020' : 'transparent',
                                    color: extraCasts > 0 ? '#4ade80' : (themeMode === 'dark' ? 'rgba(255,255,255,0.5)' : '#999'),
                                    borderColor: extraCasts > 0 ? '#4ade8050' : (themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : '#ddd'),
                                    '&:hover': {
                                        backgroundColor: extraCasts > 0 ? '#4ade8030' : (themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                        borderColor: extraCasts > 0 ? '#4ade8070' : (themeMode === 'dark' ? 'rgba(255,255,255,0.3)' : '#bbb'),
                                    }
                                }}
                            />
                            <Chip 
                                label={`${castsPerMinute.toFixed(1)} ${GetTitle("cpm")}`} 
                                size="small"
                                variant='outlined'
                                sx={{
                                    backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
                                    color: themeMode === 'dark' ? 'white' : 'inherit',
                                    borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : '#ddd',
                                    '&:hover': {
                                        backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.15)' : '#e8e8e8',
                                        borderColor: themeMode === 'dark' ? 'rgba(255,255,255,0.3)' : '#bbb',
                                    }
                                }}
                            />
                        </Stack>
                    </Card>
                );
            })}
        </Stack>
    </Box>
);

const TimelineView: React.FC<{
    events: HotJSEvent[];
    abilities: AbilityCooldown[];
    abilityData: SimulationData;
    timeRange: number;
    themeMode: string;
}> = ({ events, abilities, abilityData, timeRange, themeMode }) => {
    const mainTimelineY = TIMELINE_HEIGHT / MAIN_TIMELINE_Y_RATIO;
    const isDark = themeMode === 'dark';
    const leftMargin = 30;
    
    return (
        <Card variant="outlined" sx={{
            maxWidth: MAX_WIDTH,
            width: "95%",
            mx: "auto"
        }}>
            <CardContent>
                <Box sx={{ 
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    '&::-webkit-scrollbar': { height: 8 },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f1f1',
                        borderRadius: 1,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : '#888',
                        borderRadius: 1,
                    },
                }}>
                    <Box sx={{ 
                        position: 'relative', 
                        height: TIMELINE_HEIGHT, 
                        width: Math.max(1200, timeRange * 6 + leftMargin),
                        backgroundColor: isDark ? 'rgba(20, 20, 20, 0.8)' : '#fafafa',
                        borderRadius: 1,
                        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #ddd',
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: mainTimelineY,
                            left: leftMargin,
                            right: 0,
                            height: 3,
                            backgroundColor: isDark ? '#666' : '#333',
                            zIndex: 1
                        }} />

                        {Array.from({ length: Math.floor(timeRange / 10) + 1 }, (_, i) => i * 10).map(time => (
                            <Box key={time}>
                                <Box sx={{
                                    position: 'absolute',
                                    left: `calc(${leftMargin}px + ${(time / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100)}%)`,
                                    top: mainTimelineY - 15,
                                    width: 2,
                                    height: 30,
                                    backgroundColor: isDark ? '#999' : '#666',
                                    zIndex: 2
                                }} />
                                <Typography sx={{
                                    position: 'absolute',
                                    left: `calc(${leftMargin}px + ${(time / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100)}%)`,
                                    top: mainTimelineY + 20,
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                }}>
                                    {formatTime(time)}
                                </Typography>
                            </Box>
                        ))}

                        {events.map((event, i) => {
                            const yOffset = (i % 3) * 50;
                            
                            const castStartPercent = (event.castStartTime / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100);
                            const castStartCalc = `calc(${leftMargin}px + ${castStartPercent}%)`;
                            
                            const hotjsStartPercent = (event.startTime / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100);
                            const hotjsStartCalc = `calc(${leftMargin}px + ${hotjsStartPercent}%)`;
                            
                            const hotjsDurationWidth = `${(event.duration / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100)}%`;
                            
                            return (
                                <Box key={`hotjs-${i}`}>
                                    <Box sx={{
                                        position: 'absolute',
                                        left: hotjsStartCalc,
                                        width: hotjsDurationWidth,
                                        top: 0,
                                        height: '100%',
                                        backgroundColor: event.multiplier === 2.5 ? '#22c55e' : '#86efac',
                                        opacity: 0.15,
                                        zIndex: 0,
                                    }} />

                                    <Tooltip title={`${GetTitle(event.source.name)} cast starts at ${event.castStartTime.toFixed(1)}s, ${GetTitle("Heart of the Jade Serpent")} activates at ${event.startTime.toFixed(1)}s`}>
                                        <Box sx={{
                                            position: 'absolute',
                                            left: castStartCalc,
                                            top: mainTimelineY - 80 - yOffset,
                                            transform: 'translateX(-50%)',
                                            zIndex: 3,
                                        }}>
                                            <IconButtonBase
                                                icon={event.source.icon}
                                                name={event.source.name}
                                                tooltip={false}
                                                size={32}
                                            />
                                        </Box>
                                    </Tooltip>
                                    
                                    <Tooltip title={`${GetTitle("Heart of the Jade Serpent active")}: ${event.startTime.toFixed(1)}s - ${(event.startTime + event.duration).toFixed(1)}s (${event.multiplier === 2.5 ? '150%' : '75%'} ${GetTitle("Cooldown Reduction")})`}>
                                        <Box sx={{
                                            position: 'absolute',
                                            left: hotjsStartCalc,
                                            width: hotjsDurationWidth,
                                            top: mainTimelineY - 55 - yOffset,
                                            height: 10,
                                            backgroundColor: event.multiplier === 2.5 ? '#22c55e' : '#86efac',
                                            borderRadius: 1,
                                            opacity: 0.8,
                                            zIndex: 2,
                                        }} />
                                    </Tooltip>

                                    <Box sx={{
                                        position: 'absolute',
                                        left: `calc(${castStartCalc} - 1.5px)`,
                                        top: mainTimelineY - 45 - yOffset,
                                        width: 3,
                                        height: 45 + yOffset,
                                        backgroundColor: isDark ? '#555' : '#999',
                                        opacity: 0.5,
                                        zIndex: 1
                                    }} />
                                </Box>
                            );
                        })}

                        {abilities.map((ability, abilityIndex) => {
                            const yPosition = mainTimelineY + 60 + (abilityIndex * 60);
                            
                            return (
                                <Box key={ability.spell.name}>
                                    {abilityData[ability.spell.name].availableTimes.filter(time => time > 0).map((castTime, castIndex) => {
                                        const leftPosPercent = (castTime / timeRange) * (100 - (leftMargin / (timeRange * 6 + leftMargin)) * 100);
                                        const leftPosCalc = `calc(${leftMargin}px + ${leftPosPercent}%)`;
                                        
                                        return (
                                            <Box key={`${ability.spell.name}-${castIndex}`}>
                                                <Tooltip title={`${GetTitle(ability.spell.name)} cast at ${castTime.toFixed(1)}s`}>
                                                    <Box sx={{
                                                        position: 'absolute',
                                                        left: leftPosCalc,
                                                        top: yPosition - 12,
                                                        transform: 'translateX(-50%)',
                                                        zIndex: 4,
                                                        '&:hover': {
                                                            transform: 'translateX(-50%) scale(1.1)',
                                                            transition: 'transform 0.2s ease'
                                                        }
                                                    }}>
                                                        <IconButtonBase
                                                            icon={ability.spell.icon}
                                                            name={ability.spell.name}
                                                            tooltip={false}
                                                            size={24}
                                                        />
                                                    </Box>
                                                </Tooltip>

                                                <Box sx={{
                                                    position: 'absolute',
                                                    left: `calc(${leftPosCalc} - 1.5px)`,
                                                    top: mainTimelineY + 3,
                                                    width: 3,
                                                    height: yPosition - mainTimelineY - 15,
                                                    backgroundColor: ability.color,
                                                    opacity: 0.4,
                                                    zIndex: 1,
                                                }} />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const HotJS: React.FC<{ title: string; description: string }> = ({ title, description }) => {
    const { themeMode } = useThemeContext();
    const theme = useTheme();

    const veilOfPride = TALENTS.VEIL_OF_PRIDE;
    const shaohaosLessons = TALENTS.SHAOHAOS_LESSONS;
    
    const [timeRange, setTimeRange] = useState<number>(300);
    const [tierSet, setTierSet] = useState<boolean>(false);
    const [cdrEnabled, setCdrEnabled] = useState<boolean>(true);
    const [sheilunsGiftTalents, setSheilunsGiftTalents] = useState<Map<spell, boolean>>(new Map([
        [veilOfPride, false],
        [shaohaosLessons, true],
    ]));

    const affectedAbilities = useMemo(() => createAffectedAbilities(), []);
    const sheilunsGiftCastTime = SPELLS.SHEILUNS_GIFT.castTime;
    const celestialConduitCastTime = SPELLS.CELESTIAL_CONDUIT.castTime;
    const stackGenerationTime = sheilunsGiftTalents.get(shaohaosLessons) ?
                                shaohaosLessons.custom.secondsPerCloud : 
                                veilOfPride.custom.secondsPerCloud;

    const handleSheilunsGiftTalentChange = (talent: spell, checked: boolean) => {
        if (checked) {
            const newTalents = new Map<spell, boolean>();
            sheilunsGiftTalents.forEach((_, key) => newTalents.set(key, false));
            newTalents.set(talent, true);
            setSheilunsGiftTalents(newTalents);
        } else {
            const newTalents = new Map(sheilunsGiftTalents);
            newTalents.set(talent, false);
            
            const hasAnySelected = Array.from(newTalents.values()).some(value => value);
            if (!hasAnySelected) {
                newTalents.set(TALENTS.SHAOHAOS_LESSONS, true);
            }
            
            setSheilunsGiftTalents(newTalents);
        }
    };

    const simulation = useMemo(() => {
        const { abilityData, baselineData } = initializeAbilityData(affectedAbilities);
        
        const { events: conduitEvents, casts: conduitCasts } = generateConduitCasts(
            timeRange, 
            celestialConduitCastTime
        );
        
        const { events: sgEvents, casts: sgCasts } = generateSheilunsGiftCasts(
            timeRange,
            stackGenerationTime,
            sheilunsGiftCastTime,
            conduitCasts
        );
        
        let allEvents = [...conduitEvents, ...sgEvents];
        const allCastPeriods = [...conduitCasts, ...sgCasts];
        
        simulateBaseline(timeRange, affectedAbilities, baselineData);
        
        const finalEvents = simulateWithHotJS(
            timeRange,
            affectedAbilities,
            allEvents,
            abilityData,
            tierSet,
            cdrEnabled,
            allCastPeriods
        );
        
        return { 
            events: finalEvents, 
            abilityData, 
            baselineData, 
            abilities: affectedAbilities 
        };
    }, [
        timeRange, 
        tierSet, 
        stackGenerationTime, 
        sheilunsGiftCastTime, 
        celestialConduitCastTime, 
        cdrEnabled,
        affectedAbilities
    ]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <PageHeader title={title} subtitle={description} />
            
            <Card variant="outlined" sx={{ maxWidth: MAX_WIDTH, width: "95%", mx: "auto", mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, gap: 2 }}>
                        <Chip 
                            label={GetTitle("⚠︎ We are assuming every spell is being used on cooldown as it becomes available")} 
                            color="warning" 
                            size="small"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                '& .MuiChip-label': {
                                    px: 1
                                },
                                borderColor: 'warning.main',
                                borderRadius: 1,
                                backgroundColor: 'rgba(255, 152, 0, 0.08)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 152, 0, 0.12)',
                                }
                            }}
                        />
                        <OptionsCard
                            tierSet={tierSet}
                            cdrEnabled={cdrEnabled}
                            onTierSetChange={setTierSet}
                            onCdrEnabledChange={setCdrEnabled}
                        />
                        <TalentsCard
                            options={sheilunsGiftTalents}
                            color={theme.palette.primary.main}
                            onChange={handleSheilunsGiftTalentChange}
                        />
                        <TimeSliderCard
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                        />
                    </Box>
                    
                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
                    <Divider sx={{ display: { md: 'none' } }} />

                    <StatsCard
                        events={simulation.events}
                        timeRange={timeRange}
                        abilities={affectedAbilities}
                        abilityData={simulation.abilityData}
                        baselineData={simulation.baselineData}
                        themeMode={themeMode}
                    />
                </Box>
            </Card>

            <TimelineView
                events={simulation.events}
                abilities={affectedAbilities}
                abilityData={simulation.abilityData}
                timeRange={timeRange}
                themeMode={themeMode}
            />
        </div>
    );
};

export default HotJS;