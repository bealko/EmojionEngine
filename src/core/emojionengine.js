import {skinColor, cursors} from '../constants/emojioncursors.js'
import '../style.css';

class EmojionEngine {

  constructor(options) {
    this.cursorSize = '30px';
    this.lastAnimationFrame = null;
    this.cursorColor = 'black';
    this.cursorOffset = { x: -4, y: -6};
    this.emojionCursor = null;
    this.emojionCursorItem = null;
    this.freezeX = false;
    this.freezeY = false;

    this.jiggle = 0;

    this.observer = null;
    this.skinColor = skinColor.noColor;
    this.observerConfig = {attributes: true};
    if(options != null){
      this.options(options);
    }

    this.init();
  }
  
  init() {
  
    this.createEmojionCursor();
    this.addEventListeners();
    this.createEmojionObserver();
    this.observer.observe(this.emojionCursor,this.observerConfig);

  }

  createEmojionCursor() {
    
    this.emojionCursor = document.createElement('div');
    this.emojionCursor.id = "emojion-cursor";

    this.emojionCursorItem = document.createElement('div');
    this.emojionCursorItem.id = "emojion-cursor-item";
    this.emojionCursorItem.classList.add('hidden');
    this.emojionCursorItem.innerHTML = cursors.key;

    this.emojionCursor.classList.add('inactive');
    this.emojionCursor.innerHTML = cursors.pointer + this.skinColor;
    document.body.appendChild(this.emojionCursor);
    
    document.body.appendChild(this.emojionCursorItem);

  }

