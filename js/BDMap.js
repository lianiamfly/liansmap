// 说明：百度地图封装包
// 作者：闫杰
// 时间：2016-02-19 17：49
// 注意：新增的参数和功能在后面加，不能修改之前的设计，哪怕设计的很烂！

// 地图对象
var map;
// 覆盖物数组
var overlays = [];
// 鼠标绘制工具
var drawingManager;
// 旧的面填充颜色
var oldPolygonFillColor = "";
// 定时器变量
var timerObj;
// 业务面的数组
var arrYeWPolygon = [];
//业务点的数组
var arrYeWPoints=[];
// 全景图对象
var panorama;
// 全景图现在的经度
var panoramaX = 0;
// 全景图现在的纬度
var panoramaY = 0;
// 是否显示全景图
var isShowQuanJ = false;
// key
var bdMapKey = "8ImTLXDyO2Evzpk0dYF8sPS2pkDTGysU";
//第三方版权控件
var copyright;
//城市选择控件
var citySelectControl;
//全景图图层
var quanJTileLayer;
//全景图控件
var quanJTileControl;
//地图切换控件
var switchControl;
//驾车路径规划类
var driving;

// 百度地图的授权信息
function GetBDSN()
{
	var str = "http://api.map.baidu.com/api?v=2.0&ak=" + bdMapKey + "&callback=InitMap";
	//alert(str);
	return str;
}// end function

// 创建地图CreateMap
// isEnableMapClick：是否能点击地图
// fun：回调函数
function CreateMap(isEnableMapClick)
{
    //<script type="text/javascript" src="http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>
    

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + bdMapKey + "&callback=InitMap(" + isEnableMapClick + ")";
    document.body.appendChild(script);
}// end function

// 初始化地图InitMap
// isEnableMapClick：是否能点击地图
// fun：回调函数
function InitMap(isEnableMapClick)
{
    var scriptC = document.createElement("script");
    scriptC.type = "text/javascript";
    scriptC.src = "http://api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js";
    document.body.appendChild(scriptC);

    var TextIconOverlay = document.createElement("script");
    TextIconOverlay.type = "text/javascript";
    TextIconOverlay.src = "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js";
    document.body.appendChild(TextIconOverlay);

    var MarkerClusterer = document.createElement("script");
    MarkerClusterer.type = "text/javascript";
    MarkerClusterer.src = "http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js";
    document.body.appendChild(MarkerClusterer);

    // 创建Map实例
	map = new BMap.Map("allmap", { enableMapClick: isEnableMapClick });
	// 创建点坐标 默认在小店范围
	//var point = new BMap.Point(112.583758,37.8238);
	//map.centerAndZoom(point, 15);
	var point = new BMap.Point(112.571757,37.798085);
	map.centerAndZoom(point, 13);
	// 启用滚轮放大缩小
	map.enableScrollWheelZoom();
	//alert(abc);
	
	// 控件
	map.addControl(new BMap.NavigationControl({ 
		offset: new BMap.Size(0, 100),
		anchor: BMAP_ANCHOR_TOP_RIGHT
	}));    
	map.addControl(new BMap.ScaleControl());    
	map.addControl(new BMap.OverviewMapControl());    
	map.addControl(new BMap.MapTypeControl({
		type: BMAP_MAPTYPE_CONTROL_DROPDOWN,
		mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP]
	}));  
	
	if(typeof(InitYeW) == "function")
	{
		InitYeW();
	}
	
	
	if(typeof(mapContextMenu) == "function")
	{
//		var contextMenu = new BMap.ContextMenu();
//        contextMenu.addItem(new BMap.MenuItem('添加部件', mapContextMenu));
//		map.addContextMenu(contextMenu);
		mapContextMenu();
	}
	// 附加风格
//	var  mapStyle = {
//		features: ["road","building","water","land"], // 隐藏地图上的poi
//		style : "dark" // 设置地图风格为高端黑
//		}
//	map.setMapStyle(mapStyle);
	
	// 全景图
	// 全景图图层
    //map.addTileLayer(new BMap.PanoramaCoverageLayer());
    panorama = new BMap.Panorama('allmap');
    panorama.setPov({ heading: -40, pitch: 6 });
    
    // 事件
    if(typeof(mapClickHandler) === "function")
	{
    	map.addEventListener("click", mapClickHandler);
	}
    	
}// end function

// 地图点击事件 *
function MapClickEvent()
{
    // 单击获取点击的经纬度
    map.addEventListener("click", function (e)
    {
    	// 从经纬度得到地址
    	var address = getAddressFromXY(e.point.lng, e.point.lat);
        var curPos = e.point.lng + "," + e.point.lat;
        
        if(typeof(YeWGetXY) == "function")
		{
        	YeWGetXY(curPos);
		}
        
        if(typeof(YeWInitClick) == "function")
		{
        	YeWInitClick(e);
		}
        
    });
}// end function

// 设置鼠标形状
function setDefaultCursor(type)
{
	if(map != undefined && map != null)
	{
		var str = "pointer";
		switch(type)
		{
			case 1:
				str = "pointer";
				break;
			default:
				break;
		}
		
		map.setDefaultCursor(str);
	}
	
}// end function

// 删除自定义覆盖物
function ClearCustomOverlay()
{
    for (var i = 0; i < overlays.length; i++)
    {
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}

// 删除覆盖物数组
function ClearCustomOverlay(arrOverlay)
{
    for (var i = 0; i < arrOverlay.length; i++)
    {
        map.removeOverlay(arrOverlay[i]);
    }
}

// 删除全部覆盖物
function ClearAllOverlay()
{
	map.clearOverlays();
}

// 移除某覆盖物
function clearOverlayObj(overlay)
{
	map.removeOverlay(overlay);
}

// 初始化绘制工具
function InitDrawingManager()
{
    var styleOptions = {
        strokeColor: "#000000",		// 边线颜色。
        //fillColor: "",      		// 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2,			// 边线的宽度，以像素为单位。
        strokeOpacity: 1,			// 边线透明度，取值范围0 - 1。
    	fillOpacity: 0.5,			// 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid'		// 边线的样式，solid或dashed。
    }
    
    // 实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_LEFT, //位置
            offset: new BMap.Size(200, 200), //偏离值
            scale: 0.7 //工具栏缩放比例
            //drawingModes: [BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_RECTANGLE, BMAP_DRAWING_MARKER, BMAP_DRAWING_CIRCLE]
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);

}// end function
    
// 绘制完成事件
var overlaycomplete = function (e)
{
	var arrCustomPoint = [];
	
	if(e.drawingMode == "polyline" || e.drawingMode == "polygon")
	{
		var arrOri = e.overlay.getPath();
		for(var i=0; i<arrOri.length; i++)
		{
			var cp = new CustomPoint(arrOri[i].lng, arrOri[i].lat);
			arrCustomPoint.push(cp);
		}
	}
	
	// 业务的绘制完成事件
	if(typeof(YeWDrawComplete) == "function")
	{
		YeWDrawComplete(e.overlay, arrCustomPoint,e.drawingMode);
	}
	
	// 存入数组
    //overlays.push(e.overlay);

};

// 自定义经纬度类
function CustomPoint(x, y)
{
	this.x = x;
	this.y = y;
}

// 计算面积 平方米
function CalcArea(arrData)
{
	var pts = [];
	
	if(arrData.length == 0)
	{
		return 0;
	}

//	if(data == "")
//	{
//		return 0;
//	}
	
//	var arrFirst = data.split(";");
//	for (var i = 0; i < arrFirst.length; i++)
//	{
//	    if (arrFirst[i] != "")
//	    {
//	    	var arrSecond = arrFirst[i].split(",");
//	    	if(arrSecond.length == 2)
//    		{
//    			var pt1 = new BMap.Point(arrSecond[0], arrSecond[1]);
//    			pts.push(pt1);
//    		}
//	    }
//	}
	
	for(var i=0; i<arrData.length; i++)
	{
		var pt = new BMap.Point(arrData[i].x, arrData[i].y);
		pts.push(pt);
	}
	
//	// 试试闭合区域
//	var ptEnd = new BMap.Point(arrData[0].x, arrData[0].y);
//	pts.push(ptEnd);
	    
	var area = BMapLib.GeoUtils.getPolygonArea(pts);
	alert(area + "平方米");
	
	return area.toFixed(2);
}// end function

