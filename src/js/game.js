/* global document:true requirejs:true Howl:true */

requirejs([
  'handlebars/dist/handlebars.min',
  'units',
  'upgrades',
  'numeral.min',
  '_levels',
], (
  Handlebars,
  Units,
  Upgrades,
  Numeral,
  Levels,
) => {
  Handlebars.registerHelper('multiply', (a, b) => a * b);
  Handlebars.registerHelper('fromArray', (arr, index, key) => {
    if (key) {
      return arr[index][key];
    }
    return arr[index];
  });

  class Game {
    constructor() {
      this.units = new Units();
      this.upgrades = new Upgrades();
      this.kills = 0;
      this.kps = 0;
      this.kpc = 1;
      this.exp = 0;
      this.totalExp = 0;
      this.level = 1;
      this.levels = Levels;
      this.toLevel = 0;

      this.shotSounds = [
        { name: 'gunshot', url: './sound/sfx/guns/gunshot.wav' },
        { name: 'rifle', url: './sound/sfx/guns/rifle.wav' },
        { name: 'rifle2', url: './sound/sfx/guns/rifle2.wav' },
        { name: 'rifle3', url: './sound/sfx/guns/rifle3.wav' },
        { name: 'rifle4', url: './sound/sfx/guns/rifle4.wav' },
        { name: 'shotgun', url: './sound/sfx/guns/shotgun.wav' },
        { name: 'shotgun2', url: './sound/sfx/guns/shotgun2.wav' },
      ];

      this.shotUrls = [];

      this.shotUrls.push(this.shotSounds[4]);

      for (let h = 0; h < this.shotUrls.length; h += 1) {
        this.shotUrls[h].audio = new Howl({
          src: [this.shotUrls[h].url],
        });
      }

      this.voiceSounds = [
        { name: 'yes-sir', url: './sound/sfx/voice/sir.wav' },
        { name: 'break-1-9', url: './sound/sfx/voice/break-1-9.wav' },
        { name: 'bug-out', url: './sound/sfx/voice/bug-out.wav' },
        { name: 'rock-n-roll', url: './sound/sfx/voice/rock-n-roll.wav' },
      ];

      this.yesSir = new Howl({
        src: [this.voiceSounds[0].url],
      });
      this.break19 = new Howl({
        src: [this.voiceSounds[1].url],
      });
      this.bugOut = new Howl({
        src: [this.voiceSounds[2].url],
      });
      this.rockNRoll = new Howl({
        src: [this.voiceSounds[3].url],
      });

      this.explosions = [
        { name: 'mortar', url: './sound/sfx/explosions/mortar.wav' },
      ];
      this.mortar = new Howl({
        src: [this.explosions[0].url],
      });
    }

    init() {
      // DOM nodes
      this.container = document.querySelector('.game');
      this.killsContainer = this.container.querySelector('.total-kills');
      this.kpsContainer = this.container.querySelector('.total-kps');
      this.expBar = document.querySelector('.exp-bar-progress');
      this.levelElement = document.querySelector('.level span');
      this.totalExpCounter = document.querySelector('.total-exp');
      this.toLevelContainer = document.querySelector('.to-level');
      this.unitContainers = {};
      for (let k = 0; k < this.units.unit.length; k += 1) {
        const unit = this.units.unit[k];
        this.unitContainers[unit.safeName] = {
          container: this.container.querySelector(`.unit__${unit.safeName}`),
          unit: this.units.unit[k],
        };
      }
      this.unitContainersArray = Object.entries(this.unitContainers);
      this.upgradeContainers = {};
      for (let n = 0; n < this.upgrades.upgrade.length; n += 1) {
        const upgrade = this.upgrades.upgrade[n];
        this.upgradeContainers[upgrade.safeName] = {
          container: this.container.querySelector(`.upgrade__${upgrade.safeName}`),
          upgrade: this.upgrades.upgrade[n],
        };
      }
      this.upgradeContainersArray = Object.entries(this.upgradeContainers);
      this.buttons = this.container.querySelectorAll('.unit__actions button');
      this.upgButtons = this.container.querySelectorAll('.upgrade__actions button');
      this.registerEventListeners();
      setInterval(() => {
        this.addKills(this.kps);
        this.drawData();
      }, 1000);
      this.unitContainers.recruit.container.classList.remove('hide');
      this.upgradeContainers.red_dot_sight.container.classList.remove('hide');
      this.expBar.value = this.exp;
      this.levelElement.innerText = `${this.level}`;
      this.expBar.max = this.levels[this.level + 1].exp;
    }

    addKills(delta) {
      this.kills += Math.ceil(delta * 10) / 10;
    }

    addExp(delta) {
      this.exp += Math.round(delta);
      this.totalExp += Math.round(delta);
    }

    trackExp() {
      const nextLevel = this.levels[this.level + 1];
      this.toLevel = nextLevel.exp - this.exp;
      if (this.exp >= nextLevel.exp) {
        this.level += 1;
        this.exp = 0;
      }
    }

    registerEventListeners() {
      this.container.addEventListener('click', (e) => {
        if (e.target.classList.contains('attack-button')) {
          let bonus = 0;

          if (this.upgrades.upgrade[0].isActive) {
            bonus = this.kpc * 1.05;
          }

          if (this.upgrades.upgrade[5].isActive) {
            bonus = this.kps * 0.03;
          }

          this.addKills(this.kpc + bonus);

          if (this.level < 99) {
            this.addExp(this.kpc + bonus);
          }

          this.drawData();
          if (document.querySelector('#sound-toggle').checked) {
            const index = Math.floor(Math.random() * this.shotUrls.length);
            this.shotUrls[index].audio.play();
          }
        }

        if (e.path[1].classList.contains('unit__actions')) {
          const button = e.target;
          const unitId = Number.parseInt(button.dataset.unitid, 10);
          const unit = this.units.unit[unitId];

          if (this.kills >= unit.cost) {
            // can afford it
            if (unit.unitCost != null) {
              const unitCost = this.units.unit[unit.unitCost.unit];
              if (unitCost.total >= unit.unitCost.cost) {
                // There are enough units to spare
                unitCost.total -= unit.unitCost.cost; // Subtract units from total
                this.kills -= unit.cost; // Subtract cost of kills from kills
                unit.total += 1; // Add one unit to total owned
                unit.cost = Math.ceil(unit.cost * unit.costIncr); // Increase the cost of the unit
                button.dataset.hideUntil = unit.cost;
              }
            } else {
              this.kills -= unit.cost;
              unit.total += 1;
              unit.cost = Math.ceil(unit.cost * unit.costIncr);
              button.dataset.hideUntil = unit.cost;
            }

            if (document.querySelector('#sound-toggle').checked) {
              // Play voice lines when recruiting units
              if (unit.id === 0) {
                this.yesSir.play();
              }
              if (unit.id === 1) {
                this.rockNRoll.play();
              }
              if (unit.id === 2) {
                this.mortar.play();
              }
              if (unit.id === 6) {
                this.break19.play();
              }
              if (unit.id === 7) {
                this.bugOut.play();
              }
            }
          }
          this.drawData();
        }

        if (e.path[1].classList.contains('upgrade__actions')) {
          const button = e.target;
          const upgradeId = Number.parseInt(button.dataset.upgradeid, 10);
          const upgrade = this.upgrades.upgrade[upgradeId];

          if (this.kills >= upgrade.cost && !button.classList.contains('purchased')) {
            this.kills -= upgrade.cost;
            upgrade.isActive = true;
            button.classList.add('purchased');
            button.classList.remove('btn-success');
            button.classList.add('disabled');
            this.drawData();
          }
        }
      });
    }

    drawData() {
      this.trackExp();
      this.killsContainer.innerText = Numeral(this.kills).format('0.0[0]a');
      this.kpsContainer.innerText = Numeral(this.kps).format('0.0[0]a');
      this.expBar.value = this.exp;
      this.levelElement.innerText = `${this.level}`;
      this.expBar.max = this.levels[this.level + 1].exp;
      this.totalExpCounter.innerText = Numeral(this.totalExp).format('0.[00]a');
      this.toLevelContainer.innerText = Numeral(this.toLevel).format('0.[00]a');

      for (let j = 0; j < this.buttons.length; j += 1) {
        if (this.kills >= Number.parseInt(this.buttons[j].dataset.hideUntil, 10)) {
          const unit = this.units.unit[this.buttons[j].dataset.unitid];
          if (unit.unitCost) {
            if (this.units.unit[unit.unitCost.unit].total >= unit.unitCost.cost) {
              this.buttons[j].classList.remove('disabled');
              this.buttons[j].classList.remove('hide');
            } else {
              this.buttons[j].classList.add('disabled');
            }
          } else {
            this.buttons[j].classList.remove('disabled');
            this.buttons[j].classList.remove('hide');
          }
        } else {
          this.buttons[j].classList.add('disabled');
        }
      }
      for (let m = 0; m < this.upgButtons.length; m += 1) {
        if (this.kills >= Number.parseInt(this.upgButtons[m].dataset.hideUntil, 10)) {
          if (!this.upgButtons[m].classList.contains('purchased')) {
            this.upgButtons[m].classList.remove('disabled');
            this.upgButtons[m].classList.remove('hide');
          }
        } else {
          this.upgButtons[m].classList.add('disabled');
        }
      }

      let kps = 0;
      for (let i = 0; i < this.unitContainersArray.length; i += 1) {
        const { container, unit } = this.unitContainersArray[i][1];

        container.querySelector(`.${unit.safeName}__cost`).innerText = unit.cost;
        container.querySelector(`.${unit.safeName}__total`).innerText = unit.total;
        kps += unit.total * ((Math.random() * (unit.kpsMax - unit.kpsMin)) + unit.kpsMin);

        if (this.kills >= container.dataset.hideUnitUntil) {
          container.classList.remove('hide');
        }
      }
      for (let o = 0; o < this.upgradeContainersArray.length; o += 1) {
        const { container, upgrade } = this.upgradeContainersArray[o][1];
        if (this.kills >= container.dataset.hideUpgradeUntil) {
          container.classList.remove('hide');
        }
        if (upgrade.isActive) {
          // custom logic per upgrade
          if (upgrade.id === 0 || upgrade.id === 1) {
            kps *= upgrade.delta;
          }
        }
      }
      this.kps = kps;
    }
  }

  const game = new Game();
  const source = document.querySelector('#units-template').innerHTML;
  const template = Handlebars.compile(source);
  const html = template(game);
  document.querySelector('.units').innerHTML = html;

  const upgSource = document.querySelector('#upgrades-template').innerHTML;
  const upgTemplate = Handlebars.compile(upgSource);
  const upgHtml = upgTemplate(game);
  document.querySelector('.upgrades').innerHTML = upgHtml;

  game.init();
});
