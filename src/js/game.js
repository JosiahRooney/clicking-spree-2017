/* global document:true requirejs:true */

requirejs([
  'handlebars/dist/handlebars.min',
  'units',
  'upgrades',
  'numeral.min',
  '_levels',
  '_sounds'
], (
  Handlebars,
  Units,
  Upgrades,
  Numeral,
  Levels,
  Sounds
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
      this.sounds = new Sounds();
      this.stats = {
        skillPoints: 0,
        ap: { level: 1, bonus: 1, increase: 1.6 },
        crit: { level: 1, bonus: 3, increase: 1.4 },
        recon: { level: 1, bonus: 1, increase: 1.45 }
      };
    }

    init() {
      // DOM nodes
      this.container = document.querySelector('.game');
      this.killsContainer = this.container.querySelector('.total-kills');
      this.kpsContainer = this.container.querySelector('.total-kps');
      this.kpcContainer = this.container.querySelector('.total-kpc');
      this.expBar = document.querySelector('.exp-bar-progress');
      this.levelElement = document.querySelector('.level span');
      this.totalExpCounter = document.querySelector('.total-exp');
      this.toLevelContainer = document.querySelector('.to-level');

      this.statContainers = {
        ap: {
          level: document.querySelector('.stat-ap-level'),
          bonus: document.querySelector('.stat-ap-bonus')
        },
        crit: {
          level: document.querySelector('.stat-crit-level'),
          bonus: document.querySelector('.stat-crit-bonus')
        },
        recon: {
          level: document.querySelector('.stat-recon-level'),
          bonus: document.querySelector('.stat-recon-bonus')
        }
      };

      this.unitContainers = {};
      for (let k = 0; k < this.units.unit.length; k += 1) {
        const unit = this.units.unit[k];
        this.unitContainers[unit.safeName] = {
          container: this.container.querySelector(`.unit__${unit.safeName}`),
          unit: this.units.unit[k]
        };
      }
      this.unitContainersArray = Object.entries(this.unitContainers);
      this.upgradeContainers = {};
      for (let n = 0; n < this.upgrades.upgrade.length; n += 1) {
        const upgrade = this.upgrades.upgrade[n];
        this.upgradeContainers[upgrade.safeName] = {
          container: this.container.querySelector(`.upgrade__${upgrade.safeName}`),
          upgrade: this.upgrades.upgrade[n]
        };
      }
      this.upgradeContainersArray = Object.entries(this.upgradeContainers);
      this.buttons = this.container.querySelectorAll('.unit__actions button');
      this.upgButtons = this.container.querySelectorAll('.upgrade__actions button');
      this.registerEventListeners();
      setInterval(() => {
        this.addKills(this.kps);
        this.gameLoop();
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
      this.exp += delta;
      this.totalExp += delta;
    }

    trackExp() {
      const nextLevel = this.levels[this.level + 1];
      this.toLevel = nextLevel.exp - this.exp;
      if (this.exp >= nextLevel.exp) {
        if (document.querySelector('#sound-toggle').checked) {
          this.sounds.play('level-up');
        }
        this.level += 1;
        this.exp = 0;
        this.kills += this.levels[this.level].exp * 0.03;
        this.stats.skillPoints += 1;
        document.querySelector('.skill-points').innerText = this.stats.skillPoints;
      }
    }

    levelSkill(skill) {
      if (this.stats.skillPoints > 0) {
        this.stats.skillPoints -= 1;
        this.stats[skill].level += 1;
        this.stats[skill].bonus = 1.3 * (this.stats[skill].level * this.stats[skill].increase);
        document.querySelector('.skill-points').innerText = this.stats.skillPoints;
        this.drawSkillsSection();
      }
      const btns = document.querySelectorAll('.skill-point');
      if (this.stats.skillPoints > 0) {
        btns.forEach(btn => btn.removeAttribute('disabled'));
      } else {
        btns.forEach(btn => btn.setAttribute('disabled', 'disabled'));
      }
    }

    drawSkillsSection() {
      const arr = ['ap', 'crit', 'recon'];
      for (let i = 0; i < arr.length; i += 1) {
        const container = this.statContainers[arr[i]];
        container.level.innerText = this.stats[arr[i]].level;
        container.bonus.innerText = Numeral(this.stats[arr[i]].bonus).format('0.[00]a');
      }
    }

    registerEventListeners() {
      this.container.addEventListener('click', (e) => {

        // Attack
        if (e.target.classList.contains('attack-button')) {
          let bonus = 0;

          if (this.upgrades.upgrade[0].isActive) {
            bonus += this.stats.ap.bonus * 1.05;
          }

          if (this.upgrades.upgrade[5].isActive) {
            bonus += this.kps * 0.03;
          }

          // bonus += 50; // testing only

          const roll = Math.random() * 100;
          if (this.stats.crit.bonus >= roll) {
            bonus += this.stats.ap.bonus * 5;
          }

          this.addKills(this.stats.ap.bonus + bonus);
          this.addExp(this.stats.recon.bonus + bonus);

          this.drawData();
          this.sounds.play('rifle4');
        }

        if (e.target.classList.contains('unit__actions-btn')) {
          const button = e.target;
          const unitId = Number.parseInt(button.dataset.unitid, 10);
          const unit = this.units.unit[unitId];

          if (this.kills >= unit.cost) {
            // can afford it
            if (unit.unitCost !== null) {
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

            // Play voice lines when recruiting units
            if (unit.id === 0) {
              this.sounds.play('yes-sir');
            }
            if (unit.id === 1) {
              this.sounds.play('rock-n-roll');
            }
            if (unit.id === 2) {
              this.sounds.play('mortar');
            }
            if (unit.id === 6) {
              this.sounds.play('bug-out');
            }
            if (unit.id === 7) {
              this.sounds.play('break-1-9');
            }
          }
          this.drawData();
        }

        if (e.target.classList.contains('skill-point')) {
          const { skill } = e.target.dataset;
          this.levelSkill(skill);
        }

        if (e.target.classList.contains('upgrade__actions-btn')) {
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
      this.kpcContainer.innerText = Numeral(this.kpc).format('0.0[0]a');
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
    }

    gameLoop() {
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
      if (kps > 1) {
        this.addExp(Math.floor(kps));
      }
      this.drawData();
      const btns = document.querySelectorAll('.skill-point');
      if (this.stats.skillPoints > 0) {
        btns.forEach(btn => btn.removeAttribute('disabled'));
      } else {
        btns.forEach(btn => btn.setAttribute('disabled', 'disabled'));
      }
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