// 计算面积 平方米
function CalcArea2(arrData)
{
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
    
    //alert(area.toFixed(2) + "平方米");
    if(isNaN(area)){
    	return 0;
    }else{
    	return area.toFixed(2);
    }
}// end function

// 画点 offset：X正=往右移，y正=往下移
function drawPoint(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, isPosition, offsetX, offsetY, tipContent, dirction, labelText, labelXOffset, labelyOffset)
{
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
	
	// 旋转角度
	if(dirction!=undefined && dirction!=null && dirction.length>0)
	{
		marker.setRotation(dirction);
	}
	
	// 定位
	if(isPosition)
	{
		//alert("定位");
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
					 //lineHeight : "20px",
					 fontFamily:"宋体",
					 borderColor: "black"
				 });
				marker.setLabel(label);
	}
	
	//添加右键菜单
	if(typeof(deleteHandler)==="function"){
		var contextMenu = new BMap.ContextMenu();
        contextMenu.addItem(new BMap.MenuItem('删除当前点', deleteHandler));
        marker.addContextMenu(contextMenu);
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

	//marker.addEventListener("click", polygonClickEvent);
	marker.addEventListener("click", commonOverlayClickEvent);
	
	
	// 移上去显示暂不考虑 效果不好，位置不在鼠标的位置
	//marker.addEventListener("mouseover", polygonClickEvent);
	
	return marker;
}// end function


//画点 offset：X正=往右移，y正=往下移
function drawPointWithCM(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, isPosition, offsetX, offsetY, tipContent, dirction, labelText, labelXOffset, labelyOffset)
{
	var offset;
	if(offsetX != undefined  && offsetY != undefined)
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
	
	// 旋转角度
	if(dirction!=undefined && dirction!=null && dirction.length>0)
	{
		marker.setRotation(dirction);
	}
	
	// 定位
	if(isPosition)
	{
		//alert("定位");
		map.centerAndZoom(pt, 18);
	}
	
	// 文字
	if (Text != undefined && labelText != null)
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
					 //lineHeight : "20px",
					 fontFamily:"宋体",
					 borderColor: "black"
				 });
				marker.setLabel(label);
	}
	
	//添加右键菜单
	if(typeof(markerCMHandler)==="function"){
		markerCMHandler(marker);
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

	//marker.addEventListener("click", polygonClickEvent);
	marker.addEventListener("click", commonOverlayClickEvent);
	
	
	// 移上去显示暂不考虑 效果不好，位置不在鼠标的位置
	//marker.addEventListener("mouseover", polygonClickEvent);
	
	return marker;
}// end function
// 画线，通用drawPolyline
// 示例：
// var pts = [];
// var pt1 = new CustomPoint(112.55706, 37.877168);
// pts.push(pt1);
// var pt2 = new CustomPoint(112.576728, 37.82985);
// pts.push(pt2);
// drawPolyline("1", pts, "#000000", 3, 0.5, "", 0, 0);
function drawPolyline(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
	polyline.id = id;
	
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function

function drawPolylineHasContextMenu(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
	polyline.id = id;
	
	//添加右键菜单
	if(typeof(polylineOpenMesurenHandler)==="function"){
		var contextMenu = new BMap.ContextMenu();
        contextMenu.addItem(new BMap.MenuItem('打开测量工具', polylineOpenMesurenHandler));
        polyline.addContextMenu(contextMenu);
	}
	
	
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function


function drawPolylineWithCM(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight,strokeStyle,name)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	var lx,ly;
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
		if(i===0){
			lx=data[i].x;
			ly=data[i].y;
		}
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity,strokeStyle:strokeStyle});
	polyline.id = id;
	polyline.name=name;
	
	// 文字
//	var pt= new BMap.Point(lx, ly)
//	if(name != undefined && name != null)
//	{
//		var opts = {
//				  position : pt,    										// 指定文本标注所在的地理位置
//				  offset   : new BMap.Size(23, 3)		// 设置文本偏移量
//				}
//				// 创建文本标注对象
//				var label = new BMap.Label(name, opts);
//				label.setStyle({
//					 color : "black",
//					 fontSize : "12px",
//					 height : "18px",
//					 //lineHeight : "20px",
//					 fontFamily:"宋体",
//					 borderColor: "black"
//				 });
//				polyline.setLabel(label);
//	}
	
	//添加右键菜单
	if(typeof(polylineCMHandler)==="function"){
		polylineCMHandler(polyline);
	}
	
	if(typeof(polylineMouseOverHandler)==="function"){
		polyline.addEventListener("mouseover", polylineMouseOverHandler);
	}
	
	if(typeof(polylineMouseOutHandler)==="function"){
		polyline.addEventListener("mouseout", polylineMouseOutHandler);
	}
	
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function
// 画Polygon
function drawPolygon(data, strokeColor, strokeWeight, strokeOpacity, fillOpacity,strokeStyle,fillColor)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}

	var polygon = new BMap.Polygon(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity,fillColor:fillColor, fillOpacity:fillOpacity,strokeStyle:strokeStyle});
	//var polygon = new BMap.Polygon(arr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
	if(typeof(polygonCMHandler)==="function"){
		polygonCMHandler(polygon);
	}
	map.addOverlay(polygon);

	return polygon;
}

// 画Polygon
function drawPolygon2(id, data, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, tipUrl, tipWidth, tipHeight)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}

	var polygon = new BMap.Polygon(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity, fillColor:fillColor, fillOpacity:fillOpacity});
	polygon.id = id;
	//alert(id);
	map.addOverlay(polygon);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polygon.tipUrl = tipUrl;
		polygon.tipWidth = tipWidth;
		polygon.tipHeight = tipHeight;
		polygon.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}

	return polygon;
}// end function

// 画Polygon，坐标不用处理
function drawPolygon3(id, data, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, tipUrl, tipWidth, tipHeight)
{
	if(data.length == 0)
	{
		return;
	}

	var polygon = new BMap.Polygon(data, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity, fillColor:fillColor, fillOpacity:fillOpacity});
	polygon.id = id;
	//alert(id);
	map.addOverlay(polygon);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polygon.tipUrl = tipUrl;
		polygon.tipWidth = tipWidth;
		polygon.tipHeight = tipHeight;
		polygon.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}

	return polygon;
}// end function

// 画圆drawCircle，通用
// x				String		
// y				String		
// tipUrl			String		弹出框路径
// tipWidth			String		弹出框宽度
// tipHeight		String		弹出框高度
// radius			number		半径，单位为米
// strokeColor 		String 		圆形边线颜色。
// fillColor 		String 		圆形填充颜色。当参数为空时，圆形将没有填充效果。
// strokeWeight 	Number 		圆形边线的宽度，以像素为单位。
// strokeOpacity 	Number 		圆形边线透明度，取值范围0 - 1。
// fillOpacity 		Number 		圆形填充的透明度，取值范围0 - 1。
// strokeStyle 		String 		圆形边线的样式，solid或dashed。
// enableMassClear 	Boolean 	是否在调用map.clearOverlays清除此覆盖物，默认为true。
// enableEditing 	Boolean 	是否启用线编辑，默认为false。
// enableClicking 	Boolean 	是否响应点击事件，默认为true。
function drawCircle(x, y, radius, tipUrl, tipWidth, tipHeight, strokeColor, fillColor, strokeWeight, strokeOpacity, fillOpacity, strokeStyle, enableMassClear, enableEditing, enableClicking)
{
	var pt = new BMap.Point(x, y);
	// 圆
	var overlay = new BMap.Circle(pt, radius, {strokeColor:strokeColor, fillColor:fillColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity, fillOpacity:fillOpacity, strokeStyle:strokeStyle, enableMassClear:enableMassClear, enableEditing:enableEditing, enableClicking:enableClicking});
	map.addOverlay(overlay);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		overlay.tipUrl = tipUrl;
		overlay.tipWidth = tipWidth;
		overlay.tipHeight = tipHeight;
		overlay.addEventListener("click", commonOverlayClickEvent);
	}
	
	return overlay;
}// end function

