import Phaser from 'phaser';
import './styles/base.css';
import './styles/game.css';
import './styles/overlays.css';
import { MemoryStage } from './scene/MemoryStage';
import { AppController } from './ui/AppController';
import { mountAppShell } from './ui/template';

const root = document.getElementById('app');
if (!root) throw new Error('App root was not found.');

mountAppShell(root);

const stage = new MemoryStage();
new Phaser.Game({
  type: Phaser.AUTO,
  width: 960,
  height: 720,
  parent: 'game-canvas',
  backgroundColor: '#163f36',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scene: stage,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
});

await stage.ready;
new AppController(stage);
