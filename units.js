define([], () => {
  class Units {
    constructor() {
      this.unit = [
        {
          name: 'Recruit',
          safeName: 'recruit',
          id: 0,
          total: 0,
          description: 'A fresh boot right out of basic training. Sometimes hits the target. Recruit a lot of these. You\'ll need them later for more advanced units.',
          kpsMin: 0,
          kpsMax: 0.1,
          cost: 15,
          baseCost: 15,
          costIncr: 1.07,
          unitCost: null,
        },
        {
          name: 'Marksman',
          safeName: 'marksman',
          id: 1,
          total: 0,
          description: 'A more seasoned warrior with higher skills in weaponry. Can become special forces. Requires one recruit.',
          kpsMin: 0.5,
          kpsMax: 0.8,
          cost: 100,
          baseCost: 100,
          costIncr: 1.07,
          unitCost: {
            cost: 1,
            unit: 0,
          },
        },
        {
          name: 'Crew Weapon',
          safeName: 'crew_weapon',
          id: 2,
          total: 0,
          description: 'A crew served weapon requires multiple recruits in order to man it.',
          kpsMin: 4,
          kpsMax: 4,
          cost: 500,
          baseCost: 500,
          costIncr: 1.07,
          unitCost: {
            cost: 3,
            unit: 0,
          },
        },
        {
          name: 'Infantry Fighting Vehicle',
          safeName: 'infantry_fighting_vehicle',
          id: 3,
          total: 0,
          description: 'An armored infantry fighting vehicle. Crews 5 recruits. First vehicle available.',
          kpsMin: 10,
          kpsMax: 15,
          cost: 3000,
          baseCost: 3000,
          costIncr: 1.07,
          unitCost: {
            cost: 5,
            unit: 0,
          },
        },
        {
          name: 'Special Forces Operative',
          safeName: 'special_forces_operative',
          id: 4,
          total: 0,
          description: 'A deadly force on the battlefield. Expensive to train and outfit, but can stealthily engage many enemies without retaliation. Requires a Marksman',
          kpsMin: 40,
          kpsMax: 40,
          cost: 10000,
          baseCost: 10000,
          costIncr: 1.07,
          unitCost: {
            cost: 1,
            unit: 1,
          },
        },
        {
          name: 'Heavy Armor',
          safeName: 'heavy_armor',
          id: 5,
          total: 0,
          description: 'Main battle tank. The heavy muscle of any military. Crews 3 marksmen.',
          kpsMin: 100,
          kpsMax: 100,
          cost: 40000,
          baseCost: 40000,
          costIncr: 1.07,
          unitCost: {
            cost: 3,
            unit: 1,
          },
        },
        {
          name: 'F-15 Fighter Jet',
          safeName: 'f_15_fighter_jet',
          id: 6,
          total: 0,
          description: 'The F-15 is an air superiority fighter jet. It\'s fast, expensive, and deadly. It requires one well trained soldier to pilot it.',
          kpsMin: 400,
          kpsMax: 400,
          cost: 200000,
          baseCost: 200000,
          costIncr: 1.07,
          unitCost: {
            cost: 1,
            unit: 4,
          },
        },
        {
          name: 'B-1 Lancer Bomber',
          safeName: 'b_1_lancer_bomber',
          id: 7,
          total: 0,
          description: 'The B-1 Lancer is a four-engine supersonic variable-sweep wing, jet-powered strategic bomber. This powerful aircraft requires 4 specialists to crew it.',
          kpsMin: 6000,
          kpsMax: 8000,
          cost: 1600000,
          baseCost: 1600000,
          costIncr: 1.07,
          unitCost: {
            cost: 4,
            unit: 4,
          },
        },
      ];
    }
  }
  return Units;
});