// Polygon click事件
function polygonClickEvent(e)
{    
	//alert(e.point.lng + "," + e.point.lat);
	var overlay = e.target;
	//alert(overlay.id);
	var id = overlay.id;
	var tipUrl = overlay.tipUrl;
	var tipWidth = overlay.tipWidth;
	var tipHeight = overlay.tipHeight;
	if(tipUrl != undefined && tipUrl != "")
	{
		$.ajax({
			type : 'post',
			url : tipUrl,
			dataType : 'text',
			data : "id=" + id,
			success : function(msg)
			{
				//alert(msg);
	
				// 显示弹出框
				showTip(e.point.lng, e.point.lat, msg, tipWidth, tipHeight);
			}// end success
		});// end ajax
	}// end if
	
}// end function

// Polygon over事件
function polygonOverEvent(e)
{
	//alert(e.point.lng + "," + e.point.lat);
	var overlay = e.target;
	
	// 非所定下执行
	if(overlay.myType != 1)
	{
		// 高亮
		oldPolygonFillColor = overlay.getFillColor();
		overlay.setFillColor("#7BCFA6");
	}

}// end function

// Polygon out事件
function polygonOutEvent(e)
{
	//alert(e.point.lng + "," + e.point.lat);
	var overlay = e.target;
	
	// 非所定下执行
	if(overlay.myType != 1)
	{
		// 恢复
		overlay.setFillColor(oldPolygonFillColor);
	}
	
}// end function

// 显示弹出框：手表点击
function showTip(x, y, data, tipWidth, tipHeight)
{
	var opts = {
	  width : tipWidth,		// 信息窗口宽度
	  height: tipHeight,	// 信息窗口高度
	  title : "" ,			// 信息窗口标题
	  enableMessage : true,	// 设置允许信息窗发送短息
	  message : ""
	}
	// 创建信息窗口对象 
	var infoWindow = new BMap.InfoWindow(data, opts);
	// 开启信息窗口
	map.openInfoWindow(infoWindow, new BMap.Point(x, y));
}// end function

// 手动显示弹出框：程序调用。示例：showTipManual(data[0].id, data[0].x, data[0].y, "${bp}/map/getOneHWShSh", 400, 210);
function showTipManual(id, x, y, tipUrl, tipWidth, tipHeight, tipMsg)
{
	if(tipUrl != undefined && tipUrl != "") // 有网址读网址的数据
	{
		$.ajax({
			type : 'post',
			url : tipUrl,
			dataType : 'text',
			data : "id=" + id,
			success : function(msg)
			{
				// 显示弹出框
				showTip(x, y, msg, tipWidth, tipHeight);
			}// end success
		});// end ajax
	}
	else // 没网址读静态字符串
	{
		// 显示弹出框
		showTip(x, y, tipMsg, tipWidth, tipHeight);
	}	

}// end function

// 更新点的位置
function updateMarkerPos(marker, x, y)
{
	if(marker != undefined)
	{
		marker.setPosition(new BMap.Point(x, y));
	}
}// end function

// 更新点的图标
function updateMarkerIcon(marker, url, width, height)
{
	if(marker != undefined)
	{
		marker.setIcon(new BMap.Icon(url, new BMap.Size(width, height)));
	}
}// end function

// 更新面的样式 type=1锁定，type=2解锁
function updatePolygonStyle(marker, strokeColor, strokeWeight, fillColor, type)
{
	if(marker != undefined)
	{
		marker.setStrokeColor(strokeColor);
		marker.setStrokeWeight(strokeWeight);
		marker.setFillColor(fillColor);
		marker.myType = type;
	}
}// end function

// 返回面的第一个点
function getPolygonFirstPoint(marker)
{
	var result = new CustomPoint(0, 0);
	
	if(marker != undefined)
	{
		var arrPoint = marker.getPath();
		if(arrPoint.length >=1)
		{
			result.x = arrPoint[0].lng;
			result.y = arrPoint[0].lat;
		}
	}
	
	return result;
}// end function

// 定位中点
function setCenter(x, y)
{
	if(x != 0 && y != 0)
	{
		map.setCenter(new BMap.Point(x, y));
	}// end if
}

// 定位中点，控制等级
function centerAndZoom(x, y, level)
{
	if(x != 0 && y != 0)
	{
		map.centerAndZoom(new BMap.Point(x, y), level);
	}// end if
}

// 根据经纬度得到地址
function getAddressFromXY(x, y)
{
	var geoc = new BMap.Geocoder();
	var point = new BMap.Point(x, y);
	geoc.getLocation(point, function(rs)
	{
		var addComp = rs.addressComponents;
		//alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		
		var address = addComp.province + "" + addComp.city + "" + addComp.district + "" + addComp.street + "" + addComp.streetNumber;
        if(typeof(YeWXYGetAddress) == "function")
		{
        	YeWXYGetAddress(address);
        	
		}
	});
}// end function

// 根据地址得到经纬度
function getXYFromAddress(cityName, address)
{
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
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
}// end function

// 设置Zoom
function setZoom(number)
{
	map.setZoom(number);
}

// Marker显示
function showMarker(marker)
{
	if(marker != undefined)
	{
		marker.show();
	}
}

// Marker隐藏
function hideMarker(marker)
{
	if(marker != undefined)
	{
		marker.hide();
	}
}

// 让某数组的点全部隐藏
function hideArrayMarker(arrOverlay)
{
    for (var i = 0; i < arrOverlay.length; i++)
    {
        hideMarker(arrOverlay[i])
    }
}// end function

// 关闭在地图上打开的信息窗口。在标注上打开的信息窗口也可通过此方法进行关闭。
function closeInfoWindow()
{
	map.closeInfoWindow();
}

// 增加点的跳动效果setMarkerAnimationBOUNCE
function setMarkerAnimationBOUNCE(marker)
{
	if(marker != undefined && marker != null)
	{
		marker.setAnimation(BMAP_ANIMATION_BOUNCE);
	}
	
}// end function

// 增加点的坠落效果setMarkerAnimationDROP
function setMarkerAnimationDROP(marker)
{
	if(marker != undefined && marker != null)
	{
		marker.setAnimation(BMAP_ANIMATION_DROP);
	}
	
}// end function

// 动画流向dynamicFlow
function dynamicFlow(x1, y1, x2, y2, imgUrl, imgWidth, imgHeight, offsetX, offsetY)
{
	x1 *= 1;
	y1 *= 1;
	x2 *= 1;
	y2 *= 1;
	
	// 起点
	var startPt = drawPoint("1", x1, y1, imgUrl, imgWidth, imgHeight, "", 0, 0, false, offsetX, offsetY);
	
	var addX = (x2-x1) / 100;
	var addY = (y2-y1) / 100;
	
	var tempX = x1;
	var tempY = y1;
	
	var index = 0;
	
	// 定时器实例化
	timerObj = setInterval(function()
	{
		tempX += addX;
		tempY += addY;
		//if(tempX < x2 && tempY > y2)
		if(index > 100)
		{
			tempX = x1;
			tempY = y1;
			
			index = 0;
		}
		updateMarkerPos(startPt, tempX, tempY);
		
		index++;
	}, 50);
	
}// end function

