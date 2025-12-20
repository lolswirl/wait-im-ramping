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
    SAVE_THEM_ALL: {
        name: "Save Them All",
        id: 389579,
        icon: 'inv_weapon_hand_22',
    },
    DIFFUSE_MAGIC: {
        name: "Diffuse Magic",
        id: 1243287,
        icon: 'spell_monk_diffusemagic',
    },
    ELUSIVE_MISTS: {
        name: "Elusive Mists",
        id: 388681,
        icon: 'ability_monk_soothingmists',
    },
    CHI_WAVE: {
        name: "Chi Wave",
        id: 450391,
        icon: 'ability_monk_chiwave',
    }
} satisfies Record<string, spell>;

export default talents;
export { talents as SHARED_MONK_TALENTS };
