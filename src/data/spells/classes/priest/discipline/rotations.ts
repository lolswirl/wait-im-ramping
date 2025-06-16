export const disciplinePriestRotations = [
  {
    name: "Voidweaver Uppies",
    spells: [
      "Power Word: Radiance", "Mind Blast", "Ultimate Penitence",
      "Void Blast", "Penance", "Void Blast"
    ]
  },
  {
    name: "Voidwrath",
    spells: [
      "Shadowfiend", "Power Word: Radiance", "Mind Blast", 
      "Penance", ...Array(4).fill("Void Blast"),
    ]
  },
  {
    name: "Premonition Penance",
    spells: [
      "Power Word: Radiance", "Mind Blast", "Premonition", ...Array(4).fill("Penance"),
    ]
  },
  {
    name: "Premonition Power Word: Shield",
    spells: [
      "Premonition", ...Array(3).fill("Power Word: Shield"), 
      "Power Word: Radiance", "Mind Blast", "Smite", "Smite", "Smite" 
    ]
  },
  {
    name: "Evangelism",
    spells: [
      "Power Word: Radiance", "Evangelism", "Shadowfiend", "Premonition",
      "Smite", "Premonition", "Penance", "Smite", "Penance", "Smite", "Penance"
    ]
  }
];