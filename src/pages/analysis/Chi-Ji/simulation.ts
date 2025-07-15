import { AllyState, RotationResult, SimulationOptions } from './types.ts';
import { applyBuffEffects } from "../../../data/buffs/buffs.ts";
import { calculateCastTime } from "../../../data/spells/spell.ts";
import spell from "../../../data/spells/spell.ts";
import SPELLS from "../../../data/spells/index.ts";
import TALENTS from "../../../data/talents/monk/mistweaver.ts";

export const createAllyState = (id: number): AllyState => ({
    id,
    buffs: {
        envelopingMist: { 
            remaining: 0, 
            amp: 0 
        },
        renewingMist: { 
            remaining: 0, 
            amp: 0 
        },
        envelopingBreath: {
            remaining: 0,
            amp: 0
        }
    }
});

export const updateAllyBuffs = (allies: AllyState[], timeElapsed: number) => {
    allies.forEach(ally => {
        if (ally.buffs.envelopingMist.remaining > 0) {
            ally.buffs.envelopingMist.remaining -= timeElapsed;
            if (ally.buffs.envelopingMist.remaining <= 0) {
                ally.buffs.envelopingMist.amp = 0;
            }
        }
        if (ally.buffs.renewingMist.remaining > 0) {
            ally.buffs.renewingMist.remaining -= timeElapsed;
            if (ally.buffs.renewingMist.remaining <= 0) {
                ally.buffs.renewingMist.amp = 0;
            }
        }
        if (ally.buffs.envelopingBreath.remaining > 0) {
            ally.buffs.envelopingBreath.remaining -= timeElapsed;
            if (ally.buffs.envelopingBreath.remaining <= 0) {
                ally.buffs.envelopingBreath.amp = 0;
            }
        }
    });
};

export const getRandomAlly = (allies: AllyState[]): AllyState => {
    return allies[Math.floor(Math.random() * allies.length)];
};

