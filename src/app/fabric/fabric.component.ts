import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, Output } from '@angular/core';
// import { fabric } from 'fabric';
// import { write } from 'fs';
import 'fabric';
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';
import { log } from 'util';
declare const fabric: any;


@Component({
  selector: 'app-fabric',
  templateUrl: './fabric.component.html',
  styleUrls: ['./fabric.component.css']
})
export class FabricComponent implements OnInit, AfterViewInit {
  /** Template reference to the canvas element */
  // @ViewChild('canvasEl') canvasEl: ElementRef;
  private canvas : any;
  private url : string = '';
  // private obj = null; 
  // objs = this.canvas.getObjects(), 
  private arrAll : any = [];
  private arrCircuit :  any = [];
  private arrLight : any = [];
  private arrPower : any = [];
  private grid : number = 50;
  private isDebugging: boolean = true;

  constructor() { }

  ngOnInit(){
    //this.canvas = new fabric.Canvas('canvas', { selection: false });
    this.addGridLines();
    this.addCircuit( 0, 0 );
    this.addLight( 0, 50 );
    this.addPower( 0, 100 );

    this.canvas.on({
      'object:moving': (options) => {
        this.onObjectMoving(options);
      },
      'object:moved' : (options) => {
        this.onObjectMoved(options);
        console.log('object:moved');        
      },
      // 'object:scaling': this.onChange,
      // 'object:rotating': this.onChange,
      'event:drop': (e) => {
        console.log('event:drop');
      }
    });
  }

  ngAfterViewInit() {    
    //Do nothing
  }

  onObjectMoving(options){
    this.snapToGrid(options);
  }

  snapToGrid(options){

    //Snap to grid
    options.target.setCoords();
    this.canvas.forEachObject((obj) => {
      if (obj === options.target) return; //object and target are the same
      //There are a lot of objects on the canvas, we only care about intersects with these types tho, k?
      if (obj.name == 'circuit' || obj.name == 'light' || obj.name == 'power'){
        obj.set('opacity' ,options.target.intersectsWithObject(obj) ? 0.5 : 1);    
        if (this.isDebugging && options.target.intersectsWithObject(obj)) console.log('Intersects => target: ' + options.target.name + ' obj: ' + obj.name);
      }
    }); 
    options.target.set({
      left: Math.round(options.target.left / this.grid) * this.grid,
      top: Math.round(options.target.top / this.grid) * this.grid
    });         
  }

  onObjectMoved(options){
    this.removeFromCanvas(options);
    this.addToCanvas(options);
    this.validateRequired();
    this.validateCircuitComplete();
  }


  removeFromCanvas(options){
    //foreach canvas if obj <> target and obj pos == target pos then delete it
    this.canvas.forEachObject((obj) => {
      if (obj != options.target){
        if (obj.left == options.target.left && obj.top == options.target.top){
          this.canvas.remove(obj);

          //we're removing from canvas so remove from array
          for (var i = 0, icount = this.arrAll.length; i < icount; i++ ){
            if (obj == this.arrAll[i]){
              this.arrAll.splice(i, 1);
              console.log('Match All!');              
            }
          }
          if (obj.name == 'light'){
            for (var i = 0, icount = this.arrLight.length; i < icount; i++ ){
              if (obj == this.arrLight[i]){
                this.arrLight.splice(i, 1);
                console.log('Match Light!'); 
                return;         
              }
            }  
          } else if (obj.name == 'power'){
            for (var i = 0, icount = this.arrPower.length; i < icount; i++ ){
              if (obj == this.arrPower[i]){
                this.arrPower.splice(i, 1);
                console.log('Match Power!');
                return;           
              }
            }  
          } else if (obj.name == 'circuit'){
            for (var i = 0, icount = this.arrCircuit.length; i < icount; i++ ){
              if (obj == this.arrCircuit[i]){
                this.arrCircuit.splice(i, 1);
                console.log('Match Circuit!');              
                return;
              }
            }  
          }
        }
      }
    });
  }

  addToCanvas(options){
    
    if (options.target.name == 'circuit'){
      this.arrAll.push(options.target);
      this.arrCircuit.push(options.target);
      this.addCircuit( 0, 0 );
      if (this.isDebugging) console.log('name: ' + options.target.name + '/ top: ' + options.target.top + '/ left: ' + options.target.left);
    } else if (options.target.name == 'power'){
      this.arrAll.push(options.target);
      this.arrPower.push(options.target);
      this.addPower( 0, 100 );
      if (this.isDebugging) console.log('name: ' + options.target.name + '/ top: ' + options.target.top + '/ left: ' + options.target.left);
    } else if (options.target.name == 'light'){
      this.arrAll.push(options.target);
      this.arrLight.push(options.target);  
      this.addLight( 0, 50 );
      if (this.isDebugging) console.log('name: ' + options.target.name + '/ top: ' + options.target.top + '/ left: ' + options.target.left);
    }
  }

