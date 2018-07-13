/**
 * Created by 连军保 on 2018/7/12.
 */
var roottool = function(){
    this.vesion = "1.0";
    this.editor = "连俊保";
};

roottool.prototype.Extend = function(Parent,Child){
    var F = function(){};
    F.prototype = Parent.prototype;

    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
};

roottool.prototype.extendCopy = function(Parent,Child){
    var Child =  Child || {};
    for(var i in Parent){
        Child[i] = Parent[i];
    }
    return Child;
};

roottool.prototype.deepCopy = function(Parent,Child){
    var Child = Child || {};
    for(var i in Parent){
       if(typeof Parent[i].prototype === 'objcet'){
           Child[i] = (Parent.constructor === Array)?[]:{};
           this.deepCopy(Parent[i],Child[i]);
       } else{
           Child[i] = Parent[i];
       }
    }
    return Child;
};

var RootTool = new roottool();