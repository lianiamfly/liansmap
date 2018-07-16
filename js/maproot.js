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
             this.ShowSwitchMapType("up_right",10,50,this.locmap);
             //this.AddMapType(this.locmap);
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
     //设置当前地图的缩放级别
     this.SetZoom = function(map,level){
         map = map || this.locmap;
         if(level){
             map.setZoom(level);
         }
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
     this.GetClickPosition = function(handler,map){
         /*this.call(this.map)*/
         map = map || this.locmap;
         map.clickhandler = handler;
         this.locmap = map;
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
         //var t = this.clickhandler;
         if(typeof this.clickhandler === 'function'){
             this.clickhandler(e);
         }
     };
     //添加缩放级别改变触发事件
     this.AddZoomChange = function(handler,map){
         map = map || this.locmap;
         map.zoomchangehandler = handler;
         this.locmap = map;
         map.addEventListener("zoomend",this._ZoomChangeHandler);
     };
     //
     this._ZoomChangeHandler = function(e){
         var level = e.target.getZoom();//  return map.getZoom();
         if(typeof this.zoomchangehandler === 'function'){
             this.zoomchangehandler(level);
         }
     };
     this.AddRightClick = function(handler,map){
         map = map || this.locmap;
         map.rightclickhandler = handler;
         this.locmap = map;
         map.addEventListener("rightclick",this._RightClickHandler);
     };
     this._RightClickHandler = function(e){
         if(typeof this.rightclickhandler === 'function'){
             this.rightclickhandler(e);
         }
     };
     this.AddMoveEnd = function(handler,map){
         map = map || this.locmap;
         map.moveendhandler = handler;
         this.locmap = map;
         map.addEventListener("dragend",this._MoveEndHandler);
     };
     this._MoveEndHandler = function(e){
         if(typeof this.moveendhandler === 'function'){
             this.moveendhandler(e);
         }
     };
     this.OffEvent = function(eventstr,callback,map){
         map = map || this.locmap;
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
     //得到地图当前边界
     this.GetCurBounds = function(map)
     {
         var param = null;
         map = map || this.locmap;
         if (map != null)
         {
             var bounds = map.getBounds();
             var param = new this.CommonBounds(bounds.getSouthWest().lng, bounds.getNorthEast().lat, bounds.getNorthEast().lng, bounds.getSouthWest().lat);
         }

         return param;
     };
     //平移
     this.AddPanEvent = function(callback,map)
     {
         var param = this.GetCurBounds();

         // 调用控制层的：地图平移、缩放后触发
         if (typeof(callback)==="function"&&callback != null)
         {
             callback(param);
         }

     };
     // 缩放
     this.AddZoomEvent = function (callback,map)
     {

         var param = this.GetCurBounds();

         // 调用控制层的：地图缩放级别更改后触发
         if (typeof(callback)==="function"&&callback != null)
         {
             callback(param);
         }
     };
     this.CommonBounds = function (x1, y1, x2, y2)
     {
         this.x1 = x1;
         this.y1 = y1;
         this.x2 = x2;
         this.y2 = y2;
     };// end function
     this.AppendCopyRight = function(value, text,url,copycss,offsetX,offsetY,map) {
         map = map || this.locmap;
         if (copyright !== undefined) {
             //先删除掉之前添加的版权
             map.removeControl(copyright);
         }
         /*
          BMAP_ANCHOR_TOP_LEFT 	控件将定位到地图的左上角
          BMAP_ANCHOR_TOP_RIGHT 	控件将定位到地图的右上角
          BMAP_ANCHOR_BOTTOM_LEFT 	控件将定位到地图的左下角
          BMAP_ANCHOR_BOTTOM_RIGHT 	控件将定位到地图的右下角
          */
         offsetX = (offsetX !== undefined && offsetX !== null) ? offsetX : 10;
         offsetY = (offsetY !== undefined && offsetY !== null) ? offsetY : 10;
         var size = new BMap.Size(offsetX, offsetY);
         if (value === "up_left") {
             copyright = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_LEFT,offset:size });   //设置版权控件位置
         } else if (value === "up_right") {
             copyright = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: size });
         } else if (value === "bottom_left") {
             copyright = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT, offset: size });
         } else if (value === "bottom_right") {
             copyright = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, offset: size });
         }
         map.addControl(copyright); //添加版权控件
         var bs = map.getBounds();   //返回地图可视区域
         url = (url !== undefined && url !== null && url != "") ? url : "#";
         copycss = (copycss !== undefined && copycss !== null ) ? copycss : "";
         copyright.addCopyright({ id: 1, content: "<a href='" + url + "' class='" + copycss + "' style='font-size:20px;background:yellow'>" + text + "</a>", bounds: bs });
     };
     //全景图图层叠加在百度地图上，配有一个全景切换的按钮
     this.showQuanJTControl = function (offsetX,offsetY,map) {
         map = map || this.locmap;
         // 覆盖区域图层测试
         //if (this.quanJTileLayer)
         {
             this.quanJTileLayer = new BMap.PanoramaCoverageLayer()
             map.addTileLayer(this.quanJTileLayer);

             this.quanJTileControl = new BMap.PanoramaControl(); //构造全景控件
             offsetX = (offsetX !== undefined && offsetX !== null && offsetX !== "") ? offsetX : 20;
             offsetY = (offsetY !== undefined && offsetY !== null && offsetY !== "") ? offsetY : 50;
             this.quanJTileControl.setOffset(new BMap.Size(offsetX, offsetY));
             map.addControl(this.quanJTileControl);//添加全景控件
         }

     };
     showQuanJTControl = function (offsetX,offsetY,map) {
         map = map || this.locmap;
         // 覆盖区域图层测试
         //if (this.quanJTileLayer)
         {
             this.quanJTileLayer = new BMap.PanoramaCoverageLayer()
             map.addTileLayer(this.quanJTileLayer);

             this.quanJTileControl = new BMap.PanoramaControl(); //构造全景控件
             offsetX = (offsetX !== undefined && offsetX !== null && offsetX !== "") ? offsetX : 10;
             offsetY = (offsetY !== undefined && offsetY !== null && offsetY !== "") ? offsetY : 45;
             this.quanJTileControl.setOffset(new BMap.Size(offsetX, offsetY));
             map.addControl(this.quanJTileControl);//添加全景控件
         }

     };
     //添加城市选择控件
     this.showCitySelectControl = function (value, offsetX, offsetY,map) {
         map = map || this.locmap;
         if (citySelectControl !== undefined) {
             //先删除掉之前添加的版权
             map.removeControl(citySelectControl);
         }
         offsetX = (offsetX !== undefined && offsetX !== null) ? offsetX : 10;
         offsetY = (offsetY !== undefined && offsetY !== null) ? offsetY : 10;
         var size = new BMap.Size(offsetX, offsetY);
         if (value === "up_left") {
             citySelectControl = new BMap.CityListControl({ anchor: BMAP_ANCHOR_TOP_LEFT, offset: size });   //设置版权控件位置
         } else if (value === "up_right") {
             citySelectControl = new BMap.CityListControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, offset: size });
         } else if (value === "bottom_left") {
             citySelectControl = new BMap.CityListControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT, offset: size });
         } else if (value === "bottom_right") {
             citySelectControl = new BMap.CityListControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, offset: size });
         }
         map.addControl(citySelectControl);
     };

     //添加地图、卫星图、全景图切换的控件
     this.ShowSwitchMapType = function (value, offsetX, offsetY,map) {
         map = map || this.locmap;
         // 定义一个控件类,即function
         function SwitchMapTypeControl(value, offsetX, offsetY) {
             // 默认停靠位置和偏移量
             offsetX = (offsetX !== undefined && offsetX !== null) ? offsetX : 10;
             offsetY = (offsetY !== undefined && offsetY !== null) ? offsetY : 10;
             var size = new BMap.Size(offsetX, offsetY);
             var position;
             if (value === "up_left") {
                 position = BMAP_ANCHOR_TOP_LEFT;   //设置版权控件位置
             } else if (value === "up_right") {
                 position = BMAP_ANCHOR_TOP_RIGHT;
             } else if (value === "bottom_left") {
                 position = BMAP_ANCHOR_BOTTOM_LEFT;
             } else if (value === "bottom_right") {
                 position = BMAP_ANCHOR_BOTTOM_RIGHT;
             }

             this.defaultAnchor = position;
             this.defaultOffset = size;
         }

         // 通过JavaScript的prototype属性继承于BMap.Control
         SwitchMapTypeControl.prototype = new BMap.Control();
         SwitchMapTypeControl.prototype.initialize = function (map) {
             // 创建一个DOM元素
             var div = document.createElement("div");
             var selectControl = document.createElement("select");
             selectControl.id = "selectMapType";
             selectControl.options.add(new Option("地图", "1"));
             selectControl.options.add(new Option("影像", "2"));
             selectControl.options.add(new Option("全景", "3"));
             selectControl.onchange = function () {
                 var selectTemp = document.getElementById("selectMapType");
                 var index = selectTemp.selectedIndex; //序号，取当前选中选项的序号
                 var val = selectTemp.options[index].value;
                 switchMapTypeFun(val);
             }
             div.appendChild(selectControl);

             // 添加DOM元素到地图中
             map.getContainer().appendChild(div);
             // 将DOM元素返回
             return div;
         }

         if (this.switchControl) {
             map.removeControl(switchControl);
         }

         // 创建控件
         this.switchControl = new SwitchMapTypeControl("up_right");
         // 添加到地图当中
         map.addControl(this.switchControl);
     };
     switchMapTypeFun = function (value,map) {
         map = map || locmap;
         if (value !== undefined) {
             //移除全景图图层
             if (this.quanJTileLayer) {
                 map.removeTileLayer(this.quanJTileLayer);
                 map.removeControl(this.quanJTileControl);
                 this.quanJTileLayer = undefined;

             }

             if (value === "1") {
                 map.setMapType(BMAP_NORMAL_MAP);

             } else if (value === "2") {
                 map.setMapType(BMAP_SATELLITE_MAP);
             } else if (value === "3") {
                 map.setMapType(BMAP_NORMAL_MAP);
                 this.showQuanJTControl();
             }
         }
     };
     /*-----------------------------------------地图自定义控件------------------------------------------*/

     /*-----------------------------------------清除方法------------------------------------------*/
     //删除指定的控件
     this.RemoveControl = function(control,map){
         map = map || this.locmap;
         if(control){
             map.removeControl(control);
         }
     };
     //清除地图上所有的覆盖物
     this.ClearMap = function (map) {
         map = map || this.locmap;
         map.clearOverlays();
     };
     //清除信息提示框
     this.ClearInfoWindow = function(map){
         map = map || this.locmap;
         map.closeInfoWindow();
     };
     //删除指定的覆盖物（或覆盖物数组）
     this.RemoveOverlays = function(arr,map){
         map = map || this.locmap;
         if(arr.length>0){
             for(var i = 0 ; i<arr.length;i++){
                 if(arr[i]){
                     map.removeOverlay(arr);
                 }
             }

         }
     };
     //移除覆盖物的事件
     this.RemoveOverlayEvent = function(overlay,eventname,callback){
         overlay.removeEventListener(eventname,callback);
     };
     /*-----------------------------------------信息窗体------------------------------------------*/
     //开启信息窗体
     this.InfoWindowOpen = function(map,x,y,content,width,height,offsetx,offsety){
         map = map || this.locmap;
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
     };
     //关闭信息窗体
     this.InfoWindowClose = function (map,infoWindow) {
         map = map || this.locmap;
         map.closeInfoWindow();
     };
     /*-----------------------------------------覆盖物------------------------------------------*/
     //添加覆盖物
     this.AddSimpleMarker = function(id, x, y, imgUrl, imgWidth, imgHeight,
                                     tipUrl, tipWidth, tipHeight, isPosition,
                                     offsetX, offsetY, tipContent, dirction,
                                     labelText, labelXOffset, labelyOffset,yewobj,map)
     {
         map = map || this.locmap;
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
         var myIcon = undefined;
         if(imgUrl&&imgWidth&&imgHeight){
             myIcon = new BMap.Icon(imgUrl, new BMap.Size(imgWidth, imgHeight));
         }
         var marker = undefined;
         if(myIcon&&offset){
             marker = new BMap.Marker(pt, {icon:myIcon, offset:offset});
         }else if(myIcon&&offset===undefined){
             marker = new BMap.Marker(pt, {icon:myIcon});
         }else if(myIcon===undefined&&offset){
             marker = new BMap.Marker(pt, {offset:offset});
         }else{
             marker = new BMap.Marker(pt);
         }
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
     };
     //修改覆盖物的文本标注
     this.SetMarkerLabel = function(marker,text,offsetx,offsety){
         if(text&&marker){
             marker.setLabel(new BMap.Label(
                 text,
                 {
                     offset : new BMap.Size(offsetx||0, offsety||0)
                 }
             ));
             return marker;
         }
     };
     // 增加点的跳动效果setMarkerAnimationBOUNCE
     this.SetMarkerAnimationBOUNCE = function(marker)
     {
         if(marker != undefined && marker != null)
         {
             marker.setAnimation(BMAP_ANIMATION_BOUNCE);
         }

     };// end function
     // 增加点的坠落效果setMarkerAnimationDROP
     this.setMarkerAnimationDROP = function (marker)
     {
         if(marker != undefined && marker != null)
         {
             marker.setAnimation(BMAP_ANIMATION_DROP);
         }

     };// end function
     this.AddMarkerDrag = function(marker,callback){
         if(typeof callback === 'function'){
             marker.enableDragging();
             marker.addEventListener("dragend",callback);
         }
     };
     this.AddMarkerClick = function(marker,callback){
         if(typeof callback === 'function'){
             marker.addEventListener("click",callback);
         }
     };
     this.AddMarkerRightClick = function(marker,callback){
         if(typeof callback === 'function'){
             marker.addEventListener("rightclick",callback);
         }
     };
     this.AddMarkerMouseover = function(marker,callback){
         if(typeof callback === 'function'){
             marker.addEventListener("mouseover",callback);
         }
     };
     this.AddMarkerMouseout = function(marker,callback){
         if(typeof callback === 'function'){
             marker.addEventListener("mouseout",callback);
         }
     };
     this.AddMass = function(map,data,size,shape,color,callback){
         map = map || this.locmap;
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
     };
     this.AddMassComplete = function(mass,callback){

     };
     this.AddMassClick = function(mass,callback){
         if(typeof  callback === 'function'){
             mass.addEventListener('click', function (e) {
                 if(typeof callback === "function"){
                     callback(e);
                 }
             });
         }
     };
     this.AddMassDbClick = function(mass,callback){
     };
     this.AddMassMouseover = function(mass,callback){
         if(typeof  callback === 'function'){
             mass.addEventListener('mouseover', function (e) {
                 if(typeof callback === "function"){
                     callback(e);
                 }
             });
         }
     };
     this.AddMassMouseout = function(mass,callback){
         if(typeof  callback === 'function'){
             mass.addEventListener('mouseout', function (e) {
                 if(typeof callback === "function"){
                     callback(e);
                 }
             });
         }
     };
     function haiLPoint(x, y) {
         this.x = x;
         this.y = y;
     };
     //添加海量点
     this.AppendHLPoints = function(data,size,shape,color,clickCallBack,mouseoverCallBack,mouseoutCallBack,map) {
         map = map || this.locmap;
         if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
             if (data.length > 0) {
                 var points = [];  // 添加海量点数据
                 size = (size !== undefined && size !== null && size !== "") ? size : BMAP_POINT_SIZE_SMALL;
                 shape = (shape !== undefined && shape !== null && shape !== "") ? shape : BMAP_POINT_SHAPE_STAR;
                 color = (color !== undefined && color !== null && color !== "") ? color : '#d340c3';
                 for (var i = 0; i < data.length; i++) {
                     points.push(new BMap.Point(data[i].x, data[i].y));
                 }
                 var options = {
                     size: size,
                     shape: shape,
                     color: color
                 }
                 var pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                 pointCollection.addEventListener('click', function (e) {
                     if (typeof (clickCallBack) === "function") {
                         clickCallBack(e);
                     }
                     //console.log('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
                 });

                 pointCollection.addEventListener('mouseover', function (e) {
                     if (typeof (mouseoverCallBack) === "function") {
                         mouseoverCallBack(e);
                     }
                 });

                 pointCollection.addEventListener('mouseout', function (e) {
                     if (typeof (mouseoutCallBack) === "function") {
                         mouseoutCallBack(e);
                     }
                 });

                 map.addOverlay(pointCollection);  // 添加Overlay
             }
         } else {
             console.log('请在chrome、safari、IE8+以上浏览器查看本示例');
         }
     };
     /*-----------------------------------------线------------------------------------------*/
     //添加线数据到地图上
     this.AddPolyline = function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj,map){
         map = map || this.locmap;
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
     };
     //添加大地线数据到地图上
     this.AddgeoPolyline = function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj){

     };
     //绘制带箭头标志的线
     this.AddDirPolyline = function(id,data,strokeColor,strokeOpacity,strokeWeight,strokeStyle,strokeDasharray,yewobj){

     };
     //获取指定线的路径点坐标数据
     this.GetPolylinePath = function(line){
         return line.getPath();
     };
     //设置指定线的路径点数据
     this.SetPolylinePath = function(line,data){
         if(line && data){
             var pData = this.FormatLineDatas(data);
             line.setPath(pData);
         }
     };
     //获取指定线的属性配置信息
     this.GetPolylineOption = function(line){
         //return line.getOptions();
     };
     //设置指定线的属性配置信息
     this.SetPolylineOption = function(line,option){
         //line.setOptions(data);
     };
     //获取指定线的长度
     this.GetLength = function(line){
         //return line.getLength();
     };
     //获取指定线的所在矩形的边界数据
     this.GetBounds = function(line){
         return line.getBounds();
     };
     //隐藏指定的线
     this.HideLine = function(line){
         line.hide();
     };
     //显示指定的线
     this.ShowLine = function(line){
         line.show();
     };
     //设置指定线的业务数据
     this.SetLineExtData = function(line,yew){
         line.yewobj = yew ;
     };
     //获取指定线的业务数据
     this.GetLineExtData = function(line){
         return line.yewobj;
     };
     this.GetPolylineMap = function(polyline){
         return polyline.getMap();
     };
     this.AddLineClick = function(line,callback){
         if(typeof callback === "function"){
             line.addEventListener("click",callback);
         }
     };
     this.AddLineDBClick = function(line,callback){
         if(typeof callback === "function"){
             line.addEventListener("dblclick",callback);
         }
     };
     this.AddLineRClick = function(line,callback){

     };
     this.AddLineMouseover = function(line,callback){
         if(typeof callback === "function"){
             line.addEventListener("mouseover",callback);
         }
     };
     this.AddLineMouseout = function(line,callback){
         if(typeof callback === "function"){
             line.addEventListener("mouseout",callback);
         }
     };
     //格式化绘制线需要的数据
     this.FormatLineDatas = function(value){
         var data = [];
         if (RootTool.IsArray(value)) {
             data = value;
         } else {
             var temps = value.split(";");
             for(var i=0;i<temps.length;i++){
                 data.push([temps[i].split(",")[0],temps[i].split(",")[1]]);
             }
         }
         return data;
     };
     /*-----------------------------------------面------------------------------------------*/
     this.AddPolygon = function(id,data,strokeColor,strokeOpacity,strokeWeight,fillColor,fillOpacity,map,yewobj){
         map = map || this.locmap;
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
     };
     this.GetPolygonPath = function(polygon){
         return polygon.getPath();
     };
     this.SetPolygonPath = function(polygon,data){
         if(polygon&&data){
             var pData = this.FormatPolygonDatas(data);
             polygon.setPath(pData);
         }
     };
     this.GetPolygonBounds = function(polygon){
         return polygon.getBounds();
     };
     this.GetPolygonMap = function(polygon){
         return polygon.getMap();
     };
     this.EnablePolygonEdit = function(polygon){
         polygon.enableEditing();
     };
     this.DisablePolygonEdit = function(polygon){
         polygon.disableEditing();
     };
     this.EnableMassClear = function(polygon){
         polygon.enableMassClear();
     };
     this.DisableMassClear = function (polygon) {
         polygon.disableMassClear();
     };
     this.AddPolygonClick = function(polygon,callback){
         if(typeof callback === "function"){
             polygon.addEventListener("click",callback);
         }
     };
     this.AddPolygonDBClick = function(polygon,callback){
         if(typeof callback === "function"){
             polygon.addEventListener("dblclick",callback);
         }
     };
     this.AddPolygonMouseover = function(polygon,callback){
         if(typeof callback === "function"){
             polygon.addEventListener("mouseover",callback);
         }
     };
     this.AddPolygonMouseout = function(polygon,callback){
         if(typeof callback === "function"){
             polygon.addEventListener("mouseout",callback);
         }
     };
     //格式化绘制面需要的数据
     this.FormatPolygonDatas = function(value){
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
     };
     //格式化绘制带洞面需要的数据
     this.FormatPolygonHoleDatas = function(value){
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
     };
     /*-----------------------------------------圆------------------------------------------*/
     this.AddCircle = function(id,x,y,radius,strokeColor,strokeOpacity,strokeWeight,fillColor,fillOpacity,map,yewobj){
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
     };
     this.GetCircleCenter = function(circle){
         return circle.getCenter();
     };
     this.SetCircleCenter = function(circle,x,y){
         if(x&&y){
             circle.setCenter(new BMap.Point(x,y));
         }
     };
     this.SetRadius = function(circle,radius){
         circle.setRadius(radius);
     };
     this.GetRadius = function(circle,radius){
         return circle.getRadius(radius);
     };
     this.GetBounds = function(circle){
         return circle.getBounds();
     };
     this.GetMap = function(circle){
         return circle.getMap();
     };
     this.EnableEdit = function(circle){
         circle.enableEditing();
     };
     this.DisableEdit = function(circle){
         circle.disableEditing();
     };
     this.EnableMassClear = function(circle){
         circle.enableMassClear();
     };
     this.DisableMassClear = function (circle) {
         circle.disableMassClear();
     };
     /*-----------------------------------------编辑工具------------------------------------------*/


     /*-----------------------------------------工具方法------------------------------------------*/
     //计算两点间的距离
     this.GetDistance = function(x1,y1,x2,y2){
         var p1 = new AMap.LngLat(x1,y1);
         var p2 = new AMap.LngLat(x2,y2);
         return p1.distance(p2);
     };
     //计算点到线之间的距离
     this.GetPoint2LineDistance = function(x,y,path){
         var p = new AMap.LngLat(x,y);
         var data = this.PolygonClass.FormatPolygonDatas(path);
         return p.distance(data);
     };
     //点在多边形内的计算
     this.IsPointInPolygon = function(map,x,y,path){
         map = map || locmap;
         var p = new AMap.LngLat(x,y);
         var data = this.PolygonClass.FormatPolygonDatas(path);
         var polygon = new AMap.Polygon({
             map: map,
             path: data
         });
         polygon.hide();
         return polygon.contains(p);
     };
     // 计算面积 平方米
     this.GetPolygonArea = function(pts){
         var pts = [];

         if(arrData.length == 0)
         {
             return 0;
         }

         for(var i=0; i<arrData.length; i++)
         {
             var pt = new BMap.Point(arrData[i].x, arrData[i].y);
             pts.push(pt);
         }

         var ply = new BMap.Polygon(pts);
         var area = BMapLib.GeoUtils.getPolygonArea(ply);

         if(isNaN(area)){
             return 0;
         }else{
             return area.toFixed(2);
         }
     };
     // 根据经纬度得到地址
     this.GetAddressFromXY = function (x, y,callback)
     {
         var geoc = new BMap.Geocoder();
         var point = new BMap.Point(x, y);
         if(callback&&typeof  callback === "function"){
             geoc.getLocation(point, callback);
         }else{
             geoc.getLocation(point, function(rs)
             {
                 var addComp = rs.addressComponents;
                 var address = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
                 if(typeof(YeWXYGetAddress) == "function")
                 {
                     YeWXYGetAddress(address);
                 }
             });
         }

     };// end function
     // 根据地址得到经纬度
     this.GetXYFromAddress = function (cityName, address,callback)
     {
         // 创建地址解析器实例
         var myGeo = new BMap.Geocoder();
         if(callback&& typeof  callback === "function"){
             // 将地址解析结果显示在地图上,并调整地图视野
             myGeo.getPoint(address,callback,cityName);
         }else{
             // 将地址解析结果显示在地图上,并调整地图视野
             myGeo.getPoint(address, function(point)
             {
                 if (point)
                 {
                     var result = point;
                 }
                 else
                 {
                     alert("地址没有解析到结果。");
                 }
             }, cityName);
         }
     };// end function
     //计算网格中心点坐标
     this.GetCoorsCenter = function(coors){
         var result="";
         //获取到coors中的最大最小X,Y
         var areas;
         if(coors.contains("#")){
             areas=coors.split("#");
         }else{
             areas=new Array(1);
             areas[0]=coors;
         }
         for(var i=0;i<areas.length;i++){
             var points=areas[i].split(";");
             var xList=[];
             var yList=[];
             $.each(points,function(index,item){
                 var x=(item.split(",")[0])*1.0;
                 var y=(item.split(",")[1])*1.0;

                 xList.push(x);
                 yList.push(y);
             });

             xList=xList.sort();
             yList=yList.sort();

             var minX=xList[0];
             var maxX=xList[xList.length-1];
             var minY=yList[0];
             var maxY=yList[yList.length-1];

             var centerX=((maxX+minX)/2).toFixed(6);
             //centerX=centetX.toFixed(6);
             var centerY=((maxY+minY)/2).toFixed(6);
             //centerY=centerY.toFixed(6);
             if(result===""){
                 result+=centerX+","+centerY;
             }else{
                 result+="#"+centerX+","+centerY;
             }
         }
         return result;
     };
 };

 RootTool.Extend(RootMap,BDMap);

