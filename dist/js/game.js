'use strict';

var _units = require('../../units');

var _units2 = _interopRequireDefault(_units);

var _upgrades = require('../../upgrades');

var _upgrades2 = _interopRequireDefault(_upgrades);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* global document:true */

var Game = function Game(container) {
  _classCallCheck(this, Game);

  this.units = new _units2.default();
  this.upgrades = new _upgrades2.default();
  this.kills = 0;
  this.kps = 0;

  // DOM nodes
  this.container = document.querySelector(container);
  this.killsContainer = this.container.querySelector('.total-kills');
  this.kpsContainer = this.container.querySelector('.total-kps');
  this.unitContainers = {
    recruit: this.container.querySelector('.unit__recruit'),
    marksman: this.container.querySelector('.unit__marksman'),
    crew_weapon: this.container.querySelector('.unit__crew_weapon'),
    infantry_fighting_vehicle: this.container.querySelector('.unit__infantry_fighting_vehicle'),
    special_forces_operative: this.container.querySelector('.unit__special_forces_operative'),
    heavy_armor: this.container.querySelector('.unit__heavy_armor'),
    f_15_fighter_jet: this.container.querySelector('.unit__f_15_fighter_jet'),
    b_1_lancer_bomber: this.container.querySelector('.unit__b_1_lancer_bomber')
  };
};

module.exports = Game;
//# sourceMappingURL=game.js.map