// 显示全景图,直接根据坐标显示全景图,根据坐标定位
function showQuanJT(x,y)
{
	// 太原
	 x =(x!==undefined&&x!==null&&x!=="")?x: 112.571757;
	 y = (y !== undefined && y !== null && y !== "") ? y : 37.798085;
	
    // 根据经纬度坐标展示全景图
    panorama.setPosition(new BMap.Point(x, y));
    panorama.setPov({ heading: 0, pitch: 6 });
    
    /*
    // 设置标注点的经纬度位置和高度
    var labelPosition = new BMap.Point(x, y);
    var labelOptions = {
        position: labelPosition,
        altitude: 5
    };
    var label = new BMap.PanoramaLabel(quanJText, labelOptions);

    // 在全景地图里添加该标注
    panorama.addOverlay(label);
    // 给标注点注册点击事件
    label.addEventListener('click', function() 
    {
        alert(tipText);
    });
    */
    
    // 显示全景
    isShowQuanJ = true;
    
}// end function

// 显示地图
function showMap()
{
    location.reload();
    
	// 不显示全景
    isShowQuanJ = false;
}// end function

// 全景图定位
function panoramaPos(x, y)
{
	//alert(panoramaX + "," + panoramaY);
	if(x==0 && x==0)
	{
		parent.$.sysNoty.error('请在列表中选择。');
		return;
	}
	
    // 根据经纬度坐标展示全景图
    panorama.setPosition(new BMap.Point(x, y));
    panorama.setPov({ heading: 0, pitch: 6 });
    	
}

/////////////////////////////////
// 进一层抽象
/////////////////////////////////

// 画面，经典
function drawPolygonCustom(id, data, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, tipUrl, tipWidth, tipHeight, tipContent)
{
	if(data.length == 0)
	{
		return;
	}
	
	var polygon = new BMap.Polygon(data, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity, fillColor:fillColor, fillOpacity:fillOpacity});
	polygon.id = id;
	map.addOverlay(polygon);
	
	polygon.tipUrl = tipUrl;
	polygon.tipWidth = tipWidth;
	polygon.tipHeight = tipHeight;
	polygon.tipContent = tipContent;
	polygon.addEventListener("click", commonOverlayClickEvent);
	//polygon.addEventListener("mouseover", polygonOverEvent);
	//polygon.addEventListener("mouseout", polygonOutEvent);

	return polygon;
}// end function

// 通用的覆盖物click事件
function commonOverlayClickEvent(e)
{    
	var overlay = e.target;
	
	var id = overlay.id;
	var tipUrl = overlay.tipUrl;
	if(tipUrl == undefined)
	{
		tipUrl = "";
	}
	var tipWidth = overlay.tipWidth;
	var tipHeight = overlay.tipHeight;
	var tipContent = overlay.tipContent;
	if(tipContent == undefined)
	{
		tipContent = "";
	}
	
	// 业务回调函数
	if(typeof(YeWOverlayClick) == "function")
	{
		YeWOverlayClick(id, e.point.lng, e.point.lat);
	}
	
	if(tipContent == "" && tipUrl != "") // 根据url查询
	{
		$.ajax({
			type : 'post',
			url : tipUrl,
			dataType : 'text',
			data : "id=" + id,
			success : function(msg)
			{
				// 显示弹出框
				showTip(e.point.lng, e.point.lat, msg, tipWidth, tipHeight);
			}// end success
		});// end ajax
	}// end if
	else if(tipContent != "" && tipUrl == "")
	{
		// 显示弹出框
		showTip(e.point.lng, e.point.lat, tipContent, tipWidth, tipHeight);
	}
	
}// end function

// 查询业务显示面
// showType：显示类型，0=不做任何操作，1=删除全部覆盖物，2=删除自身覆盖物
function showYeWPolygon(showType, yeWUrl, tipUrl, tipWidth, tipHeight)
{
//	var date1 = new Date();
	
	// 处理显示类型
	switch(showType)
	{
	case 1:
		ClearAllOverlay();
		break;
	case 2:
		ClearCustomOverlay(arrYeWPolygon);
		break;
	}
	
	//var param = "param1=" + param1 + "&param2=" + param2;
	$.ajax({
		type : 'post',
		url : yeWUrl,
		dataType : 'text',
		//dataType : 'json',
		//data : param,
		success : function(msg)
		{
			if(msg != "" || msg != "[]")
			{
				var data = $.parseJSON(msg);
				for(var i=0; i<=data.length; i++)
				{
					var cur = data[i];
					//alert(cur.coors);
					if(cur == undefined)
					{
						break;
					}

				    var arrJingH = cur.coors.split("#");
					for(var i2 = 0; i2 < arrJingH.length; i2++)
					{
					    if (arrJingH[i2] != "")
					    {
							// 每个#是一个区域
					    	var arrCoors = [];
					    	
					    	var arrFenH = arrJingH[i2].split(";");
							for(var j = 0; j < arrFenH.length; j++)
							{
							    if (arrFenH[j] != "")
							    {
							    	var arrDouH = arrFenH[j].split(",");
								    if(arrDouH != undefined && arrDouH.length == 2)
								    {
								    	var pt = new BMap.Point(arrDouH[0], arrDouH[1]);
								    	arrCoors.push(pt);
								    }// end if
							    }// end if
							}// end for
							
							var id = (cur.id!=undefined&&cur.id!="") ? cur.id : "1";
							//var data = arrCoors;
							var strokeColor = (cur.strokeColor!=undefined&&cur.strokeColor!="") ? cur.strokeColor : "#000000";
							var strokeWeight = (cur.strokeWeight!=undefined&&cur.strokeWeight!="") ? cur.strokeWeight : 1;
							var strokeOpacity = (cur.strokeOpacity!=undefined&&cur.strokeOpacity!="") ? cur.strokeOpacity : 1;
							var fillColor = (cur.fillColor!=undefined&&cur.fillColor!="") ? cur.fillColor : "#808080";
							var fillOpacity = (cur.fillOpacity!=undefined&&cur.fillOpacity!="") ? cur.fillOpacity : "0.5";
							//var tipUrl = "";
							var tipWidth = (cur.tipWidth!=undefined&&cur.tipWidth!="") ? cur.tipWidth : "0";
							var tipHeight = (cur.tipHeight!=undefined&&cur.tipHeight!="") ? cur.tipHeight : "0";
							var tipContent = (cur.tipContent!=undefined&&cur.tipContent!="") ? cur.tipContent : "";
							
							// 画面
							var overlay = drawPolygonCustom(id, arrCoors, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, tipUrl, tipWidth, tipHeight, tipContent);
							arrYeWPolygon.push(overlay);
					    }// end if(arrJingH[i2] != "")
					}// end for(var i2 = 0; i2 < arrJingH.length; i2++)
				}// end for(var i=0; i<=data.length; i++)
				
//				date2 = new Date(); // 结束时间
//				var dateTemp1 = date2.getTime()-date1.getTime(); // 时间差的毫秒数
//				var log1 = "读取并绘制面的时间：" + dateTemp1 + "毫秒";
//				console.log(log1);

			}// end if(msg != "" || msg != "[]")
		}// end success
	});// end ajax

}// end function

/////////////////////////////////
// 其它
/////////////////////////////////

// setTab
// 弹出框的Tab样式
function setTab(m, n)
{
    var tli = document.getElementById("menu" + m).getElementsByTagName("li");
    var mli = document.getElementById("main" + m).getElementsByTagName("ul");
    for (i = 0; i < tli.length; i++)
    {
        tli[i].className = i == n ? "hover" : "";
        mli[i].style.display = i == n ? "block" : "none";
    }
}

// updateMarkerRotation
// 改变点的旋转角度
function updateMarkerRotation(marker, number)
{
	if(marker!=undefined && marker!=null)
	{
		if(number!=undefined && number!=null)
		{
			// 旋转角度
			marker.setRotation(number);
		}
	}

}// end function

// 补位函数，如果传入数字小于10，数字前补一位0
function extra(x)
{
	var x = x * 1;
    if(x < 10)
    {
        return "0" + x;
    }
    else
    {
        return x;
    }
}

