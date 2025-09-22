import spell from '@data/spells/spell';

const tier = {
    T34_LIGHTSMITH_2SET: {
        name: "Lightsmith 2-Set",
        id: 1236389,
        icon: 'inv_plate_raidpaladinethereal_d_01_glove',
    },
    T34_LIGHTSMITH_4SET: {
        name: "Lightsmith 4-Set",
        id: 1236390,
        icon: 'inv_plate_raidpaladinethereal_d_01_helm',
    },
    
} satisfies Record<string, spell>;

export default tier;
export { tier as TIER };