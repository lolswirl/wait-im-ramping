import { AllyState, isTalentEnabled, RotationResult, SimulationOptions } from './types';
import { applyBuffEffects } from "@data/buffs";
import { calculateCastTime } from "@data/spells/spell";
import spell from "@data/spells/spell";
import SPELLS from "@data/spells";
import TALENTS from "@data/specs/monk/mistweaver/talents";
import SHARED from "@data/specs/monk/talents";
import { CLASSES } from '@data/class';
import { SCHOOLS } from '@data/shared/schools';

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

    const duration = isTalentEnabled(options, TALENTS.MIST_WRAP) ? baseDuration + mistWrap.custom.duration : baseDuration;
    const amp = isTalentEnabled(options, TALENTS.MIST_WRAP) ? baseAmp + mistWrap.custom.amp : baseAmp;

    target.buffs.envelopingMist.remaining = duration;
    target.buffs.envelopingMist.amp = amp;
    
    return target;
};

export const applyRenewingMistToTarget = (renewingMist: spell, target: AllyState, options: SimulationOptions) => {
    target.buffs.renewingMist.remaining = renewingMist.custom?.duration;
    target.buffs.renewingMist.amp = isTalentEnabled(options, TALENTS.CHI_HARMONY) ? TALENTS.CHI_HARMONY.custom.amp : 1;

    return target;
};

export const applyRapidDiffusionRenewingMist = (allies: AllyState[], options: SimulationOptions, renewingMistHealing: number) => {
    const target = getRandomAlly(allies);

    const renewingMist = SPELLS.RENEWING_MIST;
    const rapidDiffusion = TALENTS.RAPID_DIFFUSION;
    const chiHarmony = TALENTS.CHI_HARMONY;

    const rapidDiffusionHealing = (renewingMistHealing  / renewingMist.custom.duration ) * rapidDiffusion.custom.duration;

    target.buffs.renewingMist.remaining = rapidDiffusion.custom.duration;
    target.buffs.renewingMist.amp = isTalentEnabled(options, TALENTS.CHI_HARMONY) ? chiHarmony.custom.amp : 1;

    const amplifiedHealing = calculateHealingWithAmp(rapidDiffusionHealing, target);
    
    return { target, healing: amplifiedHealing };
};