// 自动完成
var g_AutoCompleteValue = "";
function AutoComplete(id)
{
    // 建立一个自动完成的对象
    var ac = new BMap.Autocomplete(
	{
	    "input": id
		, "location": map
	});
	
	/*
    ac.addEventListener("onhighlight", function (e)
    {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1)
        {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1)
        {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        //G("searchResultPanel").innerHTML = str;
        alert(str);
    });
    */

    ac.addEventListener("onconfirm", function (e)
    {
        // 鼠标点击下拉列表后的事件
        var _value = e.item.value;
        g_AutoCompleteValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        var str = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + g_AutoCompleteValue;
		//alert(str);
		
        AutoCompleteConfirm();
    });
    
}// end function

// 自动完成回车结果
function AutoCompleteConfirm()
{
    //清除地图上所有覆盖物
    //map.clearOverlays();
	
	// 删除全部覆盖物
	ClearAllOverlay();
	
    function myFun()
    {
        // 获取第一个智能搜索的结果
        var pp = local.getResults().getPoi(0).point;
        map.centerAndZoom(pp, 17);
        // 添加标注
        map.addOverlay(new BMap.Marker(pp));
        if(typeof(getLocationShow)==="function"){
        	getLocationShow(pp);
        }
    }
	
    var local = new BMap.LocalSearch(map, 
    {
    	// 智能搜索
        onSearchComplete: myFun
    });
    local.search(g_AutoCompleteValue);
    
    
}// end function

function CreateMapLimitZoom(min,max,isEnableMapClick)
{
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + bdMapKey + "&callback=InitMapLimitZoom(" + min+","+max+","+isEnableMapClick + ")";
    document.body.appendChild(script);
    //alert(abc);
}// end function

// 初始化地图InitMap
// isEnableMapClick：是否能点击地图
// fun：回调函数
function InitMapLimitZoom(min,max,isEnableMapClick)
{
    // 创建Map实例
	map = new BMap.Map("allmap", { enableMapClick: isEnableMapClick });
	// 创建点坐标 默认在小店范围
	//var point = new BMap.Point(112.583758,37.8238);
	//map.centerAndZoom(point, 15);
	map.setMinZoom(min);
	map.setMaxZoom(max);
	var point = new BMap.Point(112.571757,37.798085);
	map.centerAndZoom(point, min);
	// 启用滚轮放大缩小
	map.enableScrollWheelZoom();
	//alert(abc);
	
	// 控件
	map.addControl(new BMap.NavigationControl({ 
		offset: new BMap.Size(0, 100),
		anchor: BMAP_ANCHOR_TOP_LEFT
	}));    
	map.addControl(new BMap.ScaleControl());    
	map.addControl(new BMap.OverviewMapControl());    
	map.addControl(new BMap.MapTypeControl({
		type: BMAP_MAPTYPE_CONTROL_DROPDOWN,
		mapTypes: [BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP],
		anchor: BMAP_ANCHOR_TOP_LEFT
	}));  

    // 地图拖动后更改后触发
	map.addEventListener("dragend", PanEvent);
    // 地图缩放级别更改后触发
	map.addEventListener("zoomend", ZoomEvent);
	
	if(typeof(InitYeW) == "function")
	{
		InitYeW();
	}
	
	// 附加风格
//	var  mapStyle = {
//		features: ["road","building","water","land"], // 隐藏地图上的poi
//		style : "dark" // 设置地图风格为高端黑
//		}
//	map.setMapStyle(mapStyle);
	
	// 全景图
	// 全景图图层
    //map.addTileLayer(new BMap.PanoramaCoverageLayer());
    panorama = new BMap.Panorama('allmap');
    panorama.setPov({ heading: -40, pitch: 6 });
	
}// end function

//得到地图当前边界
function GetCurBounds()
{
    var param = null;

    if (map != null)
    {
        var bounds = map.getBounds();
        var param = new CommonBounds(bounds.getSouthWest().lng, bounds.getNorthEast().lat, bounds.getNorthEast().lng, bounds.getSouthWest().lat);
    }

    return param;
};

//平移
function PanEvent()
{
    var param = GetCurBounds();

    // 调用控制层的：地图平移、缩放后触发
    if (typeof(PanZoomChangeEventHandler)==="function"&&PanZoomChangeEventHandler != null)
    {
        PanZoomChangeEventHandler(param);
    }

};

// 缩放
function ZoomEvent()
{
    var param = GetCurBounds();

    // 调用控制层的：地图缩放级别更改后触发
    if (typeof(zoomchangeEventHandler)==="function"&&zoomchangeEventHandler != null)
    {
        zoomchangeEventHandler(param);
    }
    // 调用控制层的：地图平移、缩放后触发
    if (typeof(PanZoomChangeEventHandler)==="function"&&PanZoomChangeEventHandler != null)
    {
        PanZoomChangeEventHandler(param);
    }

};


function GetZoom()
{
    return map.getZoom();
};// end function

function CommonBounds(x1, y1, x2, y2)
{
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}// end function

//画点 offset：X正=往右移，y正=往下移
function drawPointNoCM(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, isPosition, offsetX, offsetY, tipContent, dirction, labelText, labelXOffset, labelyOffset)
{
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
	marker.name=labelText;
	
	// 旋转角度
	if(dirction!=undefined && dirction!=null && dirction.length>0)
	{
		marker.setRotation(dirction);
	}
	
	// 定位
	if(isPosition)
	{
		//alert("定位");
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
					 //lineHeight : "20px",
					 fontFamily:"宋体",
					 borderColor: "black"
				 });
				marker.setLabel(label);
	}
	
	//添加右键菜单
	if(typeof(markerCMHandler)==="function"){
		markerCMHandler(marker);
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

	//marker.addEventListener("click", polygonClickEvent);
	marker.addEventListener("click", commonOverlayClickEvent);
	
	if(typeof(mapmouseOver)==="function"){
		marker.addEventListener("mouseover",mapmouseOver);
	}
	if(typeof(mapmouseOut)==="function"){
		marker.addEventListener("mouseout",mapmouseOut);
	}
	// 移上去显示暂不考虑 效果不好，位置不在鼠标的位置
	//marker.addEventListener("mouseover", polygonClickEvent);
	
	return marker;
}// end function

function drawPolylineNoCM(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight,strokeStyle,name)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity,strokeStyle:strokeStyle});
	polyline.id = id;
	polyline.id = name;
	
	
	if(typeof(mapmouseOver)==="function"){
		polyline.addEventListener("mouseover",mapmouseOver);
	}
	if(typeof(mapmouseOut)==="function"){
		polyline.addEventListener("mouseout",mapmouseOut);
	}
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function

function drawPolygonNoCM(data, strokeColor, strokeWeight, strokeOpacity, fillOpacity,strokeStyle,name)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}

	var polygon = new BMap.Polygon(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity, fillOpacity:fillOpacity,strokeStyle:strokeStyle});
	//var polygon = new BMap.Polygon(arr, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
	polygon.name=name;
	if(typeof(mapmouseOver)==="function"){
		polygon.addEventListener("mouseover",mapmouseOver);
	}
	if(typeof(mapmouseOut)==="function"){
		polygon.addEventListener("mouseout",mapmouseOut);
	}
	map.addOverlay(polygon);

	return polygon;
}

//初始化绘制工具
function InitDrawingManager2()
{
    var styleOptions = {
        strokeColor: "#000000",		// 边线颜色。
        //fillColor: "",      		// 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 2,			// 边线的宽度，以像素为单位。
        strokeOpacity: 1,			// 边线透明度，取值范围0 - 1。
    	fillOpacity: 0.5,			// 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid'		// 边线的样式，solid或dashed。
    }
    
    // 实例化鼠标绘制工具
    drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(200, 200), //偏离值
            scale: 0.7, //工具栏缩放比例
            drawingModes: [BMAP_DRAWING_POLYLINE, BMAP_DRAWING_POLYGON, BMAP_DRAWING_MARKER]
        },
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions
    });
    
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete2);

}// end function

//计算面积 平方米
function CalcLength(arrData)
{
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

	var dis = BMapLib.GeoUtils.getPolylineDistance(pts);
    
    //alert(area.toFixed(2) + "平方米");
    if(isNaN(dis)){
    	return 0;
    }else{
    	return dis.toFixed(2);
    }
}// end function