export const getRandomAllies = (allies: AllyState[], count: number): AllyState[] => {
    const shuffled = [...allies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export const getAvailableEnvelopingMistTargets = (allies: AllyState[]): AllyState[] => {
    return allies.filter(ally => ally.buffs.envelopingMist.remaining <= 0);
};

export const applyEnvelopingMist = (allies: AllyState[], options: SimulationOptions) => {
    const availableTargets = getAvailableEnvelopingMistTargets(allies);
    const target = availableTargets.length > 0 ? getRandomAlly(availableTargets) : getRandomAlly(allies);
    
    const envelopingMist = SPELLS.ENVELOPING_MIST;
    const mistWrap = TALENTS.MIST_WRAP;
    const baseDuration = envelopingMist.custom.duration;
    const baseAmp = envelopingMist.custom.amp;

    const duration = options.mistWrap ? baseDuration + mistWrap.custom.duration : baseDuration;
    const amp = options.mistWrap ? baseAmp + mistWrap.custom.amp : baseAmp;
    
    target.buffs.envelopingMist.remaining = duration;
    target.buffs.envelopingMist.amp = amp;
    
    return target;
};

export const applyRenewingMistToTarget = (target: AllyState, options: SimulationOptions) => {
    target.buffs.renewingMist.remaining = SPELLS.RENEWING_MIST.custom.duration;
    target.buffs.renewingMist.amp = options.chiHarmony ? TALENTS.CHI_HARMONY.custom.amp : 1;

    return target;
};

export const applyRapidDiffusionRenewingMist = (allies: AllyState[], options: SimulationOptions) => {
    const target = getRandomAlly(allies);

    const renewingMist = SPELLS.RENEWING_MIST;
    const rapidDiffusion = TALENTS.RAPID_DIFFUSION;
    const chiHarmony = TALENTS.CHI_HARMONY;

    const rapidDiffusionHealing = ((renewingMist.value.healing || 0) / renewingMist.custom.duration ) * rapidDiffusion.custom.duration;

    target.buffs.renewingMist.remaining = rapidDiffusion.custom.duration;
    target.buffs.renewingMist.amp = options.chiHarmony ? chiHarmony.custom.amp : 1;

    const amplifiedHealing = calculateHealingWithAmp(rapidDiffusionHealing, target);
    
    return { target, healing: amplifiedHealing };
};

export const applyEnvelopingBreath = (allies: AllyState[], options: SimulationOptions) => {
    const celestialHarmony = TALENTS.CELESTIAL_HARMONY;
    const mistWrap = TALENTS.MIST_WRAP;
    
    const maxTargets = celestialHarmony.custom.envelopingBreathTargets;
    const baseDuration = celestialHarmony.custom.envelopingBreathDuration;
    const baseAmp = celestialHarmony.custom.envelopingBreathAmp;
    
    const duration = options.mistWrap ? baseDuration + mistWrap.custom.duration : baseDuration;
    const amp = baseAmp;
    
    const targets = getRandomAllies(allies, Math.min(maxTargets, allies.length));
    
    targets.forEach(target => {
        target.buffs.envelopingBreath.remaining = duration;
        target.buffs.envelopingBreath.amp = amp;
    });
    
    return targets;
};

export const calculateHealingWithAmp = (baseHealing: number, ally: AllyState): number => {
    let totalAmp = 1;
    totalAmp *= ally.buffs.envelopingMist.amp || 1;
    totalAmp *= ally.buffs.renewingMist.amp || 1;
    totalAmp *= ally.buffs.envelopingBreath.amp || 1;
    return baseHealing * totalAmp;
};

export const distributeAncientTeachings = (allies: AllyState[], totalHealing: number): number => {
    const maxTargets = Math.min(5, allies.length);
    const healingPerTarget = totalHealing / maxTargets;
    let actualTotalHealing = 0;
    
    const targets = getRandomAllies(allies, maxTargets);
    targets.forEach(target => {
        actualTotalHealing += calculateHealingWithAmp(healingPerTarget, target);
    });
    
    return actualTotalHealing;
};

export const distributeGusts = (allies: AllyState[], gustCount: number, chiJiGustHealing: number): number => {
    const targetsPerGust = Math.min(2, allies.length);
    const gustsPerTarget = 3;
    let totalHealing = 0;
    
    for (let i = 0; i < gustCount; i += 6) {
        const selectedTargets = getRandomAllies(allies, targetsPerGust);
        const baseGustHealing = chiJiGustHealing * gustsPerTarget;
        
        // Calculate healing for each target and accumulate
        for (const target of selectedTargets) {
            totalHealing += calculateHealingWithAmp(baseGustHealing, target);
        }
    }
    
    return totalHealing;
};

export const calculateRotationHPS = async (
    rotation: spell[], 
    rotationIndex: number, 
    options: SimulationOptions,
    mistweaver: any
): Promise<RotationResult> => {
    const buffedSpells = await applyBuffEffects(mistweaver, rotation);
    let totalTime = 0;
    let totalHealing = 0;
    let spellsCastInChiJi: spell[] = [];
    let totmStacks = 0;
    
    const jadeBond = TALENTS.JADE_BOND;
    const CHI_JI_DURATION = options.jadeBond ? jadeBond.custom.duration : SPELLS.CHI_JI.custom.duration;
    let chiJiActive = false;
    let chiJiTimeRemaining = 0;

    const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
    const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
    const ancientTeachingsTransfer = options.jadefireTeachings ? ancientTeachings.custom.transferRate + jadefireTeachings.custom.transferRate : ancientTeachings.custom.transferRate;
    const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;
    
    const awakenedJadefire = TALENTS.AWAKENED_JADEFIRE;
    const awakenedJadefireTransfer = awakenedJadefire.custom.transferRate;
    const awakenedJadefireTargetsPerSCK = awakenedJadefire.custom.targetsPerSCK;
    const awakenedJadefireArmorModifier = awakenedJadefire.custom.armorModifier;
    const awakenedJadefireTigerPalmHits = awakenedJadefire.custom.tigerPalmHits;

    const craneStyle = TALENTS.CRANE_STYLE;
    const craneStyleRisingSunKickGOM = craneStyle.custom.risingSunKickGOM;
    const craneStyleBlackoutKickGOM = craneStyle.custom.blackoutKickGOM;
    const craneStyleSpinningCraneKickGOM = craneStyle.custom.spinningCraneKickGOM;
    const craneStyleGOMChance = craneStyle.custom.gomChance;

    const teachingsOfTheMonastery = TALENTS.TEACHINGS_OF_THE_MONASTERY;
    const totmMaxStacks = teachingsOfTheMonastery.custom.maxStacks;

    const gomSpellpower = options.mastery * 1.05;
    const gustOfMistHealing = gomSpellpower / 100 * options.intellect;

    const chijiGustHealing = gustOfMistHealing * (options.jadeBond ? 1.2 : 1);
    const celestialHarmony = TALENTS.CELESTIAL_HARMONY;
    const celestialHarmonyChiCocoonAmount = celestialHarmony.custom.chiCocoonFormula(options.totalHp, options.versatility / 100);
    const celestialHarmonyChiCocoonMaxTargets = celestialHarmony.custom.chiCocoonTargets;

    const allies: AllyState[] = Array.from({ length: options.allyCount }, (_, i) => createAllyState(i));

    const healingBySpell: { [key: string]: { healing: number; sources: any; count: number } } = {};

    const calculateSpellHealingBreakdown = (spell: spell, totmStacks: number, allies: AllyState[], chiJiActive: boolean) => {
        const breakdown = {
            baseHealing: 0,
            chiJiGusts: 0,
            ancientTeachings: 0,
            awakenedJadefire: 0,
            gustOfMists: 0,
            envelopingMistAmp: 0,
            chiCocoons: 0,
            envelopingBreath: 0,
            rapidDiffusion: 0,
        };

        let renewingMistHealing = 0;

        switch (spell.id) {
            case SPELLS.CHI_JI.id:
                if (options.celestialHarmony) {
                    breakdown.chiCocoons = celestialHarmonyChiCocoonAmount * Math.min(celestialHarmonyChiCocoonMaxTargets, allies.length);
                }
                break;

            case SPELLS.TIGER_PALM.id:
                const tigerPalmDamage = spell.value?.damage || 0;
                const tigerPalmHits = options.awakenedJadefire ? awakenedJadefireTigerPalmHits : 1;
                const tigerPalmATHealing = tigerPalmDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * tigerPalmHits;
                breakdown.ancientTeachings = distributeAncientTeachings(allies, tigerPalmATHealing);
                break;
            
            case SPELLS.RISING_SUN_KICK.id:
                const rskDamage = spell.value?.damage || 0;
                const rskATHealing = rskDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
                breakdown.ancientTeachings = distributeAncientTeachings(allies, rskATHealing);
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = distributeGusts(allies, 6, chijiGustHealing);
                }

                if (options.craneStyle) {
                    const rskGOMTarget = getRandomAlly(allies);
                    const rskgustOfMistHealing = gustOfMistHealing * craneStyleRisingSunKickGOM;
                    breakdown.gustOfMists = calculateHealingWithAmp(rskgustOfMistHealing, rskGOMTarget);
                }

                const rskRenewingMist = applyRapidDiffusionRenewingMist(allies, options);
                renewingMistHealing = rskRenewingMist.healing;
                break;
            
            case SPELLS.BLACKOUT_KICK.id:
                const bokDamage = spell.value?.damage || 0;
                const bokHits = 1 + totmStacks;
                let bokATHealing = bokDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * bokHits;
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = distributeGusts(allies, 6 * bokHits, chijiGustHealing);
                }
                
                if (options.awakenedJadefire) {
                    const bokEffectiveness = awakenedJadefire.custom.blackoutKickEffectiveness;
                    const bokMaxAdditionalHits = awakenedJadefire.custom.blackoutKickHits;
                    const awakenedJadefireBokHits = Math.min(options.enemyCount - 1, bokMaxAdditionalHits);
                    
                    if (awakenedJadefireBokHits > 0) {
                        const awakenedJadefireBokDamage = bokDamage * bokEffectiveness;
                        bokATHealing += awakenedJadefireBokDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * awakenedJadefireBokHits * bokHits;
                    }
                }
                
                breakdown.ancientTeachings = distributeAncientTeachings(allies, bokATHealing);
                
                if (options.craneStyle) {
                    let totalBokGOMHealing = 0;
                    for (let i = 0; i < bokHits; i++) {
                        if (Math.random() < craneStyleGOMChance) {
                            const bokGOMTarget = getRandomAlly(allies);
                            const bokGOMHealing = gustOfMistHealing * craneStyleBlackoutKickGOM;
                            totalBokGOMHealing += calculateHealingWithAmp(bokGOMHealing, bokGOMTarget);
                        }
                    }
                    breakdown.gustOfMists = totalBokGOMHealing;
                }

                break;
            
            case SPELLS.SPINNING_CRANE_KICK.id:
                const sckDamage = spell.value?.damage || 0;
                const sckTargetMultiplier = options.enemyCount <= 5 
                    ? options.enemyCount
                    : options.enemyCount * Math.sqrt(5 / options.enemyCount);
                const sckAJHealing = sckDamage * (awakenedJadefireTransfer * awakenedJadefireTargetsPerSCK) * awakenedJadefireArmorModifier * sckTargetMultiplier;
                breakdown.awakenedJadefire = sckAJHealing;
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = chijiGustHealing * 6;
                }
                
                if (options.craneStyle) {
                    if (Math.random() < craneStyleGOMChance) {
                        const sckGomTarget = getRandomAlly(allies);
                        const sckGOMHealing = gustOfMistHealing * craneStyleSpinningCraneKickGOM;
                        breakdown.gustOfMists = calculateHealingWithAmp(sckGOMHealing, sckGomTarget);
                    }
                }
                
                break;
            
            case SPELLS.ENVELOPING_MIST.id:
                const envTarget = applyEnvelopingMist(allies, options);
                const envBaseHealing = spell.value?.healing || 0;
                breakdown.baseHealing = calculateHealingWithAmp(envBaseHealing, envTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, envTarget);

                if (chiJiActive && options.celestialHarmony) {
                    const envBTargets = applyEnvelopingBreath(allies, options);
                    const envBHealing = celestialHarmony.custom.envelopingBreathHealing;
                    let envBTotalHealing = 0;
                    
                    envBTargets.forEach(target => {
                        envBTotalHealing += calculateHealingWithAmp(envBHealing, target);
                    });
                    
                    breakdown.envelopingBreath = envBTotalHealing;
                }
                
                const envRenewingMist = applyRapidDiffusionRenewingMist(allies, options);
                renewingMistHealing = envRenewingMist.healing;
                
                break;
            
            case SPELLS.VIVIFY.id:
                const vivifyTarget = getRandomAlly(allies);
                const vivifyBaseHealing = spell.value?.healing || 0;
                breakdown.baseHealing = calculateHealingWithAmp(vivifyBaseHealing, vivifyTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, vivifyTarget);
                break;
            case SPELLS.RENEWING_MIST.id:
                const renewingMistTarget = getRandomAlly(allies);
                applyRenewingMistToTarget(renewingMistTarget, options);
                const renewingMistBaseHealing = spell.value?.healing || 0;
                breakdown.baseHealing = calculateHealingWithAmp(renewingMistBaseHealing, renewingMistTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, renewingMistTarget);
                break;
            default:
                const defaultTarget = getRandomAlly(allies);
                const defaultBaseHealing = spell.value?.healing || 0;
                breakdown.baseHealing = calculateHealingWithAmp(defaultBaseHealing, defaultTarget);
        }

        const totalHealing = breakdown.baseHealing + breakdown.chiJiGusts + breakdown.ancientTeachings + 
                           breakdown.awakenedJadefire + breakdown.gustOfMists + 
                           breakdown.chiCocoons + breakdown.envelopingBreath;

        return { breakdown, totalHealing, renewingMistHealing };
    };

    for (const spell of buffedSpells) {
        const castTime = calculateCastTime(spell, options.haste);
        const isOffGCD = (spell.castTime === 0 || spell.castTime === undefined) && spell.gcd === false;
        
        if (!isOffGCD) {
            updateAllyBuffs(allies, castTime);
            
            if (chiJiActive && chiJiTimeRemaining > 0) {
                chiJiTimeRemaining -= castTime;
                if (chiJiTimeRemaining <= 0) {
                    chiJiActive = false;
                }
            }

            if (spell.id === SPELLS.CHI_JI.id) {
                chiJiActive = true;
                chiJiTimeRemaining = CHI_JI_DURATION;
            }

            // Only apply duration limit after Chi-Ji has been cast
            if (!chiJiActive || (chiJiTimeRemaining > 0) || spell.id === SPELLS.CHI_JI.id) {
                const { breakdown, totalHealing: spellHealing, renewingMistHealing } = calculateSpellHealingBreakdown(
                    spell, 
                    totmStacks, 
                    allies,
                    chiJiActive && chiJiTimeRemaining > 0
                );
                
                totalHealing += spellHealing;

                if (renewingMistHealing > 0) {
                    const renewingMistKey = SPELLS.RENEWING_MIST.name;
                    if (!healingBySpell[renewingMistKey]) {
                        healingBySpell[renewingMistKey] = { healing: 0, sources: {}, count: 0 };
                    }
                    healingBySpell[renewingMistKey].healing += renewingMistHealing;
                    healingBySpell[renewingMistKey].count += 1;
                    if (!healingBySpell[renewingMistKey].sources.rapidDiffusion) {
                        healingBySpell[renewingMistKey].sources.rapidDiffusion = 0;
                    }
                    healingBySpell[renewingMistKey].sources.rapidDiffusion += renewingMistHealing;

                    totalHealing += renewingMistHealing;
                }
                
                totalTime += castTime;
                spellsCastInChiJi.push(spell);

                if (spell.id === SPELLS.TIGER_PALM.id) {
                    const stacksGained = options.awakenedJadefire ? awakenedJadefireTigerPalmHits : 1;
                    totmStacks = Math.min(totmStacks + stacksGained, totmMaxStacks);
                } else if (spell.id === SPELLS.BLACKOUT_KICK.id) {
                    totmStacks = 0;
                }

                const spellKey = spell.name;
                if (!healingBySpell[spellKey]) {
                    healingBySpell[spellKey] = { healing: 0, sources: {}, count: 0 };
                }
                healingBySpell[spellKey].healing += spellHealing;
                healingBySpell[spellKey].count += 1;
                
                Object.keys(breakdown).forEach(key => {
                    if (!healingBySpell[spellKey].sources[key]) {
                        healingBySpell[spellKey].sources[key] = 0;
                    }
                    healingBySpell[spellKey].sources[key] += breakdown[key];
                });
            } else {
                break;
            }
        } else {
            // Off-GCD spells always execute
            const { breakdown, totalHealing: spellHealing } = calculateSpellHealingBreakdown(
                spell, 
                totmStacks, 
                allies,
                chiJiActive && chiJiTimeRemaining > 0
            );
            
            totalHealing += spellHealing;
            spellsCastInChiJi.push(spell);

            const spellKey = spell.name;
            if (!healingBySpell[spellKey]) {
                healingBySpell[spellKey] = { healing: 0, sources: {}, count: 0 };
            }
            healingBySpell[spellKey].healing += spellHealing;
            healingBySpell[spellKey].count += 1;
            
            Object.keys(breakdown).forEach(key => {
                if (!healingBySpell[spellKey].sources[key]) {
                    healingBySpell[spellKey].sources[key] = 0;
                }
                healingBySpell[spellKey].sources[key] += breakdown[key];
            });
        }
    }

    const rotationBreakdown = Object.entries(healingBySpell)
    .filter(([spellName, data]) => data.healing > 0)
    .map(([spellName, data]) => ({
        spellName,
        healing: data.healing,
        percentage: totalHealing > 0 ? (data.healing / totalHealing) * 100 : 0,
        sources: data.sources
    })).sort((a, b) => b.healing - a.healing);

    const hps = totalTime > 0 ? totalHealing / totalTime : 0;

    return {
        id: `Rotation ${rotationIndex + 1}`,
        name: `Rotation ${rotationIndex + 1}`,
        hps,
        totalHealing,
        duration: totalTime,
        spells: spellsCastInChiJi,
        breakdown: rotationBreakdown
    };
};