export const applyEnvelopingBreath = (allies: AllyState[], options: SimulationOptions) => {
    const celestialHarmony = TALENTS.CELESTIAL_HARMONY;
    const mistWrap = TALENTS.MIST_WRAP;
    
    const maxTargets = celestialHarmony.custom.envelopingBreathTargets;
    const baseDuration = celestialHarmony.custom.envelopingBreathDuration;
    const baseAmp = celestialHarmony.custom.envelopingBreathAmp;

    const duration = isTalentEnabled(options, TALENTS.MIST_WRAP) ? baseDuration + mistWrap.custom.duration : baseDuration;
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

    const calcWithStats = (spellpower: number) => {
        // law of large numbers lets us directly multiply by the percentage of crit
        const critMultiplier = (1 + (options.crit / 100));
        const versMultiplier = (1 + (options.versatility / 100));
        return spellpower * options.intellect * critMultiplier * versMultiplier;
    };

    const baseIntellect = CLASSES.MONK.SPECS.MISTWEAVER.intellect;

    const fastFeet = isTalentEnabled(options, SHARED.FAST_FEET);
    const fastFeetRSK = 1 + (fastFeet ? SHARED.FAST_FEET.custom.risingSunKickIncrease : 0);
    const fastFeetSCK = 1 + (fastFeet ? SHARED.FAST_FEET.custom.spinningCraneKickIncrease : 0);

    const ferocityOfXuenMulti = 1 + (isTalentEnabled(options, SHARED.FEROCITY_OF_XUEN) ? SHARED.FEROCITY_OF_XUEN.custom.damageIncrease : 0);

    const chiProficiency = isTalentEnabled(options, SHARED.CHI_PROFICIENCY);
    const chiProficiencyDamage = 1 + (chiProficiency ? SHARED.CHI_PROFICIENCY.custom.magicDamageIncrease : 0);
    const chiProficiencyHealing = 1 + (chiProficiency ? SHARED.CHI_PROFICIENCY.custom.healingDoneIncrease : 0);
    
    const martialInstincts = isTalentEnabled(options, SHARED.MARTIAL_INSTINCTS);
    const martialInstinctsMulti = (1 + (martialInstincts ? SHARED.MARTIAL_INSTINCTS.custom.damageIncrease : 0));
    
    const jadeBond = TALENTS.JADE_BOND;
    const jadeBondOpt = isTalentEnabled(options, TALENTS.JADE_BOND);
    const chijiDuration = jadeBondOpt ? jadeBond.custom.duration : SPELLS.CHI_JI.custom.duration;
    let chiJiActive = false;
    let chiJiTimeRemaining = 0;

    const ancientTeachings = TALENTS.ANCIENT_TEACHINGS;
    const jadefireTeachings = TALENTS.JADEFIRE_TEACHINGS;
    const ancientTeachingsTransfer = isTalentEnabled(options, TALENTS.JADEFIRE_TEACHINGS) ? ancientTeachings.custom.transferRate + jadefireTeachings.custom.transferRate : ancientTeachings.custom.transferRate;
    const ancientTeachingsArmorModifier = ancientTeachings.custom.armorModifier;
    
    const wayOfTheCrane = TALENTS.WAY_OF_THE_CRANE;
    const wayOfTheCraneOpt = isTalentEnabled(options, TALENTS.WAY_OF_THE_CRANE);
    const wayOfTheCraneTransfer = wayOfTheCrane.custom.transferRate;
    const wayOfTheCraneTargetsPerSCK = wayOfTheCrane.custom.targetsPerSCK;
    const wayOfTheCraneArmorModifier = wayOfTheCrane.custom.armorModifier;
    const wayOfTheCraneTigerPalmHits = wayOfTheCraneOpt ? wayOfTheCrane.custom.tigerPalmHits : 1;

    const craneStyle = TALENTS.CRANE_STYLE;
    const craneStyleOpt = isTalentEnabled(options, TALENTS.CRANE_STYLE);
    const craneStyleRisingSunKickGOM = craneStyle.custom.risingSunKickGOM;
    const craneStyleBlackoutKickGOM = craneStyle.custom.blackoutKickGOM;
    const craneStyleSpinningCraneKickGOM = craneStyle.custom.spinningCraneKickGOM;
    const craneStyleGOMChance = craneStyle.custom.gomChance;

    const teachingsOfTheMonastery = TALENTS.TEACHINGS_OF_THE_MONASTERY;
    const totmMaxStacks = teachingsOfTheMonastery.custom.maxStacks;

    const gomSpellpower = options.mastery * 1.05; // 5% is from effect #1 of mw core passive
    const gustOfMistSpellpower = gomSpellpower / 100;
    const gustOfMistHealing = calcWithStats(gustOfMistSpellpower) * chiProficiencyHealing;

    const chijiGustHealing = gustOfMistHealing * ( 1 + (jadeBondOpt ? TALENTS.JADE_BOND.custom.gustIncrease : 0));
    const celestialHarmony = TALENTS.CELESTIAL_HARMONY;
    const celestialHarmonyChiCocoonAmount = celestialHarmony.custom.chiCocoonFormula(options.totalHp, options.versatility / 100);
    const celestialHarmonyChiCocoonMaxTargets = celestialHarmony.custom.chiCocoonTargets;

    const rapidDiffusionOpt = isTalentEnabled(options, TALENTS.RAPID_DIFFUSION);

    const allies: AllyState[] = Array.from({ length: options.allyCount }, (_, i) => createAllyState(i));

    const healingBySpell: { [key: string]: { healing: number; sources: any; count: number } } = {};

    const calculateDamage = (spellObj: spell): number => {
        const baseDamage = spellObj.value?.damage || 0;
        const spellpower = baseDamage / baseIntellect;
        let damage = calcWithStats(spellpower) * ferocityOfXuenMulti;
        if (spellObj.school === SCHOOLS.NATURE) {
            damage *= chiProficiencyDamage;
        } 
        else if (spellObj.school === SCHOOLS.PHYSICAL) {
            damage *= martialInstinctsMulti;
        }

        switch (spellObj.id) {
            case SPELLS.RISING_SUN_KICK.id:
                damage *= fastFeetRSK;
                break;
            case SPELLS.SPINNING_CRANE_KICK.id:
                damage *= fastFeetSCK;
                break;
            default:
                break;
        }
        return damage;
    };

    const calculateHealing = (spellObj: spell): number => {
        const baseHealing = spellObj.value?.healing || 0;
        const spellpower = baseHealing / baseIntellect;
        let healing = calcWithStats(spellpower);
        if (spellObj.school === SCHOOLS.NATURE) {
            healing *= chiProficiencyHealing;
        }
        return healing;
    };

    const calculateRenewingMistHealing = (spellObj: spell): number => {
        const renewingMistBaseHealing = calculateHealing(spellObj);
        const renewingMistBaseHPS = renewingMistBaseHealing / SPELLS.RENEWING_MIST.custom.duration;
        return renewingMistBaseHPS * spellObj.custom?.duration;
    };

    const calculateSpellHealingBreakdown = (spellObj: spell, totmStacks: number, allies: AllyState[], chiJiActive: boolean) => {
        const breakdown = {
            baseHealing: 0,
            chiJiGusts: 0,
            ancientTeachings: 0,
            wayOfTheCrane: 0,
            gustOfMists: 0,
            envelopingMistAmp: 0,
            chiCocoons: 0,
            envelopingBreath: 0,
            rapidDiffusion: 0,
        };

        let renewingMistHealing = 0;

        switch (spellObj.id) {
            case SPELLS.CHI_JI.id:
                if (isTalentEnabled(options, TALENTS.CELESTIAL_HARMONY)) {
                    breakdown.chiCocoons = celestialHarmonyChiCocoonAmount * Math.min(celestialHarmonyChiCocoonMaxTargets, allies.length);
                }
                break;

            case SPELLS.TIGER_PALM.id:
                const tigerPalmDamage = calculateDamage(spellObj);
                const tigerPalmHits = wayOfTheCraneTigerPalmHits;
                const tigerPalmATHealing = tigerPalmDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * tigerPalmHits;
                breakdown.ancientTeachings = distributeAncientTeachings(allies, tigerPalmATHealing);
                break;
            
            case SPELLS.RISING_SUN_KICK.id:
                const rskDamage = calculateDamage(spellObj);
                const rskATHealing = rskDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier;
                breakdown.ancientTeachings = distributeAncientTeachings(allies, rskATHealing);
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = distributeGusts(allies, 6, chijiGustHealing);
                }

                if (craneStyleOpt) {
                    const rskGOMTarget = getRandomAlly(allies);
                    const rskgustOfMistHealing = gustOfMistHealing * craneStyleRisingSunKickGOM;
                    breakdown.gustOfMists = calculateHealingWithAmp(rskgustOfMistHealing, rskGOMTarget);
                }

                if (rapidDiffusionOpt) {
                    renewingMistHealing = calculateRenewingMistHealing(SPELLS.RENEWING_MIST);
                    const rdRemHealing = applyRapidDiffusionRenewingMist(allies, options, renewingMistHealing);
                    renewingMistHealing = rdRemHealing.healing;
                }
                
                break;
            
            case SPELLS.BLACKOUT_KICK.id:
                const bokDamage = calculateDamage(spellObj);
                const bokHits = 1 + totmStacks;
                let bokATHealing = bokDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * bokHits;
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = distributeGusts(allies, 6 * bokHits, chijiGustHealing);
                }

                if (wayOfTheCraneOpt) {
                    const bokEffectiveness = wayOfTheCrane.custom.blackoutKickEffectiveness;
                    const bokMaxAdditionalHits = wayOfTheCrane.custom.blackoutKickHits;
                    const wayOfTheCraneBokHits = Math.min(options.enemyCount - 1, bokMaxAdditionalHits);
                    
                    if (wayOfTheCraneBokHits > 0) {
                        const wayOfTheCraneBokDamage = bokDamage * bokEffectiveness;
                        bokATHealing += wayOfTheCraneBokDamage * ancientTeachingsTransfer * ancientTeachingsArmorModifier * wayOfTheCraneBokHits * bokHits;
                    }
                }
                
                breakdown.ancientTeachings = distributeAncientTeachings(allies, bokATHealing);

                if (craneStyleOpt) {
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
                const sckDamage = calculateDamage(spellObj);
                const sckTargetMultiplier = options.enemyCount <= 5 
                    ? options.enemyCount
                    : options.enemyCount * Math.sqrt(5 / options.enemyCount);

                const sckTicks = 4;
                const sckPartDamage = (sckDamage * sckTargetMultiplier * wayOfTheCraneTransfer * wayOfTheCraneArmorModifier) / sckTicks;
                
                let sckAJTotalHealing = 0;
                for (let i = 0; i < sckTicks; i++) {
                    const targets = getRandomAllies(allies, wayOfTheCraneTargetsPerSCK);
                    for (const target of targets) {
                        const sckHealing = calculateHealingWithAmp(sckPartDamage, target);
                        sckAJTotalHealing += sckHealing;
                    }
                }
                breakdown.wayOfTheCrane = sckAJTotalHealing;
                
                if (chiJiActive) {
                    breakdown.chiJiGusts = chijiGustHealing * 6;
                }

                if (craneStyleOpt) {
                    if (Math.random() < craneStyleGOMChance) {
                        const sckGomTarget = getRandomAlly(allies);
                        const sckGOMHealing = gustOfMistHealing * craneStyleSpinningCraneKickGOM;
                        breakdown.gustOfMists = calculateHealingWithAmp(sckGOMHealing, sckGomTarget);
                    }
                }
                
                break;
            
            case SPELLS.ENVELOPING_MIST.id:
                const envTarget = applyEnvelopingMist(allies, options);
                const envBaseHealing = calculateHealing(spellObj);
                breakdown.baseHealing = calculateHealingWithAmp(envBaseHealing, envTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, envTarget);

                if (chiJiActive && isTalentEnabled(options, TALENTS.CELESTIAL_HARMONY)) {
                    const envBTargets = applyEnvelopingBreath(allies, options);
                    const envBHealing = celestialHarmony.custom.envelopingBreathHealing;
                    let envBTotalHealing = 0;
                    
                    envBTargets.forEach(target => {
                        envBTotalHealing += calculateHealingWithAmp(envBHealing, target);
                    });
                    
                    breakdown.envelopingBreath = envBTotalHealing;
                }

                if (rapidDiffusionOpt) {
                    renewingMistHealing = calculateRenewingMistHealing(SPELLS.RENEWING_MIST);
                    const rdRemHealing = applyRapidDiffusionRenewingMist(allies, options, renewingMistHealing);
                    renewingMistHealing = rdRemHealing.healing;
                }
                
                break;
            
            case SPELLS.VIVIFY.id:
                const vivifyTarget = getRandomAlly(allies);
                const vivifyBaseHealing = calculateHealing(spellObj);
                breakdown.baseHealing = calculateHealingWithAmp(vivifyBaseHealing, vivifyTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, vivifyTarget);
                break;
            case SPELLS.RENEWING_MIST.id:
                const renewingMistTarget = getRandomAlly(allies);
                applyRenewingMistToTarget(spellObj, renewingMistTarget, options);
                const renewingMistBaseHealing = calculateRenewingMistHealing(spellObj);
                breakdown.baseHealing = calculateHealingWithAmp(renewingMistBaseHealing, renewingMistTarget);

                breakdown.gustOfMists = calculateHealingWithAmp(gustOfMistHealing, renewingMistTarget);
                break;
            default:
                const defaultTarget = getRandomAlly(allies);
                const defaultBaseHealing = calculateHealing(spellObj);
                breakdown.baseHealing = calculateHealingWithAmp(defaultBaseHealing, defaultTarget);
        }

        const totalHealing = breakdown.baseHealing + breakdown.chiJiGusts + breakdown.ancientTeachings + 
                           breakdown.wayOfTheCrane + breakdown.gustOfMists + 
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
                chiJiTimeRemaining = chijiDuration;
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
                    const stacksGained = isTalentEnabled(options, TALENTS.WAY_OF_THE_CRANE) ? wayOfTheCraneTigerPalmHits : 1;
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