//查询业务显示面
//showType：显示类型，0=不做任何操作，1=删除全部覆盖物，2=删除自身覆盖物
function showMatterPolygon(showType, yeWUrl, tipUrl, tipWidth, tipHeight)
{
//	var date1 = new Date();
	
	// 处理显示类型
	switch(showType)
	{
	case 0:
		{
			if(arrYeWPolygon.length>0){
				$.each(arrYeWPolygon,function(index,item){
					if(item!==null){
						arrYeWPolygon[index].hide();
					}
				});
			}
		}
//	case 1:
//		ClearAllOverlay();
//		break;
//	case 2:
//		ClearCustomOverlay(arrYeWPolygon);
//		break;
	}
	
	//var param = "param1=" + param1 + "&param2=" + param2;
	$.ajax({
		type : 'post',
		url : yeWUrl,
		dataType : 'text',
		//dataType : 'json',
		//data : param,
		success : function(msg)
		{
			if(msg != "" || msg != "[]")
			{
				var data = $.parseJSON(msg);
				if(data!==undefined&&data.length>0){
					for(var i=0; i<=data.length; i++)
					{
						var cur = data[i];
						//alert(cur.coors);
						if(cur == undefined)
						{
							break;
						}
						
						var hasValue=false;
						if(showType===0&&arrYeWPolygon.length>0){
							$.each(arrYeWPolygon,function(index,item){
								if(item!==null){
									if(item.id===cur.id){
										hasValue=true;
										arrYeWPolygon[index].show();
									}
								}
							});
						}
						
						if(hasValue){
							
						}else{
							if(cur.coors!==undefined&&cur.coors!==null&&cur.coors!==""){
								var arrJingH = cur.coors.split("#");
								for(var i2 = 0; i2 < arrJingH.length; i2++)
								{
								    if (arrJingH[i2] != "")
								    {
										// 每个#是一个区域
								    	var arrCoors = [];
								    	
								    	var arrFenH = arrJingH[i2].split(";");
										for(var j = 0; j < arrFenH.length; j++)
										{
										    if (arrFenH[j] != "")
										    {
										    	var arrDouH = arrFenH[j].split(",");
											    if(arrDouH != undefined && arrDouH.length == 2)
											    {
											    	var pt = new BMap.Point(arrDouH[0], arrDouH[1]);
											    	arrCoors.push(pt);
											    }// end if
										    }// end if
										}// end for
										
										var id = (cur.id!=undefined&&cur.id!="") ? cur.id : "1";
										//var data = arrCoors;
										var strokeColor = (cur.strokeColor!=undefined&&cur.strokeColor!="") ? cur.strokeColor : "#000000";
										var strokeWeight = (cur.strokeWeight!=undefined&&cur.strokeWeight!="") ? cur.strokeWeight : 1;
										var strokeOpacity = (cur.strokeOpacity!=undefined&&cur.strokeOpacity!="") ? cur.strokeOpacity : 1;
										var fillColor = (cur.fillColor!=undefined&&cur.fillColor!="") ? cur.fillColor : "#808080";
										var fillOpacity = (cur.fillOpacity!=undefined&&cur.fillOpacity!="") ? cur.fillOpacity : "0.5";
										//var tipUrl = "";
										var tipWidth = (cur.tipWidth!=undefined&&cur.tipWidth!="") ? cur.tipWidth : "0";
										var tipHeight = (cur.tipHeight!=undefined&&cur.tipHeight!="") ? cur.tipHeight : "0";
										var tipContent = (cur.tipContent!=undefined&&cur.tipContent!="") ? cur.tipContent : "";
										
										// 画面
										var overlay = drawPolygonCustom(id, arrCoors, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity, tipUrl, tipWidth, tipHeight, tipContent);
										arrYeWPolygon.push(overlay);
								    }// end if(arrJingH[i2] != "")
								}
							}
							
						}
					    // end for(var i2 = 0; i2 < arrJingH.length; i2++)
					}
					try{
						parent.$.sysNoty.success('网格区域加载完毕');
					}catch(err){
						
					}
				}
				// end for(var i=0; i<=data.length; i++)
				
//				date2 = new Date(); // 结束时间
//				var dateTemp1 = date2.getTime()-date1.getTime(); // 时间差的毫秒数
//				var log1 = "读取并绘制面的时间：" + dateTemp1 + "毫秒";
//				console.log(log1);

			}// end if(msg != "" || msg != "[]")
			
		}// end success
	});// end ajax

}// end function

//查询业务显示面 没有点击事件
//showType：显示类型，0=不做任何操作，1=删除全部覆盖物，2=删除自身覆盖物
function showMatterPolygon2(showType, yeWUrl, tipUrl, tipWidth, tipHeight)
{
//	var date1 = new Date();
	
	// 处理显示类型
	switch(showType)
	{
	case 0:
		{
			if(arrYeWPolygon.length>0){
				$.each(arrYeWPolygon,function(index,item){
					if(item!==null){
						arrYeWPolygon[index].hide();
					}
				});
			}
		}
//	case 1:
//		ClearAllOverlay();
//		break;
//	case 2:
//		ClearCustomOverlay(arrYeWPolygon);
//		break;
	}
	
	//var param = "param1=" + param1 + "&param2=" + param2;
	$.ajax({
		type : 'post',
		url : yeWUrl,
		dataType : 'text',
		//dataType : 'json',
		//data : param,
		success : function(msg)
		{
			if(msg != "" || msg != "[]")
			{
				var data = $.parseJSON(msg);
				if(data!==undefined&&data.length>0){
					for(var i=0; i<=data.length; i++)
					{
						var cur = data[i];
						//alert(cur.coors);
						if(cur == undefined)
						{
							break;
						}
						
						var hasValue=false;
						if(showType===0&&arrYeWPolygon.length>0){
							$.each(arrYeWPolygon,function(index,item){
								if(item!==null){
									if(item.id===cur.id){
										hasValue=true;
										arrYeWPolygon[index].show();
									}
								}
							});
						}
						
						if(hasValue){
							
						}else{
							if(cur.coors!==undefined&&cur.coors!==null&&cur.coors!==""){
								var arrJingH = cur.coors.split("#");
								for(var i2 = 0; i2 < arrJingH.length; i2++)
								{
								    if (arrJingH[i2] != "")
								    {
										// 每个#是一个区域
								    	var arrCoors = [];
								    	
								    	var arrFenH = arrJingH[i2].split(";");
										for(var j = 0; j < arrFenH.length; j++)
										{
										    if (arrFenH[j] != "")
										    {
										    	var arrDouH = arrFenH[j].split(",");
											    if(arrDouH != undefined && arrDouH.length == 2)
											    {
											    	var pt = new BMap.Point(arrDouH[0], arrDouH[1]);
											    	arrCoors.push(pt);
											    }// end if
										    }// end if
										}// end for
										
										var id = (cur.id!=undefined&&cur.id!="") ? cur.id : "1";
										//var data = arrCoors;
										var strokeColor = (cur.strokeColor!=undefined&&cur.strokeColor!="") ? cur.strokeColor : "#000000";
										var strokeWeight = (cur.strokeWeight!=undefined&&cur.strokeWeight!="") ? cur.strokeWeight : 1;
										var strokeOpacity = (cur.strokeOpacity!=undefined&&cur.strokeOpacity!="") ? cur.strokeOpacity : 1;
										var fillColor = (cur.fillColor!=undefined&&cur.fillColor!="") ? cur.fillColor : "#808080";
										var fillOpacity = (cur.fillOpacity!=undefined&&cur.fillOpacity!="") ? cur.fillOpacity : "0.5";
										//var tipUrl = "";
										var tipWidth = (cur.tipWidth!=undefined&&cur.tipWidth!="") ? cur.tipWidth : "0";
										var tipHeight = (cur.tipHeight!=undefined&&cur.tipHeight!="") ? cur.tipHeight : "0";
										var tipContent = (cur.tipContent!=undefined&&cur.tipContent!="") ? cur.tipContent : "";
										
										// 画面
										var overlay = drawPolygonCustom(id, arrCoors, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity);
										arrYeWPolygon.push(overlay);
								    }// end if(arrJingH[i2] != "")
								}
							}
							
						}
					    // end for(var i2 = 0; i2 < arrJingH.length; i2++)
					}
					try{
						parent.$.sysNoty.success('网格区域加载完毕');
					}catch(err){
						
					}
				}
				// end for(var i=0; i<=data.length; i++)
				
//				date2 = new Date(); // 结束时间
//				var dateTemp1 = date2.getTime()-date1.getTime(); // 时间差的毫秒数
//				var log1 = "读取并绘制面的时间：" + dateTemp1 + "毫秒";
//				console.log(log1);

			}// end if(msg != "" || msg != "[]")
			
		}// end success
	});// end ajax

}// end function

