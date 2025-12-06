import spell from '@data/spells/spell';

const talents = {
    FAST_FEET: {
        name: "Fast Feet",
        id: 107428,
        icon: 'ability_monk_risingsunkick',
        custom: {
            risingSunKickIncrease: 0.7,
            spinningCraneKickIncrease: 0.1,
        },
    },
    CHI_PROFICIENCY: {
        name: "Chi Proficiency",
        id: 450426,
        icon: 'ability_monk_chiswirl',
        custom: {
            magicDamageIncrease: 0.04,
            healingDoneIncrease: 0.04,
        },
    },
    FEROCITY_OF_XUEN: {
        name: "Ferocity of Xuen",
        id: 388674,
        icon: 'ability_mount_pinktiger',
        custom: {
            damageIncrease: 0.02,
        }
    },
    MARTIAL_INSTINCTS: {
        name: "Martial Instincts",
        id: 450427,
        icon: 'ability_monk_palmstrike',
        custom: {
            damageIncrease: 0.04,
        }
    },
    STILLSTEP_COIL: {
        name: "Stillstep Coil",
        id: 1266733,
        icon: 'inv_helm_leather_raidmonkprogenitormythic_d_01',
    },
} satisfies Record<string, spell>;

export default talents;
export { talents as SHARED_MONK_TALENTS };
