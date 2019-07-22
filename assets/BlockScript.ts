// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockScript extends cc.Component {

    //@property(cc.Label)
    //label: cc.Label = null;

    //@property
    //text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {    }

    //start () {    }
    blockDafultColor:cc.Color=new cc.Color(78,78,78,255);
    blockMaxNum=Math.pow(2,12);

    update (dt) {

       var content= this.node.children[0];
       var label= content.getComponent(cc.Label);
       if(label==null || label.string==null || label.string=="") {
          this.node.color=this.blockDafultColor;
          //console.log("blockDafultColor");
          return;
       }   
       var num:number= Number.parseInt(label.string); 
       if(num==0){        
        this.node.color=this.blockDafultColor;
        //console.log("blockDafultColor");
        return;
       }
       
       var green= this.getGreen(num) 
       //console.log("255,"+green+",0,255");
       this.node.color=new cc.Color(255,green,0,255);  
       
    }
    getGreen(num:number):number{
        
        //console.log(15-Math.log2(num));
        if(num>=this.blockMaxNum){
            return 0;
        }
       return 255 * ((12-(Math.log2(num))/12))  
    }
}