  validateRequired(){
    if (this.arrPower.length == 0){
      console.log('Missing power source');
      return;
    }
    if (this.arrLight.length == 0){
      console.log('Missing light source');      
      return;
    }
  }

  validateCircuitComplete(){
    //Do we have a power source?, Do we have a light bulb?
    let isCircuitComplete = true; 

    //Check the circuit for continuity
    for (var i = 0, icount = this.arrAll.length; i < icount; i++ ){
      let obj = this.arrAll[i];
      let connectionCount = 0;
      // console.log('obj1 name: ' + obj.name + '/ top: ' + obj.top + '/ left: ' + obj.left);

      for (var j = 0, jcount = this.arrAll.length; j < jcount; j++ ){
        let obj2 = this.arrAll[j];  
        if (((obj2.top == obj.top - this.grid || obj2.top == obj.top + this.grid) && obj2.left == obj.left) ||
          ((obj2.left == obj.left - this.grid || obj2.left == obj.left + this.grid) && obj2.top == obj.top)){
            connectionCount++;
            // console.log('obj2 name: ' + obj2.name + '/ top: ' + obj2.top + '/ left: ' + obj2.left);               
        }
      }

      //Circuit does not have continuity
      if (connectionCount < 2){
        isCircuitComplete = false;
        // console.log(connectionCount);              
      }//endif          
    }//endfor
    if (!isCircuitComplete){
      if (this.isDebugging) console.log('Circuit is open!');        
      return;
    }
    if (this.isDebugging) console.log('Circuit is complete!');

  }


  addGridLines()   {
    for (let i = 0; i < (600 / this.grid ); i++) {
      this.canvas.add(new fabric.Line([ i * this.grid, 0, i * this.grid, 600], { stroke: '#ccc', selectable: false }));
      this.canvas.add(new fabric.Line([ 0, i * this.grid, 600, i * this.grid], { stroke: '#ccc', selectable: false }))
    }
    // this.canvas.add(new fabric.Path([ 0, 0, 0, 0], { stroke: '#ccc', selectable: false }));

    // var path = new fabric.Path('M 0 0 L 200 100 L 170 200 z');
    // var path = new fabric.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
    // c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
    // 0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
    // c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
    // -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
    // 12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
    // -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z');
    // path.set({ left: 120, top: 120 });
    // path.set({ fill: 'white', stroke: 'green' });
    // this.canvas.add(path);

    // this.canvas.add(new fabric.Path('M100,250 C 150,100 150,150 150,250'));
  }

  addLight( rectLeft: number, rectTop: number ){
    this.addImg('../assets/light-bulb.png', 'light', rectLeft, rectTop);
  }

  addCircuit(rectLeft: number, rectTop: number){
    this.addRect('circuit', '#faa', rectLeft, rectTop);
  }

  addPower(rectLeft: number, rectTop: number){
    this.addRect('power', 'blue', rectLeft, rectTop);
  }

  addRect(rectName: string, rectFill: string, rectLeft: number, rectTop: number) {
    // add objects
    let rect = new fabric.Rect({ 
      left: rectLeft, 
      top: rectTop, 
      width: 50, 
      height: 50, 
      fill: rectFill, 
      originX: 'left', 
      originY: 'top',
      // centeredRotation: true,
      // lockRotation: true,
      // hasRotatingPoint: false,
      // hasControls: false,
      name: rectName
    }).scale(1);
    this.canvas.add(rect).renderAll();
  }

  addImg(url: string, imgName: string, imgLeft: number, imgTop: number){
    fabric.Image.fromURL(url, oImg =>{
      if (this.isDebugging) console.log(oImg.height);
      if (this.isDebugging) console.log(oImg.width);
      let imgA = oImg.set({
        top: imgTop,
        left: imgLeft,
        name: imgName,
        angle: 0
      }).scale(1);
      this.canvas.add(imgA).renderAll();
    });
  }

