define([], () => {
  class Upgrades {
    constructor() {
      this.upgrade = [
        {
          name: 'Red Dot Sight',
          safeName: 'red_dot_sight',
          id: 0,
          cost: 2000,
          description: 'This upgrade will replace the iron sights on your rifle, allowing greater accuracy and more kills per second with each click.',
          upgradeText: 'Kills per second bonus: +5%',
          delta: 1.05,
          affects: -1, // -1 means the player, otherwise id of unit
          isActive: false,
        },
        {
          name: 'M203 Launcher',
          safeName: 'm203_launcher',
          id: 1,
          cost: 19000,
          description: 'Attach an M203 40MM grenade launcher to the underside of your rifle. Splash damage results in greater enemy casualties.',
          upgradeText: 'Kills per second bonus: +15%',
          delta: 1.15,
          affects: -1,
          isActive: false,
        },
        {
          name: 'Better Drill Instructors',
          safeName: 'better_drill_instructors',
          id: 2,
          cost: 180500,
          description: 'Hire better drill instructors for boot camp, resulting in more efficient and effective recruits. Best of all they can aim better!',
          upgradeText: 'Recruit KPS: 1 - 3',
          delta: null,
          affects: 0,
          isActive: false,
        },
        {
          name: 'M39 EMR Upgrade',
          safeName: 'm39_emr_upgrade',
          id: 3,
          cost: 1714750,
          description: 'Replace the old M14 EBR designated marksman rifle with the newer M39 EMRs. Improves accuracy and range for Marksmen.',
          upgradeText: 'Marksman KPS bonus: +65%',
          delta: 1.65,
          affects: 1,
          isActive: false,
        },
        {
          name: 'Close Air Support',
          safeName: 'close_air_support',
          id: 4,
          cost: 16290125,
          description: 'Call in close air support. This upgrade has 20% chance to automatically earn 100,000 kills every 30 seconds.',
          upgradeText: '20% chance, 100,000 kills, 30sec cooldown.',
          delta: null,
          affects: -1,
          isActive: false,
        },
        {
          name: 'Double Tap',
          safeName: 'double_tap',
          id: 5,
          cost: 154756187,
          description: 'Upgrade your rifle to have a higher fire rate. Each click earns 3% of total Kills Per Second.',
          upgradeText: 'Earn 3% KPS per click',
          delta: null,
          affects: -1,
          isActive: false,
        },
      ];
    }
  }
  return Upgrades;
});
