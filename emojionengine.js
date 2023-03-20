import cursors from './emojiondb.js';
import './style.css';
class EmojionEngine {

    constructor() {
      //this.cursors = cursors
      this.cursorSize = '30px';
      this.lastAnimationFrame = null;
      this.cursorColor = 'black';
      this.cursorOffset = { x: -4, y: -6};
      this.emojionCursor = null;
      this.init();
    }
    
    init() {
    
      this.createEmojionCursor();
      this.addEventListeners();
    }
  



    createEmojionCursor() {
      
      this.emojionCursor = document.createElement('div');
      this.emojionCursor.id = "emojion-cursor";
      this.emojionCursor.classList.add('inactive');
      this.emojionCursor.innerHTML = cursors.pointer;
      document.body.appendChild(this.emojionCursor);
    }
  
    addEventListeners() {
      document.addEventListener('mousemove', (e) => {
        this.updateEmojionCursor(e);

      });
      
      document.addEventListener('mousedown', () => {
        if(this.emojionCursor.classList.contains("drag"))return;
          
        this.setEmojionCursor(cursors.pointer,["click"],[]);
      });
  
      document.addEventListener('mouseup', () => {
        if(this.emojionCursor.classList.contains("drag"))return;
        this.setEmojionCursor(cursors.pointer,[],["click"]);
      });
      
      document.querySelectorAll('.emojion-button').forEach((element) => {
        element.addEventListener('mouseover', () => {
          this.setEmojionCursor(cursors.pointer,["active"],["inactive"]);
        });
  
        element.addEventListener('mouseout', () => {
          this.setEmojionCursor(cursors.pointer,["inactive"],["active"]);
        });
      });

      document.querySelectorAll('.emojion-input').forEach((element) => {
        element.addEventListener('mouseover', () => {
            this.cursorOffset = { x: -4, y: -0};
            this.setEmojionCursor(cursors.editLine,["active"],["inactive"]);
            this.rotateEmojionCursor(90);
        });
  
        element.addEventListener('mouseout', () => {
            this.cursorOffset = { x: -4, y: -6};
          this.setEmojionCursor(cursors.pointer,["inactive"],["active"]);
          this.rotateEmojionCursor("reset");
        });
      });

    }

    updateEmojionCursor(e) {
        if (this.lastAnimationFrame) {
          window.cancelAnimationFrame(this.lastAnimationFrame);
        }
    
        this.lastAnimationFrame = window.requestAnimationFrame(() => {
          this.emojionCursor.style.left = `${e.clientX + this.cursorOffset.x}px`;
          this.emojionCursor.style.top = `${e.clientY + this.cursorOffset.y}px`;
          this.lastAnimationFrame = null;
        });
      }
    
    rotateEmojionCursor(rotation){
        this.emojionCursor.style.transform = 'rotate('+ rotation + 'deg)'
        if(rotation == "reset"){
            this.emojionCursor.style.transform = "";
        }
    }

    setEmojionCursor(emoji,add,remove) {
        this.emojionCursor.innerText = emoji;

        if (remove.length > 0) {
          this.emojionCursor.classList.remove(...remove);
        }
      
        if (add.length > 0) {
          this.emojionCursor.classList.add(...add);
        }
        //console.log('Emojion Engine: setEmojionCursor called with:', emoji, add, remove);
    }
    options(options){
        this.setSize(options.cursorSize);
        this.setColor(options.color);
    }

    setSize(size) {
        this.cursorSize = size;
        document.documentElement.style.setProperty('--cursor-size', size);
    }
    
    setColor(color) {
        this.cursorColor = color;
        this.emojionCursor.style.color = color;
    }
    



  }
  
export default EmojionEngine;