  // onChange(options){
  //   // this.canvas = new fabric.Canvas('canvas', { selection: false });
  //   //Snap to grid
  //   // options.target.setCoords();
  //   if (typeof this.canvas != 'undefined'){
  //     if (this.isDebugging) console.log(typeof this.canvas);
      

  //     this.canvas.forEachObject(function(obj) {
  //       if (obj === options.target) return;
  //       obj.set('opacity' ,options.target.intersectsWithObject(obj) ? 0.5 : 1);
  //     });  
  //   }

  //   // options.target.set({
  //   //   left: Math.round(options.target.left / grid) * grid,
  //   //   top: Math.round(options.target.top / grid) * grid
  //   // }); 
  // }
      

  //Snap to grid handler
  // addMovingEventHandler(){
  //   const grid = 50;
  //   this.canvas.on('object:moving', (options) => {     
  //     //Snap to grid
  //     options.target.set({
  //       left: Math.round(options.target.left / grid) * grid,
  //       top: Math.round(options.target.top / grid) * grid
  //     }); 
  //   });

  //   //Add collission detection

  // }

  // addMovedEventHandler(){
  //   this.canvas.on('object:moved', (options) => {
  //     //Evaluate
  //     // console.log(options.target.name);

  //     //Determine if target is new object or existing
      
  //     let obj = options.target;
  //     for (var i = 0, icount = this.arrAll.length; i < icount; i++ ){

  //       let obj2 = this.arrAll[i];
  //       if (obj == obj2){
  //       // if (obj.top == obj2.top && obj.left == obj2.left){

  //         //replace item in array
  //         // this.arrAll. [i] = obj;
  //         //remove item from canvas
  //         // this.canvas.remove(obj2);
  //       } 
  //     }//endfor

  //     if (obj.name == 'circuit'){
  //       this.arrAll.push(obj);
  //       this.arrCircuit.push(obj);
  //       if (this.isDebugging) console.log('name: ' + obj.name + '/ top: ' + obj.top + '/ left: ' + obj.left);
  //     } else if (obj.name == 'power'){
  //       this.arrAll.push(obj);
  //       this.arrPower.push(obj);
  //       if (this.isDebugging) console.log('name: ' + obj.name + '/ top: ' + obj.top + '/ left: ' + obj.left);
  //     } else if (obj.name == 'light'){
  //       this.arrAll.push(obj);
  //       this.arrLight.push(obj);  
  //       if (this.isDebugging) console.log('name: ' + obj.name + '/ top: ' + obj.top + '/ left: ' + obj.left);
  //     }

  //     //Do we have a power source?, Do we have a light bulb?
  //     let isCircuitComplete = false; 
  //     if (this.arrPower.length > 0 && this.arrLight.length > 0){
  //       isCircuitComplete = true;

  //       //Check the circuit for continuity
  //       for (var i = 0, icount = this.arrAll.length; i < icount; i++ ){
  //         let obj = this.arrAll[i];
  //         let connectionCount = 0;
  //         // console.log('obj1 name: ' + obj.name + '/ top: ' + obj.top + '/ left: ' + obj.left);

  //         for (var j = 0, jcount = this.arrAll.length; j < jcount; j++ ){
  //           let obj2 = this.arrAll[j];
  //           if (((obj2.top == obj.top - this.grid || obj2.top == obj.top + this.grid) && obj2.left == obj.left) ||
  //             ((obj2.left == obj.left - this.grid || obj2.left == obj.left + this.grid) && obj2.top == obj.top)){
  //               connectionCount++;
  //               // console.log('obj2 name: ' + obj2.name + '/ top: ' + obj2.top + '/ left: ' + obj2.left);               
  //           }
  //         }

  //         //Circuit does not have continuity
  //         if (connectionCount < 2){
  //           isCircuitComplete = false;
  //           // console.log(connectionCount);              
  //         }//endif          
  //       }//endfor
  //     }//endif power & light

  //     if (isCircuitComplete){
  //       if (this.isDebugging) console.log('Circuit is complete!');
        
  //     } else {
  //       if (this.isDebugging) console.log('Circuit is open!');        
  //     }

  //     //Starting with power check adjoining objects, must be 2
  //     //Next check light, must be 2
  //     //Check each object, if there are not 2 adjoining then discard

  //     if (options.target.name == 'circuit'){
  //       this.addCircuit( 0, 0 );
  //     } else if (options.target.name == 'power'){
  //       this.addPower( 0, 100 );
  //     } else if (options.target.name == 'light'){
  //       this.addLight( 0, 50 );
  //     }
  //   });
  // }
}