//计算网格中心点坐标
function getCoorsCenter(coors){
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
}

//画点 offset：X正=往右移，y正=往下移
function drawPointMouseOverOut(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, isPosition, offsetX, offsetY, tipContent, dirction, labelText, labelXOffset, labelyOffset,name)
{
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
	marker.name=name;
	
	// 旋转角度
	if(dirction!=undefined && dirction!=null && dirction.length>0)
	{
		marker.setRotation(dirction);
	}
	
	// 定位
	if(isPosition)
	{
		//alert("定位");
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
					 //lineHeight : "20px",
					 fontFamily:"宋体",
					 borderColor: "black"
				 });
				marker.setLabel(label);
	}
	
	if(typeof(pointCollectionMouseOverHandler)==="function"){
		marker.addEventListener("mouseover", pointCollectionMouseOverHandler);
	}
	
	if(typeof(pointCollectionMouseOutHandler)==="function"){
		marker.addEventListener("mouseout", pointCollectionMouseOutHandler);
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

	//marker.addEventListener("click", polygonClickEvent);
	marker.addEventListener("click", commonOverlayClickEvent);
	
	
	// 移上去显示暂不考虑 效果不好，位置不在鼠标的位置
	//marker.addEventListener("mouseover", polygonClickEvent);
	
	return marker;
}// end function

function drawPolylineMouseOverOut(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight,name)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
	polyline.id = id;
	polyline.name=name;
	
	if(typeof(polylineMouseOverHandler)==="function"){
		polyline.addEventListener("mouseover", polylineMouseOverHandler);
	}
	
	if(typeof(polylineMouseOutHandler)==="function"){
		polyline.addEventListener("mouseout", polylineMouseOutHandler);
	}
	
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function

function drawPolylineMouseOverOut2(id, data, strokeColor, strokeWeight, strokeOpacity, tipUrl, tipWidth, tipHeight,name)
{
	if(data.length == 0)
	{
		return;
	}
	
	var arr = [];
	for(var i=0; i<data.length; i++)
	{
		arr.push(new BMap.Point(data[i].x, data[i].y));
	}
	
	// 创建折线
	var polyline = new BMap.Polyline(arr, {strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:strokeOpacity});
	polyline.id = id;
	polyline.name=name;
	
	if(typeof(polylineMouseOverHandler)==="function"){
		polyline.addEventListener("mouseover", polylineMouseOverHandler);
	}
	
	if(typeof(polylineMouseOutHandler)==="function"){
		polyline.addEventListener("mouseout", polylineMouseOutHandler);
	}
	
	// 增加折线
	map.addOverlay(polyline);
	
	if(tipUrl != undefined && tipUrl != "")
	{
		polyline.tipUrl = tipUrl;
		polyline.tipWidth = tipWidth;
		polyline.tipHeight = tipHeight;
		polyline.addEventListener("click", polygonClickEvent);
		//polygon.addEventListener("mouseover", polygonOverEvent);
		//polygon.addEventListener("mouseout", polygonOutEvent);
	}
	
	return polyline;
}// end function


function appendCopyRight(value, text,url,copycss,offsetX,offsetY) {
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
}

//全景图图层叠加在百度地图上，配有一个全景切换的按钮
function showQuanJTControl(offsetX,offsetY) {
    // 覆盖区域图层测试
    if (quanJTileLayer === undefined) {
        quanJTileLayer = new BMap.PanoramaCoverageLayer()
        map.addTileLayer(quanJTileLayer);

        quanJTileControl = new BMap.PanoramaControl(); //构造全景控件
        offsetX = (offsetX !== undefined && offsetX !== null && offsetX !== "") ? offsetX : 20;
        offsetY = (offsetY !== undefined && offsetY !== null && offsetY !== "") ? offsetY : 50;
        quanJTileControl.setOffset(new BMap.Size(offsetX, offsetY));
        map.addControl(quanJTileControl);//添加全景控件
    }
    
}

//添加城市选择控件
function showCitySelectControl(value, offsetX, offsetY) {
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
}

//添加地图、卫星图、全景图切换的控件
function showSwitchMapType(value, offsetX, offsetY) {
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

    if (switchControl !== undefined) {
        map.removeControl(switchControl);
    }

    // 创建控件
    switchControl = new SwitchMapTypeControl("up_right");
    // 添加到地图当中
    map.addControl(switchControl);
}

function switchMapTypeFun(value) {
    if (value !== undefined) {
        //移除全景图图层
        if (quanJTileLayer !== undefined) {
            map.removeTileLayer(quanJTileLayer);
            map.removeControl(quanJTileControl);
            quanJTileLayer = undefined;

        }

        if (value === "1") {
            map.setMapType(BMAP_NORMAL_MAP);
            
        } else if (value === "2") {
            map.setMapType(BMAP_SATELLITE_MAP);
        } else if (value === "3") {
            map.setMapType(BMAP_NORMAL_MAP);
            showQuanJTControl();
        }
    }
}

function haiLPoint(x, y) {
    this.x = x;
    this.y = y;
}

//添加海量点
function appendHLPoints(data,size,shape,color,clickCallBack,mouseoverCallBack,mouseoutCallBack) {
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
}

//画弧线
function appendCurveLine(data, strokeColor, strokeWeight, strokeOpacity) {
    if (data.length > 0) {
        var points = [];
        for (var i = 0; i < data.length; i++) {
            points.push(new BMap.Point(data[i].x, data[i].y));
        }
        strokeColor = (strokeColor !== undefined && strokeColor !== null && strokeColor !== "") ? strokeColor : "blue";
        strokeWeight = (strokeWeight !== undefined && strokeWeight !== null && strokeWeight !== "") ? strokeWeight : 3;
        strokeOpacity = (strokeOpacity !== undefined && strokeOpacity !== null && strokeOpacity !== "") ? strokeOpacity : 0.5;
        var curve = new BMapLib.CurveLine(points, { strokeColor: strokeColor, strokeWeight: strokeWeight, strokeOpacity: strokeOpacity }); //创建弧线对象
        map.addOverlay(curve); //添加到地图中
        return curve;
    } else {
        return null;
    }
}

//获取行政区划边界点，（可在地图上绘制）
function GetClimeCoors(cityName,isDraw) {
    var err = "";
    var bdary = new BMap.Boundary();
    bdary.get(cityName, function (rs) {
        // 获取行政区域     
        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
            err = "未能获取当前输入行政区域";
            console.log(err);
        }
        else {
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
                if (isDraw !== undefined && isDraw) {
                    map.addOverlay(ply);
                }
                // 添加覆盖物
                //mapObj.addOverlay(ply);

                pointArray = pointArray.concat(ply.getPath());
            }// end for
            // 调整视野  
            map.setViewport(pointArray);
        }

        // *业务回调函数
        if (typeof (YeWGetClimeCoors) == "function") // 存在
        {
            YeWGetClimeCoors(pointArray);
        }// end if
    });
};

function appendClusterer(data) {
    if (data.length > 0) {
        var markerClusterer = new BMapLib.MarkerClusterer(map, { markers: data });
        return markerClusterer;
    } else {
        return null;
    }
}