  createEmojionObserver(){
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              const classList = mutation.target.classList;
              //setEmojionCursor(divElement, emoji, add, remove);
              this.changeEmojionCursor(classList);
              //console.log(mutation);
          }
      });
  });
  }


  addEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouseMove = e;
      this.updateEmojionCursor(e);

    });
    
    document.addEventListener('mousedown', () => {
      
      if(this.emojionCursor.classList.contains("drag")) return;
      if(this.emojionCursor.classList.contains("editing")) return;
      
      this.emojionCursorItem.classList.add("use");
      this.setEmojionCursor(["click"],[]);
    });

    document.addEventListener('mouseup', () => {
      if(this.emojionCursor.classList.contains("drag")) return;
      if(this.emojionCursor.classList.contains("editing")) return;
      this.emojionCursorItem.classList.remove("use");
      this.setEmojionCursor([],["click","active"]);
    });
    
    document.querySelectorAll('[type=button]:not(.lock)').forEach((element) => {
      element.addEventListener('mouseover', () => {
        this.setEmojionCursor(["active"],["inactive"]);
      });

      element.addEventListener('mouseout', () => {
        this.setEmojionCursor(["inactive"],["active"]);
      });
    });

    
    document.querySelectorAll('.lock').forEach((element) => {

      this.emojionCursorItem.classList.add("emojion-element");

      element.addEventListener('mouseover', () => {
        if(this.emojionCursor.classList.contains("click")) return;
        this.setEmojionCursor(["lock"],["inactive"]);
        this.rotateEmojionCursor(-90);
      });

      element.addEventListener('mouseout', () => {
        this.setEmojionCursor(["inactive"],["lock"]);
        this.rotateEmojionCursor("reset");
      });
    });


    
    document.querySelectorAll('[type=number],[type=text] ').forEach((element) => {

      this.emojionCursorItem.classList.add("emojion-element");

      element.addEventListener('mouseover', () => {
          if(this.emojionCursor.classList.contains("click")) return;
          this.cursorOffset = { x: -4, y: -0};
          this.setEmojionCursor(["active", "editing"],["inactive"]);
          this.rotateEmojionCursor(75);
      });

      element.addEventListener('mouseout', () => {
          //if(this.emojionCursor.classList.contains("click")) return;
          this.cursorOffset = { x: -4, y: -6};
          this.setEmojionCursor(["inactive"],["active","editing"]);
          this.rotateEmojionCursor("reset");
      });
    });

    document.querySelectorAll('[type=range]').forEach((element) => {

      this.emojionCursorItem.classList.add("emojion-element");

      element.addEventListener('mouseover', () => {
          if(this.emojionCursor.classList.contains("click")) return;
          this.cursorOffset = { x: -12, y: -12};
          this.setEmojionCursor(["active", "drag"],["inactive"]);
      });
      element.addEventListener('mousedown', () => {
          if(this.emojionCursor.classList.contains("click")) return;
          
          this.cursorOffset = { x: -4, y: -10};
          this.setEmojionCursor(["pinch"],["inactive","active"]);
          this.freezeX = true;
          this.rotateEmojionCursor(15);
      });
      element.addEventListener('mouseup', () => {
          //if(this.emojionCursor.classList.contains("click")) return;
          this.cursorOffset = { x: -4, y: -6};
          this.setEmojionCursor(["active", "drag"],["inactive","pinch"]);
          this.updateEmojionCursor(this.mouseMove,false,false);
          this.freezeX = false;
          this.rotateEmojionCursor("reset");
      });

      element.addEventListener('mouseout', () => {
          //if(this.emojionCursor.classList.contains("click")) return;
          this.cursorOffset = { x: -4, y: -6};
          this.setEmojionCursor(["inactive"],["active","pinch","drag","click"]);
          this.freezeX = false;
          this.rotateEmojionCursor("reset");
      });
    });
  }

  changeEmojionCursor(classList)
  {
    if(classList.contains("active")){
      this.emojionCursor.innerText = cursors.pointer + this.skinColor;
    }
    if(classList.contains("lock")){

      this.changeEmojionItem(cursors.key);
      this.emojionCursor.innerText = cursors.hold;
      this.showEmojionItem(true);
    }else{
      this.showEmojionItem(false);
    }
    if(classList.contains("inactive")){
      this.emojionCursor.innerText = cursors.pointer + this.skinColor;
    }
    if(classList.contains("drag")){
      this.emojionCursor.innerText = cursors.drag + this.skinColor;
    }
    if(classList.contains("editing")){
      this.emojionCursor.innerText = cursors.editLine + this.skinColor;
    }
    if(classList.contains("pinch") && classList.contains("drag")){
      this.emojionCursor.innerText = cursors.pinch + this.skinColor;
    }
    
  }

  changeEmojionItem(object){
    this.emojionCursorItem.innerHTML = object;
  }
  showEmojionItem(show){
    if(show){
      this.emojionCursorItem.classList.add("visible");
      this.emojionCursorItem.classList.remove("hidden");
    }else{
      this.emojionCursorItem.classList.add("hidden");
      this.emojionCursorItem.classList.remove("visible");
    }
    
  }


  updateEmojionCursor(e) {
      if (this.lastAnimationFrame) {
        window.cancelAnimationFrame(this.lastAnimationFrame);
      }
      this.lastAnimationFrame = window.requestAnimationFrame(() => {
        
        if( this.emojionCursorItem.classList.contains("visible")){
          this.emojionCursorItem.style.left = `${e.clientX + this.cursorOffset.x}px`;
          this.emojionCursorItem.style.top = `${e.clientY + this.cursorOffset.y}px`;
        }else {
          this.emojionCursorItem.style.left = 0;
        }

          if(!this.freezeY){
              this.emojionCursor.style.left = `${e.clientX + this.cursorOffset.x}px`;
              
          }
          
          if(!this.freezeX)
          {
              this.emojionCursor.style.top = `${e.clientY + this.cursorOffset.y}px`;
          }
        this.lastAnimationFrame = null;
      });
    }
  
  rotateEmojionCursor(rotation){
      this.emojionCursor.style.transform = 'rotate('+ rotation + 'deg)'
      if(rotation == "reset"){
          this.emojionCursor.style.transform = "";
      }
  }

  setEmojionCursor(add,remove) {
      if (remove.length > 0) {
        this.emojionCursor.classList.remove(...remove);
      }
      if (add.length > 0) {
        this.emojionCursor.classList.add(...add);
      }
  }
  options(options){
      if(options.cursorSize != null)this.setSize(options.cursorSize);
      if(options.color != null)this.setColor(options.color);
  }

  setSize(size) {
      this.cursorSize = size;
      document.documentElement.style.setProperty('--cursor-size', size);
  }
  
  setColor(color) {
      this.cursorColor = color;
     // this.emojionCursor.style.color = color;
  }
  

}

export default EmojionEngine;