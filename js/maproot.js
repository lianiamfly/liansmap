 /**
 * Created by 连军保 on 2018/7/12.
 */

 /*
 * 封装和集成方法实现
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

/*地图封装*/
var RootMap = function(){

};

RootMap.prototype.rootname = "地图类";

 //判断对象是否是一个数组
 RootMap.prototype.IsArray = function (obj) {
     return Object.prototype.toString.call(obj) === '[object Array]';
 };
 //获取指定范围的随机数
 RootMap.prototype.GetRandom = function (min, max) {
     var range = max - min;
     var random = Math.random();
     return (min + Math.round(range * random));
 };


 /*百度地图*/
 var BDMap = function(){
     this.locmap = {};
     this.setmap = function(map){
         this.locmap = map;
     };
     this.getmap = function(){
        return this.locmap;
     };

     //创建地图
     this.CreateMap = function(type,id,x,y,level,isEnableMapClick){
         isEnableMapClick = isEnableMapClick || true;
         id = id || "container";
         x = x || 112.532769;
         y = y || 37.862977;
         level = level || 10;
         // 创建Map实例
         this.locmap = new BMap.Map(id, { enableMapClick: isEnableMapClick });
         this.locmap.testid = id;
         var point = new BMap.Point(x,y);
         this.locmap.centerAndZoom(point, level);
         // 启用滚轮放大缩小
         this.locmap.enableScrollWheelZoom();

         if(type&&type==="simple"){
             this.AddScale(this.locmap);
             this.AddMapType(this.locmap);
             this.AddOverView(this.locmap);
             this.AddToolBar(this.locmap);
         }

         if(typeof(InitYeW) == "function")
         {
             InitYeW();
         }
         return this.locmap;
     };

     this.CreateMapWithIndoor = function(id,x,y,level){
         //室内图，百度地图没有
     };

     //设置的地图显示的语言：英文，中文和中英文
     this.SetMapLanguage = function(value,map){
         //百度地图没有设置语言功能
     };

     //添加比例尺控件
     this.AddScale = function(map){
         map = map || this.locmap;
         var scale = new BMap.ScaleControl();
         map.addControl(scale);
         return scale;
     };

     //添加导航条控件
     this.AddToolBar = function (map) {
         map = map || this.locmap;
         var toolbar = new BMap.NavigationControl({
             offset: new BMap.Size(0, 100),
             anchor: BMAP_ANCHOR_TOP_RIGHT
         });
         map.addControl(toolbar);
         return toolbar;
     };

     //添加鹰眼控件
     this.AddOverView = function (map) {
         map = map || this.locmap;
         var overview = new BMap.OverviewMapControl()
         map.addControl(overview);
         return overview;
     };
     //添加地图类型选择控件
     this.AddMapType = function(map){
         map = map || this.locmap;
         var maptype = new BMap.MapTypeControl({
             type: BMAP_MAPTYPE_CONTROL_DROPDOWN,
             mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP]
         });
         map.addControl(maptype);
         return maptype;
     };
     this.AddMapUIType =function(map,theme){

     };
     this.SetCurrentMap = function(map){
         if(map){
             this.locmap = map;
         }
     };
     /*-----------------------------------------地图基本方法------------------------------------------*/
     //设置中心点和缩放级别
     this.CenterAndZoom = function (x,y,level,map) {
         map = map || this.locmap;
         if(x&&y&&level){
             map.centerAndZoom(new BMap.Point(x,y),level);
         }
     };
     //将地图的中心点移到指定坐标
     this.PanToPoint = function(x,y,map){
         map = map || this.locmap;
         if(x&&y){
             map.panTo(new BMap.Point(x,y));
         }
     },
     //将地图的中心点偏移x,y个像素
     this.PanByPixel = function(offsetX,offsetY,map){
         map = map || this.locmap;
         if(offsetX&&offsetY){
             map.panBy(offsetX,offsetY);
         }
     };
     //获取当前地图的缩放级别
     this.GetZoom = function(map){
         map = map || this.locmap;
         return map.getZoom();
     };
     //获取当前地图的图层
     this.GetLayers = function(map){
         map = map || this.locmap;
         return map.getOverlays();
     };
     //获取当前中心点所在的城市信息
     this.GetCity = function(map){
         map = map || this.locmap;
         return map.getCenter();
     };
     //获取中心点城市信息回调函数
     this._getCityHandler = function(result){
         if(typeof getcityinfo === 'function'){
             getcityinfo(result);
         }
     };
     //获取当前地图的可视的边界对象
     this.GetBounds = function(map){
         map = map || this.locmap;
         return map.getBounds();
     };
     //获取当前地图的可视的边界的2个边界点坐标
     this.GetBoundsXY = function(map){
         map = map || this.locmap;
         var bounds = map.getBounds();
         return obj = {
             x1:bounds.getSouthWest().lng,
             y1:bounds.getSouthWest().lat,
             x2:bounds.getNorthEast().lng,
             y2:bounds.getNorthEast().lat
         }
     };
     this.SetZoom = function(value,map){
         map = map || this.locmap;
         if(value&&value>=3&&value<=18){
             map.setZoom(value);
         }
     };
     this.ZoomIn = function(map){
         map = map || this.locmap;
         map.zoomIn();
     };
     this.ZoomOut = function (map) {
         map = map || this.locmap;
         map.zoomOut();
     };
     //获取点击地图位置的坐标
     this.GetClickPosition = function(map){
         /*this.call(this.map)*/
         map = map || this.locmap;
         map.addEventListener("click",this._getClickPositionHandler);
     };
     //处理地图点击的回调
     //PS:这里要强调的是this不是GaoDMap对象而是地图对象,this代表map对象
     this._getClickPositionHandler = function(e){
         if (this.marker) {
             this.marker.setPosition(e.point);
         }else{
             this.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
             e.target.addOverlay(this.marker);

         }
         if(typeof getclickposition === 'function'){
             getclickposition(e);
         }
     };
     //添加缩放级别改变触发事件
     this.AddZoomChange = function(map){
         map = map || this.locmap;
         map.addEventListener("zoomend",this._ZoomChangeHandler);
     };
     //
     this._ZoomChangeHandler = function(e){
         var level = e.target.GetZoom();
         if(typeof zoomchangehandler === 'function'){
             zoomchangehandler(level);
         }
     };
     this.AddRightClick = function(map){
         map = map || this.locmap;
         map.addEventListener("rightclick",this._RightClickHandler);
     };
     this._RightClickHandler = function(e){
         if(typeof rightclickhandler === 'function'){
             rightclickhandler(e);
         }
     };
     this.AddMoveEnd = function(map){
         map = map || this.locmap;
         map.addEventListener("dragend",this._MoveEndHandler);
     };
     this._MoveEndHandler = function(e){
         if(typeof moveendhandler === 'function'){
             moveendhandler(e);
         }
     };
     this.OffEvent = function(eventstr,callback){
         map.removeEventListener(eventstr,callback);
     };
     //获取当前地图对象上所有的覆盖物
     this.GetAllOverlays = function(map){
         map = map || this.locmap;
         return map.getOverlays();
     };
     //设置限制显示的范围
     this.SetLimitBounds = function(x1,y1,x2,y2,map){
         map = map || this.locmap;
         if(x1&&y1&&x2&&y2){
             var b = new BMap.Bounds(new BMap.Point(x1, y1),new BMap.Point(x2, y2));
             try {
                 BMapLib.AreaRestriction.setBounds(map, b);
             } catch (e) {
                 alert(e);
             }
         }
     };
     this.SetMapStyle = function(value,map){
         map = map || this.locmap;
         if(value){
             map.setMapStyle(value);
         }
     };
     this.GetMapCenter = function (map) {
         map = map || this.locmap;
         return map.getCenter();
     };
     /*-----------------------------------------地图自定义控件------------------------------------------*/
         this.Custom = {
         MapShowXY:function(map){
             map = map || locmap;

         },
         //输入提示控件
         MapAutoComplete:{
             //添加控件功能
             AddControl:function(city,input,complete,error,select,choose){
                 city = city || '';
                 if(input){
                     AMap.plugin('AMap.Autocomplete',function(){//回调函数
                         //实例化Autocomplete
                         var autoOptions = {
                             city: "", //城市，默认全国
                             input:"input_id"//使用联想输入的input的id
                         };
                         var autocomplete= new AMap.Autocomplete(autoOptions);
                         //TODO: 使用autocomplete对象调用相关功能
                         autocomplete.on("complete",this._autoCompleteHandler,complete);
                         autocomplete.on("error",this._autoErrorHandler,error);
                         autocomplete.on("select",this._autoSelectHandler,select);
                         autocomplete.on("choose",this._autoChooseHandler,choose);
                     })
                 }else{
                     console.log("请传入需要显示自动提示功能的文本框id");
                 }
             },
             //自动完成查询成功后的回调函数
             _autoCompleteHandler:function(e){
                 if(typeof this === 'function'){
                     this(e);
                 }
             },
             //自动完成查询失败后的回调函数
             _autoErrorHandler:function(e){
                 if(typeof this === 'function'){
                     this(e);
                 }
             },
             //鼠标点击或者回车选中某个POI信息时触发此事件
             _autoSelectHandler:function(e){
                 if(typeof this === 'function'){
                     this(e);
                 }
             },
             //鼠标或者键盘上下键选择POI信息时触发此事件
             _autoChooseHandler:function(e){
                 if(typeof this === 'function'){
                     this(e);
                 }
             }
         },
         //测距工具
         MapMesure:{
             InitMesure:function(map){
                 map = map || locmap;
                 var mesure;
                 map.plugin(["AMap.RangingTool"],function(){
                     mesure = new AMap.RangingTool(map);
                     AMap.event.addListener(mesure, "end", function(e) {
                         mesure.turnOff();
                     });
                 });
                 return mesure;
             },
             OpenMesure:function (mesure) {
                 mesure.turnOn();
             },
             CloseMesure:function (mesure) {
                 mesure.turnOff();
             }
         },
         //拉框放大
         MapRectZoomIn:function(map,callback){
             map = map || locmap;
             var rectOptions = {
                 strokeStyle: "dashed",
                 strokeColor: "#FF33FF",
                 fillColor: "#FF99FF",
                 fillOpacity: 0.5,
                 strokeOpacity: 1,
                 strokeWeight: 2
             };
             map.plugin(["AMap.MouseTool"], function() {
                 var mouseTool = new AMap.MouseTool(map);
                 //通过rectOptions更改拉框放大时鼠标绘制的矩形框样式
                 mouseTool.on("draw",this._drawCompleteHandler,callback);
                 mouseTool.rectZoomIn(rectOptions);
             });
         },
         //拉框缩小
         MapRectZoomOut:function(map,callback){
             map = map || locmap;
             var rectOptions = {
                 strokeStyle: "dashed",
                 strokeColor: "#FF33FF",
                 fillColor: "#FF99FF",
                 fillOpacity: 0.5,
                 strokeOpacity: 1,
                 strokeWeight: 2
             };
             map.plugin(["AMap.MouseTool"], function() {
                 var mouseTool = new AMap.MouseTool(map);
                 mouseTool.on("draw",this._drawCompleteHandler,callback);
                 mouseTool.rectZoomOut(rectOptions);
             });
         },
         //拉框缩小
         MapMesureArea:function(map,callback){
             map = map || locmap;
             var rectOptions = {
                 strokeStyle: "dashed",
                 strokeColor: "#FF33FF",
                 fillColor: "#FF99FF",
                 fillOpacity: 0.5,
                 strokeOpacity: 1,
                 strokeWeight: 2
             };
             map.plugin(["AMap.MouseTool"], function() {
                 var mouseTool = new AMap.MouseTool(map);
                 //鼠标工具插件添加draw事件监听
                 AMap.event.addListener(mouseTool, "draw",this._drawCompleteHandler,callback);
                 mouseTool.measureArea(rectOptions);  //调用鼠标工具的面积量测功能
             });
         },
         _drawCompleteHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         EditCircle:function(map,circle,callback){
             map = map || locmap;
             map.plugin(["AMap.CircleEditor"],function(){
                 circleEditor = new AMap.CircleEditor(map,circle);
                 circleEditor.on("end",this._editcirclehandler,callback);
                 circleEditor.open();
             });
         },
         _editcirclehandler:function(e){
             if(typeof  this === 'function'){
                 this(e);
             }
         },
         EditPolyline:function(map,polyline,callback){
             map = map || locmap;
             //构造折线编辑对象，并开启折线的编辑状态
             map.plugin(["AMap.PolyEditor"],function(){
                 polylineEditor = new AMap.PolyEditor(map,polyline);
                 polylineEditor.on("end",this._editpolylinehandler,callback);
                 polylineEditor.open();
             });
         },
         _editpolylinehandler:function(e){
             if(typeof  this === 'function'){
                 this(e);
             }
         }

     };
     /*-----------------------------------------清除方法------------------------------------------*/
         this.Clear = {
         //删除指定的控件
         RemoveControl:function(control,map){
             map = map || locmap;
             if(control){
                 map.removeControl(control);
             }
         },
         //清除地图上所有的覆盖物
         ClearMap:function (map) {
             map = map || locmap;
             map.clearOverlays();
         },
         //清除信息提示框
         ClearInfoWindow:function(map){
             map = map || locmap;
             map.closeInfoWindow();
         },
         //删除指定的覆盖物（或覆盖物数组）
         RemoveOverlays:function(arr,map){
             map = map || locmap;
             if(arr.length>0){
                 for(var i = 0 ; i<arr.length;i++){
                     if(arr[i]){
                         map.removeOverlay(arr);
                     }
                 }

             }
         },
         //移除覆盖物的事件
         RemoveOverlayEvent:function(overlay,eventname,callback){
             overlay.removeEventListener(eventname,callback);
         }
     };
     /*-----------------------------------------信息窗体------------------------------------------*/
         this.InfoWindow = {
         //开启信息窗体
         Open:function(map,x,y,content,width,height,offsetx,offsety){
             map = map || locmap;
             offsetx = offsetx || 0;
             offsety = offsety || 0;

             var opts = {
                 width : width,		// 信息窗口宽度
                 height: height,	// 信息窗口高度
                 title : ""
             }
             // 创建信息窗口对象
             var infoWindow = new BMap.InfoWindow(content, opts);
             // 开启信息窗口
             map.openInfoWindow(infoWindow, new BMap.Point(x, y));
             return infoWindow;
         },
         //关闭信息窗体
         Close:function (map,infoWindow) {
             map = map || locmap;
             map.closeInfoWindow();
         }
     };
     /*-----------------------------------------覆盖物------------------------------------------*/
         this.Marker = {
         //添加覆盖物
         AddSimpleMarker:function(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, isPosition, offsetX, offsetY, tipContent, dirction, labelText, labelXOffset, labelyOffset,yewobj,map)
         {
             map = map || locmap;
             var offset;
             if(offsetX != undefined && offsetY != undefined)
             {
                 offset = new BMap.Size(offsetX, offsetY);
             }
             else
             {
                 offset = new BMap.Size(0, 0);
             }

             var pt = new BMap.Point(x, y);
             var myIcon = new BMap.Icon(imgUrl, new BMap.Size(imgWidth, imgHeight));
             var marker = new BMap.Marker(pt, {icon:myIcon, offset:offset});
             marker.id = id;
             marker.x=x;
             marker.y=y;
             marker.yewobj = yewobj;

             // 旋转角度
             if(dirction!=undefined && dirction!=null && dirction.length>0)
             {
                 marker.setRotation(dirction);
             }

             // 定位
             if(isPosition)
             {
                 map.centerAndZoom(pt, 18);
             }

             // 文字
             if(labelText != undefined && labelText != null)
             {
                 var opts = {
                     position : pt,    										// 指定文本标注所在的地理位置
                     offset   : new BMap.Size(labelXOffset, labelyOffset)		// 设置文本偏移量
                 }
                 // 创建文本标注对象
                 var label = new BMap.Label(labelText, opts);
                 label.setStyle({
                     color : "black",
                     fontSize : "12px",
                     height : "18px",
                     fontFamily:"宋体",
                     borderColor: "black"
                 });
                 marker.setLabel(label);
             }
             map.addOverlay(marker);
             // 弹出框
             if(tipContent != undefined && tipContent != "")
             {
                 marker.tipContent = tipContent;
             }
             else
             {
                 if(tipUrl != undefined && tipUrl != "")
                 {
                     marker.tipUrl = tipUrl;
                     marker.tipWidth = tipWidth;
                     marker.tipHeight = tipHeight;
                 }// end if
             }
             return marker;
         },
         //修改覆盖物的文本标注
         SetMarkerLabel:function(marker,text,offsetx,offsety){
             if(text){
                 marker.setLabel(new BMap.Label(
                     text,
                     {
                         offset : new BMap.Size(offsetx||0, offsety||0)
                     }
                 ));
             }
         },
         AddMarkerDrag:function(marker,callback){
             if(typeof callback === 'function'){
                 marker.enableDragging();
                 marker.addEventListener("dragend",callback);
             }
         },
         _markerdragendhandler:function(e){
             if(typeof  this === 'function'){
                 this(e);
             }
         },
         AddMarkerClick:function(marker,callback){
             if(typeof callback === 'function'){
                 marker.addEventListener("click",callback);
             }
         },
         _MarkerClickHandler:function(e){
             if(typeof  this === 'function'){
                 this(e);
             }
         },
         AddMarkerRightClick:function(marker,callback){
             if(typeof callback === 'function'){
                 marker.addEventListener("rightclick",callback);
             }
         },
         _MarkerRightClickHandler:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddMarkerMouseover:function(marker,callback){
             if(typeof callback === 'function'){
                 marker.addEventListener("mouseover",callback);
             }
         },
         _MarkerMouseover:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddMarkerMouseout:function(marker,callback){
             if(typeof callback === 'function'){
                 marker.addEventListener("mouseout",callback);
             }
         },
         _MarkerMouseout:function (e) {
             if(typeof this ==='function'){
                 this(e);
             }
         },
         AddMass:function(map,data,size,shape,color,callback){
             map = map || locmap;
             var mass;
             if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                 var points = [];  // 添加海量点数据
                 for (var i = 0; i < data.length; i++) {
                     points.push(new BMap.Point(data[i].x, data[i].y));
                 }
                 var options = {
                     size: size || BMAP_POINT_SIZE_SMALL,
                     shape: shape || BMAP_POINT_SHAPE_STAR,
                     color: color || '#d340c3'
                 }
                 var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                 pointCollection.addEventListener('click', function (e) {
                     if(typeof callback === "function"){
                         callback(e);
                     }
                 });
                 map.addOverlay(pointCollection);  // 添加Overlay
                 mass = pointCollection;
             } else {
                 alert('请在chrome、safari、IE8+以上浏览器查看本示例');
             }
             return mass;
         },
         AddMassComplete:function(mass,callback){

         },
         _massCompleteHandler:function(){
             if(typeof this === 'function'){
                 this();
             }
         },
         AddMassClick:function(mass,callback){
             if(typeof  callback === 'function'){
                 mass.addEventListener('click', function (e) {
                     if(typeof callback === "function"){
                         callback(e);
                     }
                 });
             }
         },
         _massClickHandler:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddMassDbClick:function(mass,callback){
         },
         _massDbClickHandler:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddMassMouseover:function(mass,callback){
             if(typeof  callback === 'function'){
                 mass.addEventListener('mouseover', function (e) {
                     if(typeof callback === "function"){
                         callback(e);
                     }
                 });
             }
         },
         _massMouseoverHandler:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddMassMouseout:function(mass,callback){
             if(typeof  callback === 'function'){
                 mass.addEventListener('mouseout', function (e) {
                     if(typeof callback === "function"){
                         callback(e);
                     }
                 });
             }
         },
         _massMouseoutHandler:function(e){
             if(typeof this === 'function'){
                 this(e);
             }
         }
     };
     /*-----------------------------------------线------------------------------------------*/
         this.Polyline = {
         //添加线数据到地图上
         AddPolyline:function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj,map){
             map = map || locmap;
             if(data.length == 0)
             {
                 return;
             }
             var arr = [];
             for(var i=0; i<data.length; i++)
             {
                 arr.push(new BMap.Point(data[i][0], data[i][1]));
             }
             // 创建折线
             var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
             polyline.id = id;
             polyline.yewobj = yewobj;
             // 增加折线
             map.addOverlay(polyline);
             return polyline;
         },
         //添加大地线数据到地图上
         AddgeoPolyline:function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj){

         },
         //绘制带箭头标志的线
         AddDirPolyline:function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj){

         },
         //获取指定线的路径点坐标数据
         GetPolylinePath:function(line){
             return line.getPath();
         },
         //设置指定线的路径点数据
         SetPolylinePath:function(line,data){
             if(line && data){
                 var pData = this.FormatLineDatas(data);
                 line.setPath(pData);
             }
         },
         //获取指定线的属性配置信息
         GetPolylineOption:function(line){
             //return line.getOptions();
         },
         //设置指定线的属性配置信息
         SetPolylineOption:function(line,option){
             //line.setOptions(data);
         },
         //获取指定线的长度
         GetLength:function(line){
             //return line.getLength();
         },
         //获取指定线的所在矩形的边界数据
         GetBounds:function(line){
             return line.getBounds();
         },
         //隐藏指定的线
         HideLine:function(line){
             line.hide();
         },
         //显示指定的线
         ShowLine:function(line){
             line.show();
         },
         //设置指定线的业务数据
         SetLineExtData:function(line,yew){
             line.yewobj = yew ;
         },
         //获取指定线的业务数据
         GetLineExtData:function(line){
             return line.yewobj;
         },
         GetPolylineMap:function(polyline){
             return polyline.getMap();
         },
         AddLineClick:function(line,callback){
             if(typeof callback === "function"){
                 line.addEventListener("click",callback);
             }
         },
         _LineClickHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddLineDBClick:function(line,callback){
             if(typeof callback === "function"){
                 line.addEventListener("dblclick",callback);
             }
         },
         _LineDBClickHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddLineRClick:function(line,callback){

         },
         _LineRClickHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddLineMouseover:function(line,callback){
             if(typeof callback === "function"){
                 line.addEventListener("mouseover",callback);
             }
         },
         _LineMouseoverHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         AddLineMouseout:function(line,callback){
             if(typeof callback === "function"){
                 line.addEventListener("mouseout",callback);
             }
         },
         _LineMouseoutHandler:function (e) {
             if(typeof this === 'function'){
                 this(e);
             }
         },
         //格式化绘制线需要的数据
         FormatLineDatas:function(value){
             var data = [];
             if (_api_.CommonToolsClass.IsArray(value)) {
                 data = value;
             } else {
                 var temps = value.split(";");
                 for(var i=0;i<temps.length;i++){
                     data.push([temps[i].split(",")[0],temps[i].split(",")[1]]);
                 }
             }
             return data;
         }
     };
     /*-----------------------------------------面------------------------------------------*/
         this.Polygon = {
         AddPolygon:function(id,data,strokeColor,strokeOpacity,strokeWeight,fillColor,fillOpacity,map,yewobj){
             map = map || locmap;
             if(data.length == 0)
             {
                 return;
             }
             var arr = [];
             for(var i=0; i<data.length; i++)
             {
                 arr.push(new BMap.Point(data[i][0], data[i][1]));
             }
             var polygon = new BMap.Polygon(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity,fillColor:fillColor, fillOpacity:fillOpacity,strokeStyle:strokeStyle});
             map.addOverlay(polygon);
             return polygon;
         },
         GetPolygonPath:function(polygon){
             return polygon.getPath();
         },
         SetPolygonPath:function(polygon,data){
             if(polygon&&data){
                 var pData = this.FormatPolygonDatas(data);
                 polygon.setPath(pData);
             }
         },
         GetPolygonBounds:function(polygon){
             return polygon.getBounds();
         },
         GetPolygonMap:function(polygon){
             return polygon.getMap();
         },
         EnablePolygonEdit:function(polygon){
             polygon.enableEditing();
         },
         DisablePolygonEdit:function(polygon){
             polygon.disableEditing();
         },
         EnableMassClear:function(polygon){
             polygon.enableMassClear();
         },
         DisableMassClear:function (polygon) {
             polygon.disableMassClear();
         },
         AddPolygonClick:function(polygon,callback){
             if(typeof callback === "function"){
                 polygon.addEventListener("click",callback);
             }
         },
         AddPolygonDBClick:function(polygon,callback){
             if(typeof callback === "function"){
                 polygon.addEventListener("dblclick",callback);
             }
         },
         AddPolygonMouseover:function(polygon,callback){
             if(typeof callback === "function"){
                 polygon.addEventListener("mouseover",callback);
             }
         },
         AddPolygonMouseout:function(polygon,callback){
             if(typeof callback === "function"){
                 polygon.addEventListener("mouseout",callback);
             }
         },
         //格式化绘制面需要的数据
         FormatPolygonDatas:function(value){
             var data = [];
             if (_api_.CommonToolsClass.IsArray(value)) {
                 data = value;
             } else {
                 var temps = value.split(";");
                 for(var i=0;i<temps.length;i++){
                     data.push([temps[i].split(",")[0],temps[i].split(",")[1]]);
                 }
             }
             return data;
         },
         //格式化绘制带洞面需要的数据
         FormatPolygonHoleDatas:function(value){
             var data = [];
             if (_api_.CommonToolsClass.IsArray(value)) {
                 data = value;
             } else {
                 var temp = values.split("$");
                 for(var ti = 0 ; ti < temp.length; ti++){
                     var temps = temp[ti].split(";");
                     var data1=[];
                     for(var i=0;i<temps.length;i++){
                         data1.push([temps[i].split(",")[0],temps[i].split(",")[1]]);
                     }
                     data.push(data1);
                 }
             }
             return data;
         },
     };
     /*-----------------------------------------圆------------------------------------------*/
         this.Circle = {
         AddCircle:function(id,x,y,radius,strokeColor,strokeOpacity,strokeWeight,fillColor,fillOpacity,map,yewobj){
             map = map || locmap;
             var circle = new BMap.Circle(
                 new BMap.Point(x,y),
                 radius||500,
                 {
                     strokeColor:strokeColor||"blue",
                     strokeWeight:strokeWeight||2,
                     strokeOpacity:strokeOpacity||0.5,
                     fillColor:fillColor||"#348534",
                     fillOpacity:fillOpacity||0.3
                 }); //创建圆
             circle.id = id;
             circle.yewobj = yewobj;
             map.addOverlay(circle);
             return circle;
         },
         GetCircleCenter:function(circle){
             return circle.getCenter();
         },
         SetCircleCenter:function(circle,x,y){
             if(x&&y){
                 circle.setCenter(new BMap.Point(x,y));
             }
         },
         SetRadius:function(circle,radius){
             circle.setRadius(radius);
         },
         GetRadius:function(circle,radius){
             return circle.getRadius(radius);
         },
         GetBounds:function(circle){
             return circle.getBounds();
         },
         GetMap:function(circle){
             return circle.getMap();
         },
         EnableEdit:function(circle){
             circle.enableEditing();
         },
         DisableEdit:function(circle){
             circle.disableEditing();
         },
         EnableMassClear:function(circle){
             circle.enableMassClear();
         },
         DisableMassClear:function (circle) {
             circle.disableMassClear();
         }
     };
     /*-----------------------------------------编辑工具------------------------------------------*/
     this.Editor = {
         /*//给指定线，面加入编辑工具
          AddPolyEditor:function(line,map,isopen,callback){
          map = map || locmap;
          isopen = isopen || true;
          var editor = new AMap.PolyEditor(map,line);
          editor.id = line.id;
          editor.on("end",this._EndPolyEditor,callback);
          if(isopen){
          editor.open();
          }
          return editor;
          },
          //批量设置线，面的编辑器
          AddPolyEditors:function(lineArr,map,callback){
          var editors = [];
          if (lineArr.length > 0) {
          for (var i = 0; i < lineArr.length; i++) {
          var temp = this.AddPolylineEditor(lineArr[i],map,false,callback);
          editors.push(temp);
          }
          }
          return editors;
          },
          //执行close()方法后执行的方法
          _EndPolyEditor:function(e){
          if(typeof this ==='function'){
          this(e);
          }
          },
          //关闭指定的线，面的编辑功能
          ClosePolyEditor:function(editor){
          editor.close();
          },
          //添加编辑圆的编辑类
          AddCircleEditor:function(circle,map,isopen,callback){
          map = map || locmap;
          isopen = isopen || true;
          var editor = new AMap.CircleEditor(map, circle);
          editor.id = circle.id;
          editor.on("end",this._EndPolyEditor,callback);
          if(isopen){
          editor.open();
          }
          return editor;
          },
          AddPolyEditors:function(circleArr,map,callback){
          var editors = [];
          if (circleArr.length > 0) {
          for (var i = 0; i < circleArr.length; i++) {
          var temp = this.AddPolylineEditor(circleArr[i],map,false,callback);
          editors.push(temp);
          }
          }
          return editors;
          },
          CloseCircleEditor:function(editor){
          editor.close();
          },*/
     };
     /*-----------------------------------------编辑工具------------------------------------------*/
     this.UI = {
         CreatSimpleMarker:function(text,textColor,map,x,y,labeltext,lofx,lofy,isShowPosition){
             map  = map || locmap;
             text = text || "";
             var positionpoint = isShowPosition ? {color: 'green',
                 radius: 5} : null;
             var position;
             if(x&&y){
                 position = new AMap.LngLat(x,y);
             }else{
                 position = _api_.MapBaseClass.GetMapCenter(map);
             }
             var label;
             if(labeltext){
                 label = {
                     context:labeltext,
                     offset: new AMap.Pixel(lofx||27, lofy||25)
                 }
             }

             AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                 var iconStyles = SimpleMarker.getBuiltInIconStyles();
                 var random = _api_.CommonToolsClass.GetRandom(0,19);
                 textColor = textColor || (style={
                         color:iconStyles[random]
                     });
                 var marker = new SimpleMarker({
                     //使用内置的iconStyle
                     iconStyle: iconStyles[random],
                     //图标文字
                     iconLabel: {
                         //A,B,C.....
                         innerHTML: text,
                         style: {
                             //颜色, #333, red等等，这里仅作示例，取iconStyle中首尾相对的颜色
                             color: textColor
                         }
                     },

                     showPositionPoint: positionpoint,
                     //显示定位点
                     //showPositionPoint:true,

                     map: map,
                     position: position,

                     //Marker的label(见http://lbs.amap.com/api/javascript-api/reference/overlay/#Marker)
                     label: label
                 });
             });
         },
         CreatMarkerCustomIcon:function(iconpath,text,textColor,map,x,y,labeltext,lofx,lofy){
             map  = map || locmap;
             text = text || "";
             var position;
             if(x&&y){
                 position = new AMap.LngLat(x,y);
             }else{
                 position = _api_.MapBaseClass.GetMapCenter(map);
             }
             var label;
             if(labeltext){
                 label = {
                     context:labeltext,
                     offset: new AMap.Pixel(lofx||27, lofy||25)
                 }
             }

             AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                 var iconStyles = SimpleMarker.getBuiltInIconStyles();
                 var random = _api_.CommonToolsClass.GetRandom(0,19);
                 textColor = textColor || (style={
                         color:iconStyles[random]
                     });
                 var marker = new SimpleMarker({
                     //使用内置的iconStyle
                     iconStyle: iconpath || "//webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
                     //图标文字
                     iconLabel: {
                         //A,B,C.....
                         innerHTML: text,
                         style: {
                             //颜色, #333, red等等，这里仅作示例，取iconStyle中首尾相对的颜色
                             color: textColor
                         }
                     },

                     //显示定位点
                     //showPositionPoint:true,

                     map: map,
                     position: position,

                     //Marker的label(见http://lbs.amap.com/api/javascript-api/reference/overlay/#Marker)
                     label: label
                 });
             });
         }
     };
     /*-----------------------------------------工具方法------------------------------------------*/
     this.CommonTools = {
         /*//判断对象是否是一个数组
          IsArray:function(obj) {
          return Object.prototype.toString.call(obj) === '[object Array]';
          },
          //获取指定范围的随机数
          GetRandom:function(min,max){
          var range = max - min ;
          var random = Math.random();
          return (min+Math.round(range*random));
          },*/
         //计算两点间的距离
         GetDistance:function(x1,y1,x2,y2){
             var p1 = new AMap.LngLat(x1,y1);
             var p2 = new AMap.LngLat(x2,y2);
             return p1.distance(p2);
         },
         //计算点到线之间的距离
         GetPoint2LineDistance:function(x,y,path){
             var p = new AMap.LngLat(x,y);
             var data = this.PolygonClass.FormatPolygonDatas(path);
             return p.distance(data);
         },
         //点在多边形内的计算
         IsPointInPolygon:function(map,x,y,path){
             map = map || locmap;
             var p = new AMap.LngLat(x,y);
             var data = this.PolygonClass.FormatPolygonDatas(path);
             var polygon = new AMap.Polygon({
                 map: map,
                 path: data
             });
             polygon.hide();
             return polygon.contains(p);
         }
     };
 };

 RootTool.Extend(RootMap,BDMap);

 /*BDMap.prototype.setmap = function(map){
   this.map = map || {};
 };
 BDMap.prototype.getmap = function(){
     return this.map;
 };

 BDMap.prototype.init = function (Parent) {
     var Child = RootTool.deepCopy(Parent,Child);
     this.base = Child;
 };

 BDMap.prototype.Init = {
     //创建地图
     CreateMap:function(type,id,x,y,level,isEnableMapClick){
         isEnableMapClick = isEnableMapClick || true;
         id = id || "container";
         x = x || 112.532769;
         y = y || 37.862977;
         level = level || 10;
         // 创建Map实例
         var map = new BMap.Map(id, { enableMapClick: isEnableMapClick });
         map.test = id;

         var point = new BMap.Point(x,y);
         map.centerAndZoom(point, level);
         // 启用滚轮放大缩小
         map.enableScrollWheelZoom();

         if(type&&type==="simple"){
             this.AddScale(map);
             this.AddMapType(map);
             this.AddOverView(map);
             this.AddToolBar(map);
         }
         if(typeof(InitYeW) == "function")
         {
             InitYeW();
         }
         return map;
     },
     CreateMapWithIndoor:function(id,x,y,level){
         //室内图，百度地图没有
     },
     //设置的地图显示的语言：英文，中文和中英文
     SetMapLanguage:function(value,map){
         //百度地图没有设置语言功能
     },
     //添加比例尺控件
     AddScale:function(map){
         map = map || this.map;
         var scale = new BMap.ScaleControl();
         map.addControl(scale);
         //_api_.scale = scale;
         return scale;
     },
     //添加导航条控件
     AddToolBar:function (map) {
         map = map || this.map;
         var toolbar = new BMap.NavigationControl({
             offset: new BMap.Size(0, 10),
             anchor: BMAP_ANCHOR_TOP_LEFT
         });
         map.addControl(toolbar);
         //_api_.toolbar = toolbar;
         return toolbar;
     },
     //添加鹰眼控件
     AddOverView:function (map) {
         map = map || this.map;
         var overview = new BMap.OverviewMapControl()
         map.addControl(overview);
         //_api_.overview = overview;
         return overview;
     },
     //添加地图类型选择控件
     AddMapType:function(map){
         map = map || this.map;
         var maptype = new BMap.MapTypeControl({
             type: BMAP_MAPTYPE_CONTROL_DROPDOWN,
             mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP]
         });
         map.addControl(maptype);
         //locmaptype = maptype;
         return maptype;
     },
     AddMapUIType:function(map,theme){

     }
 };

 BDMap.prototype.Base = {
     //设置中心点和缩放级别
     CenterAndZoom:function (x,y,level,map) {
         console.log(BDMap.getmap());
         map = map || BDMap.map;
         if(x&&y&&level){
             map.centerAndZoom(new BMap.Point(x,y),level);
         }
     },
     //将地图的中心点移到指定坐标
     PanToPoint:function(x,y,map){
         map = map || BDMap.map;
         if(x&&y){
             map.panTo(new BMap.Point(x,y));
         }
     },
     //将地图的中心点偏移x,y个像素
     PanByPixel:function(offsetX,offsetY,map){
         map = map || BDMap.map;
         if(offsetX&&offsetY){
             map.panBy(offsetX,offsetY);
         }
     },
     //获取当前地图的缩放级别
     GetZoom:function(map){
         map = map || BDMap.map;
         return map.getZoom();
     },
     //获取当前地图的图层
     GetLayers:function(map){
         map = map || BDMap.map;
         return map.getOverlays();
     },
     //获取当前中心点所在的城市信息
     GetCity:function(map){
         map = map || BDMap.map;
         return map.getCenter();
     },
     //获取中心点城市信息回调函数
     _getCityHandler:function(result){
         if(typeof getcityinfo === 'function'){
             getcityinfo(result);
         }
     },
     //获取当前地图的可视的边界对象
     GetBounds:function(map){
         map = map || BDMap.map;
         return map.getBounds();
     },
     //获取当前地图的可视的边界的2个边界点坐标
     GetBoundsXY:function(map){
         map = map || BDMap.map;
         var bounds = map.getBounds();
         return obj = {
             x1:bounds.getSouthWest().lng,
             y1:bounds.getSouthWest().lat,
             x2:bounds.getNorthEast().lng,
             y2:bounds.getNorthEast().lat
         }
     },
     SetZoom:function(value,map){
         map = map || BDMap.map;
         if(value&&value>=3&&value<=18){
             map.setZoom(value);
         }
     },
     ZoomIn:function(map){
         map = map || BDMap.map;
         map.zoomIn();
     },
     ZoomOut:function (map) {
         map = map || BDMap.map;
         map.zoomOut();
     },
     //获取点击地图位置的坐标
     GetClickPosition:function(map){
         /!*this.call(BDMap.map)*!/
         map = map || BDMap.map;
         map.addEventListener("click",this._getClickPositionHandler);
     },
     //处理地图点击的回调
     //PS:这里要强调的是this不是GaoDMap对象而是地图对象,this代表map对象
     _getClickPositionHandler:function(e){
         if (_api_.marker) {
             _api_.marker.setPosition(e.point);
         }else{
             _api_.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
             e.target.addOverlay(_api_.marker);

         }
         if(typeof getclickposition === 'function'){
             getclickposition(e);
         }
     },
     //添加缩放级别改变触发事件
     AddZoomChange:function(map){
         map = map || BDMap.map;
         map.addEventListener("zoomend",this._ZoomChangeHandler);
     },
     //
     _ZoomChangeHandler:function(e){
         var level = e.target.GetZoom();
         if(typeof zoomchangehandler === 'function'){
             zoomchangehandler(level);
         }
     },
     AddRightClick:function(map){
         map = map || BDMap.map;
         map.addEventListener("rightclick",this._RightClickHandler);
     },
     _RightClickHandler:function(e){
         if(typeof rightclickhandler === 'function'){
             rightclickhandler(e);
         }
     },
     AddMoveEnd:function(map){
         map = map || BDMap.map;
         map.addEventListener("dragend",this._MoveEndHandler);
     },
     _MoveEndHandler:function(e){
         if(typeof moveendhandler === 'function'){
             moveendhandler(e);
         }
     },
     OffEvent:function(eventstr,callback){
         map.removeEventListener(eventstr,callback);
     },
     //获取当前地图对象上所有的覆盖物
     GetAllOverlays:function(map){
         map = map || BDMap.map;
         return map.getOverlays();
     },
     //设置限制显示的范围
     SetLimitBounds:function(x1,y1,x2,y2,map){
         map = map || BDMap.map;
         if(x1&&y1&&x2&&y2){
             var b = new BMap.Bounds(new BMap.Point(x1, y1),new BMap.Point(x2, y2));
             try {
                 BMapLib.AreaRestriction.setBounds(map, b);
             } catch (e) {
                 alert(e);
             }
         }
     },
     SetMapStyle:function(value,map){
         map = map || BDMap.map;
         if(value){
             map.setMapStyle(value);
         }
     },
     GetMapCenter:function (map) {
         map = map || BDMap.map;
         return map.getCenter();
     }
 };*/
 /*//创建地图
 bdmap.prototype.CreateMap = function(id,x,y,level,isEnableMapClick){
     isEnableMapClick = isEnableMapClick || true;
     id = id || "container";
     x = x || 112.532769;
     y = y || 37.862977;
     level = level || 10;
     // 创建Map实例
     _api_.map = new BMap.Map(id, { enableMapClick: isEnableMapClick });
     var point = new BMap.Point(x,y);
     _api_.map.centerAndZoom(point, level);
     // 启用滚轮放大缩小
     _api_.map.enableScrollWheelZoom();

     if(typeof(InitYeW) == "function")
     {
         InitYeW();
     }
     return _api_.map;
 };

 bdmap.prototype.CreateMapWithIndoor = function(id,x,y,level){
     //室内图，百度地图没有
 };
 //设置的地图显示的语言：英文，中文和中英文
 bdmap.prototype.SetMapLanguage = function(value,map){
     //百度地图没有设置语言功能
 };
 //添加比例尺控件
 bdmap.prototype.AddScale = function(map){
     map = map || _api_.map;
     var scale = new BMap.ScaleControl();
     map.addControl(scale);
     _api_.scale = scale;
     return scale;
 };
 //添加导航条控件
 bdmap.prototype.AddToolBar = function (map) {
     map = map || _api_.map;
     var toolbar = new BMap.NavigationControl({
         offset: new BMap.Size(0, 100),
         anchor: BMAP_ANCHOR_TOP_RIGHT
     });
     map.addControl(toolbar);
     _api_.toolbar = toolbar;
     return toolbar;
 };
 //添加鹰眼控件
 bdmap.prototype.AddOverView = function (map) {
     map = map || _api_.map;
     var overview = new BMap.OverviewMapControl()
     map.addControl(overview);
     _api_.overview = overview;
     return overview;
 };
 //添加地图类型选择控件
 bdmap.prototype.AddMapType = function(map){
     map = map || _api_.map;
     var maptype = new BMap.MapTypeControl({
         type: BMAP_MAPTYPE_CONTROL_DROPDOWN,
         mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP]
     });
     map.addControl(maptype);
     _api_.maptype = maptype;
     return maptype;
 };
 bdmap.prototype.AddMapUIType = function(map,theme){

 };
 bdmap.prototype.SetCurrentMap = function(map){
     if(map){
         _api_.map = map;
     }
 };*/