// 画点 offset：X正=往右移，y正=往下移
function createMarker(id, x, y, imgUrl, imgWidth, imgHeight, tipUrl, tipWidth, tipHeight, offsetX, offsetY, tipContent, dirction) {
    var offset;
    if (offsetX != undefined && offsetY != undefined) {
        offset = new BMap.Size(offsetX, offsetY);
    }
    else {
        offset = new BMap.Size(0, 0);
    }

    var pt = new BMap.Point(x, y);
    var myIcon = new BMap.Icon(imgUrl, new BMap.Size(imgWidth, imgHeight));
    var marker = new BMap.Marker(pt, { icon: myIcon, offset: offset });
    marker.id = id;
    marker.x = x;
    marker.y = y;

    // 旋转角度
    if (dirction != undefined && dirction != null && dirction.length > 0) {
        marker.setRotation(dirction);
    }

    //添加右键菜单
    if (typeof (deleteHandler) === "function") {
        var contextMenu = new BMap.ContextMenu();
        contextMenu.addItem(new BMap.MenuItem('删除当前点', deleteHandler));
        marker.addContextMenu(contextMenu);
    }

    //map.addOverlay(marker);

    // 弹出框
    if (tipContent != undefined && tipContent != "") {
        marker.tipContent = tipContent;
    }
    else {
        if (tipUrl != undefined && tipUrl != "") {
            marker.tipUrl = tipUrl;
            marker.tipWidth = tipWidth;
            marker.tipHeight = tipHeight;
        }// end if
    }

    //marker.addEventListener("click", polygonClickEvent);
    marker.addEventListener("click", commonOverlayClickEvent);


    // 移上去显示暂不考虑 效果不好，位置不在鼠标的位置
    //marker.addEventListener("mouseover", polygonClickEvent);

    return marker;
}// end function

var autoCompleteControl;
function appendAutoComplete(value, offsetX, offsetY) {
    function appendAutoCompleteControl(value, offsetX, offsetY) {
        // 默认停靠位置和偏移量
        value = (value !== undefined && value !== null) ? value : "up_left";
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
    appendAutoCompleteControl.prototype = new BMap.Control();
    //initialize方法在地图调用 addControl()方法添加控件的时候回调用该方法,从而实现该控件的初始化
    appendAutoCompleteControl.prototype.initialize = function (mapObj) {
        
        // 创建一个DOM元素
        var div = document.createElement("div");
        var input = document.createElement('input');  //创建input节点
        input.setAttribute('type', 'text');  //定义类型是文本输入
        input.id = "txtAutoComplete";
        div.appendChild(input);

        // 添加DOM元素到地图中
        mapObj.getContainer().appendChild(div);
        AutoComplete("txtAutoComplete");
        // 将DOM元素返回
        return div;
    };

    if (autoCompleteControl !== undefined) {
        map.removeControl(autoCompleteControl);
    }

    // 创建控件 value, offsetX, offsetY  up_right
    autoCompleteControl = new appendAutoCompleteControl(value, offsetX, offsetY);
    // 添加到地图当中
    map.addControl(autoCompleteControl);
}

//查询两个点的最优路线规划
function pointPathSearch(slng,slat,elng,elat,policy,tujd){
	//确定查询的策略，百度现在只支持最短时间，最短路程，不走高速三种策略
	if(policy){
		if(policy === 1){
			policy = BMAP_DRIVING_POLICY_LEAST_TIME;
		}else if(polycy === 2){
			policy = BMAP_DRIVING_POLICY_LEAST_DISTANCE;
		}else if(polycy === 3){
			policy = BMAP_DRIVING_POLICY_AVOID_HIGHWAYS;
		}
	}else{
		policy = BMAP_DRIVING_POLICY_LEAST_TIME;
	}
	if(slng && slat && elng && elat){
		var pA = new BMap.Point(slng,slat);
		var pB = new BMap.Point(elng,elat);
		driving = new BMap.DrivingRoute(
			map,
			{renderOptions:{map: map, autoViewport: true},
			onSearchComplete:onSearchCompleteHandler,
				policy:policy
			});
		if(tujd && tujd.length>0){
			driving.search(pA, pB,{waypoints:tujd});
		}else{
			driving.search(pA, pB);
		}

	}
}

//查询两个点的最优路线规划
function namePathSearch(sname,ename,policy,tujd){
	//确定查询的策略，百度现在只支持最短时间，最短路程，不走高速三种策略
	if(policy){
		if(policy === 1){
			policy = BMAP_DRIVING_POLICY_LEAST_TIME;
		}else if(polycy === 2){
			policy = BMAP_DRIVING_POLICY_LEAST_DISTANCE;
		}else if(polycy === 3){
			policy = BMAP_DRIVING_POLICY_AVOID_HIGHWAYS;
		}
	}else{
		policy = BMAP_DRIVING_POLICY_LEAST_TIME;
	}
	if(sname && ename){
		driving = new BMap.DrivingRoute(
			map,
			{renderOptions:{map: map, autoViewport: true},
				onSearchComplete:onSearchCompleteHandler,
				policy:policy
			});
		if(tujd&&tujd.length>0){
			driving.search(sname, ename,{waypoints:tujd});
		}else {
			driving.search(sname, ename);
		}
	}
}

//两点驾车路线规划的结果处理
function onSearchCompleteHandler(result){
	//DrivingRouteResult
	//console.log(result.policy.length);
	var t = result.getPlan(0);
	var tt = t.getRoute(0).getPath();
	var result = "";
	$.each(tt,function(index,item){
		if(item){
			if(result === ""){
				result += item.lng + "," + item.lat;
			}else{
				result += ";" + item.lng + "," + item.lat;
			}
		}
	});
	var ob = new Object();
	ob.coors = result;
	ob.time = t.getDuration(false);
	ob.formattime = t.getDuration(true);
	ob.distance = t.getDistance(false);
	ob.formatdistance = t.getDistance(true);
	if(typeof onSearchCompleteYeWHandler === "function"){
		onSearchCompleteYeWHandler(ob);
	}
}

function gcjTobd09(x, y) {
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
	var bd_lon = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return {
		lng: bd_lon,
		lat: bd_lat
	};
}

function bd09Togcj(bd_lon, bd_lat) {
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	var x = bd_lon - 0.0065, y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	gg_lon = z * Math.cos(theta);
	gg_lat = z * Math.sin(theta);
	return {
		lng: gg_lon,
		lat: gg_lat
	};
}

(function(){
	var _lushu_ = {
		lushu:null,
		init:function (m,data,info,img,imgwidth,imgheight,speed,landmarks) {
			m = m || map;
			img = img || 'http://developer.baidu.com/map/jsdemo/img/car.png';
            this.lushu = new BMapLib.LuShu(m,data,{
                defaultContent:info||"",
                autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                icon  : new BMap.Icon(img, new BMap.Size(imgwidth||52,imgheight||26),{anchor : new BMap.Size(27, 13)}),
                speed: speed||4500,
                enableRotation:true,//是否设置marker随着道路的走向进行旋转
                landmarkPois: landmarks||[]});
            //{lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},
            return this.lushu;
        },
		start:function (lushu) {
			lushu = lushu || this.lushu;
			lushu.start();
        },
        stop:function (lushu) {
            lushu = lushu || this.lushu;
            lushu.stop();
        },
        pause:function (lushu) {
            lushu = lushu || this.lushu;
            lushu.pause();
        },
        hideInfoWindow:function (lushu) {
            lushu = lushu || this.lushu;
            lushu.hideInfoWindow();
        },
        showInfoWindow:function (lushu) {
            lushu = lushu || this.lushu;
            lushu.showInfoWindow();
        },
		formatLushuData:function(str){
			var t = str.split(";");
			var data = [];
			for(var i = 0; i < t.length; i++){
				data.push(new BMap.Point(t[i].split(",")[0],t[i].split(",")[1]));
			}
			return data;
		}
	};
	this.LUSHU = _lushu_;
})();
