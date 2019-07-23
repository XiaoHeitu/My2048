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
export default class My2048 extends cc.Component {

    @property(cc.Node)
    mainPanle: cc.Node = null;
    
    @property(cc.Prefab)
    block:cc.Prefab=null;

    //@property
    //text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for(var r=1;r<=4;r++){
            for(var c=1;c<=4;c++){
                var b:cc.Node=cc.instantiate(this.block);
                b.name="Block"+r+c;
                b.parent=this.mainPanle;
            }
        }
    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallback, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this, true);

        this.newBlock();
    }

    moved:boolean=false;

    update (dt) {
             
    }

    startLocation:cc.Vec2=null;
    startID:number=null;
    onTouchStartCallback(event:cc.Event.EventTouch){
        this.startLocation= event.getLocation();
        this.startID=event.getID();
    }
    onTouchEndCallback(event:cc.Event.EventTouch){

        if(this.startID!=event.getID()){
            return;
        }

        //console.log("start:"+this.startLocation.x+","+this.startLocation.y);
        var end= event.getLocation();
        //console.log("end:"+end.x+","+end.y);
        //console.log("offest:",(end.x-this.startLocation.x)+","+(end.y-this.startLocation.y));

        var offestX= end.x-this.startLocation.x;
        var offestY= end.y-this.startLocation.y;

        console.log(offestX+","+offestY);
        if(Math.max(Math.abs(offestX),Math.abs(offestY))<50){
            return;
        }
        //左：-x，上：+y，右：+x，下：-y
        if(Math.abs(offestX) > Math.abs(offestY)){
            //左右
            if(offestX<0){
                //左
                this.left();
            }
            else{
                //右
                this.right();
            }
        }
        else{
            //上下
            if(offestY>0){
                //上
                this.up();
            }
            else{
                //下
                this.down();
            }
        }
        if(!this.moved){
            return;
        } 
        this.newBlock(); 
        this.moved=false;          
        this.prevHCBlock=null;
        
        if(this.checkLose()){
            alert("哇哈哈哈，你输了！！！");
        }
    }

    //curNum=2;

    left(){
        console.log("左");
        //this.curNum =this.curNum+this.curNum;
        //this.mainPanle.getChildByName("Block11").children[0].getComponent(cc.Label).string=this.curNum.toString();
        //this.mainPanle.getChildByName("Block14").children[0].getComponent(cc.Label).string="";

        for(var r=1;r<=4;r++){
            for(var c=2;c<=4;c++)
            {   
                //console.log(i+","+j);
                var block=this.getBlockNode(r,c);
                
                var value =this.getBlockValue(block);
                if(value!=null){
                this.leftBlock(block);
                console.log(value);
                }
            }
        }
    }
    right(){
        console.log("右");
        //this.curNum =this.curNum+this.curNum;
        //this.mainPanle.getChildByName("Block14").children[0].getComponent(cc.Label).string=this.curNum.toString();
        //this.mainPanle.getChildByName("Block11").children[0].getComponent(cc.Label).string="";
        for(var r=1;r<=4;r++){
            for(var c=3;c>=1;c--)
            {   
                //console.log(i+","+j);
                var block=this.getBlockNode(r,c);
                
                var value =this.getBlockValue(block);
                if(value!=null){
                this.rightBlock(block);
                }
            }
        }
    }
    up(){
        console.log("上");
        //this.node.getChildByName("Block11").children[0].getComponent(cc.Label).string="2";
        for(var c=1;c<=4;c++){
            for(var r=2;r<=4;r++)
            {   
                //console.log(i+","+j);
                var block=this.getBlockNode(r,c);
                
                var value =this.getBlockValue(block);
                if(value!=null){
                this.upBlock(block);
                }
            }
        }
    }
    down(){
        console.log("下");
        //this.node.getChildByName("Block11").children[0].getComponent(cc.Label).string="2";

        for(var c=1;c<=4;c++){
            for(var r=3;r>=1;r--)
            {   
                //console.log(i+","+j);
                var block=this.getBlockNode(r,c);
                
                var value =this.getBlockValue(block);
                if(value!=null){
                this.downBlock(block);
                }
            }
        }
    }

    getBlockNode(rowindex:number,columnindex:number):cc.Node{
        //console.log("Block"+rowindex+columnindex);
        return this.mainPanle.getChildByName("Block"+rowindex+columnindex);
    }

    getBlockRowIndex(block:cc.Node):number{
        if(!block.name.startsWith("Block")){
            return null;
        }

        return Number.parseInt(block.name.substr(5,1));
    }

    getBlockColumnIndex(block:cc.Node):number{

        if(!block.name.startsWith("Block")){
            return null;
        }

        return Number.parseInt(block.name.substr(6,1));
    }

    moveBlock(block:cc.Node,rowindex:number,columnindex:number){
        if(!block.name.startsWith("Block")){
            return;
        }

        var cval= this.getBlockValue(block);
        var targetBlock=this.getBlockNode(rowindex,columnindex);
        var tval=this.getBlockValue(targetBlock);
        //console.log(targetBlock);
        if(tval==cval){            
            this.setBlockValue(targetBlock,cval+tval);
        }
        else{           
            this.setBlockValue(targetBlock,cval);
        }
        this.setBlockValue(block,null);
    }

    getBlockValue(block:cc.Node):number{
        var val=block.getChildByName("Content").getComponent(cc.Label).string;
        //console.log(block.name+val);
        if(val==null || val==""){
            return null;
        }
        return Number.parseInt(val);
    }
    setBlockValue(block:cc.Node,value:number){
        //console.log(value);
        var val=""
        if(value!=null){
            val=value.toString();
        }
        block.getChildByName("Content").getComponent(cc.Label).string=val;
    }

    prevHCBlock:cc.Node=null;

    leftBlock(block:cc.Node){
        var row=this.getBlockRowIndex(block);
        var tcol=this.getBlockColumnIndex(block)-1;
        while(tcol>=1){
            var targetBlock=this.getBlockNode(row,tcol);
            var tval=this.getBlockValue(targetBlock);
            var cval=this.getBlockValue(block);
            if(tval==null){
                this.moveBlock(block,row,tcol);   
                block=this.getBlockNode(row,tcol); 
                this.moved=true;            
            }
            else if(cval===tval && targetBlock!=this.prevHCBlock){                
                this.moveBlock(block,row,tcol);   
                block=this.getBlockNode(row,tcol); 
                this.prevHCBlock=targetBlock;
                this.moved=true;          
                break;
            }
            else{
                break;
            }
            tcol--;
        }
    }

    rightBlock(block:cc.Node){
        var row=this.getBlockRowIndex(block);
        var tcol=this.getBlockColumnIndex(block)+1;
        while(tcol<=4){
            var targetBlock=this.getBlockNode(row,tcol);
            var tval=this.getBlockValue(targetBlock);
            var cval=this.getBlockValue(block);
            if(tval==null){
                this.moveBlock(block,row,tcol);   
                block=this.getBlockNode(row,tcol);  
                this.moved=true;                     
            }
            else if(cval===tval && targetBlock!=this.prevHCBlock){                
                this.moveBlock(block,row,tcol);   
                block=this.getBlockNode(row,tcol); 
                this.prevHCBlock=targetBlock;
                this.moved=true;          
                break;
            }
            else{
                break;
            }
            tcol++;
        }
    }

    upBlock(block:cc.Node){
        
        var col=this.getBlockColumnIndex(block);
        var trow=this.getBlockRowIndex(block)-1;
        while(trow>=1){
            var targetBlock=this.getBlockNode(trow,col);
            var tval=this.getBlockValue(targetBlock);
            var cval=this.getBlockValue(block);
            if(tval==null){
                this.moveBlock(block,trow,col);   
                block=this.getBlockNode(trow,col); 
                this.moved=true;                      
            }
            else if(cval===tval && targetBlock!=this.prevHCBlock){                
                this.moveBlock(block,trow,col);   
                block=this.getBlockNode(trow,col); 
                this.prevHCBlock=targetBlock;
                this.moved=true;          
                break;
            }
            else{
                break;
            }
            trow--;
        }        
    }
    downBlock(block:cc.Node){
        
        var col=this.getBlockColumnIndex(block);
        var trow=this.getBlockRowIndex(block)+1;
        while(trow<=4){
            var targetBlock=this.getBlockNode(trow,col);
            var tval=this.getBlockValue(targetBlock);
            var cval=this.getBlockValue(block);
            if(tval==null){
                this.moveBlock(block,trow,col);   
                block=this.getBlockNode(trow,col); 
                this.moved=true;                      
            }
            else if(cval===tval && targetBlock!=this.prevHCBlock){                
                this.moveBlock(block,trow,col);   
                block=this.getBlockNode(trow,col); 
                this.prevHCBlock=targetBlock;
                this.moved=true;          
                break;
            }
            else{
                break;
            }
            trow++;
        }
    }

    newBlock(){
        var nullBlock:cc.Node[]=new Array();
        
        
        for(var i=0;i< this.mainPanle.children.length;i++){
            var block=this.mainPanle.children[i];
            var val=this.getBlockValue(block);
            if(val==null){
                console.log(block.name);
                nullBlock.push(block);
            }
        }
        
        console.log(nullBlock.length);
        var index= this.getRandomInt(0,nullBlock.length-1)   ;
        var newBlock=nullBlock[index];
        console.log(newBlock.name);
        var newValue=Math.pow(2, this.getRandomInt(1,2));
        console.log(newValue);
        this.setBlockValue( newBlock,newValue);
    }

    getRandomInt(min:number,max:number):number{
        var r=Math.random();
        return Math.trunc( min+(r*(max+1-min)));
    }

    checkLose():boolean{
        var canmove=false;
        
        for(var i=0;i< this.mainPanle.children.length;i++){
            var block=this.mainPanle.children[i];
            var cval=this.getBlockValue(block);
            if(cval==null)
            {
                continue;
            }
            var crow=this.getBlockRowIndex(block);
            var ccolumn=this.getBlockColumnIndex(block);
            //判断上
            {            
                if(crow==1){
                    continue;
                }
                var trow=crow-1;
                var tcolumn=ccolumn;

                var tBlock=this.getBlockNode(trow,tcolumn);
                var tval=this.getBlockValue(tBlock);
                if(tval==null || tval==cval){
                    canmove=true;
                    break;
                }
            }
            //判断下
            {            
                if(crow==4){
                    continue;
                }
                var trow=crow+1;
                var tcolumn=ccolumn;

                var tBlock=this.getBlockNode(trow,tcolumn);
                var tval=this.getBlockValue(tBlock);
                if(tval==null || tval==cval){
                    canmove=true;
                    break;
                }
            }
            //判断左        
            {            
                if(ccolumn==1){
                    continue;
                }
                var trow=crow;
                var tcolumn=ccolumn-1;

                var tBlock=this.getBlockNode(trow,tcolumn);
                var tval=this.getBlockValue(tBlock);
                if(tval==null || tval==cval){
                    canmove=true;
                    break;
                }
            }
            //判断右        
            {            
                if(ccolumn==4){
                    continue;
                }
                var trow=crow;
                var tcolumn=ccolumn+1;

                var tBlock=this.getBlockNode(trow,tcolumn);
                var tval=this.getBlockValue(tBlock);
                if(tval==null || tval==cval){
                    canmove=true;
                    break;
                }
            }
        }
        return !canmove;
    }
}
