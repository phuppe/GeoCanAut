/*!
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 *  Project header view model widget
 */
(function() {
	'use strict';
	define(['jquery-private',
			'knockout',
			'jqueryui',
			'gcaut-i18n',
			'gcaut-func',
			'gcaut-esri',
			'gcaut-wms',
			'gcaut-gismap',
			'gcaut-gisservinfo'
	], function($aut, ko, jqUI, i18n, gcautFunc, esriData, wmsData, gisM, gisServInfo) {
		var initialize,
			clean,
			checkParentlayers,
			checkSublayers,
			vm;

		initialize = function(elem, map) {

			// data model
			var mapViewModel = function(elem, mapin) {
				var _self = this,
					srType = gcautFunc.getSrType(i18n.getDict('%map-sr')),
					baseType = gcautFunc.getListCB(i18n.getDict('%map-basetypelist')),
					layerType = gcautFunc.getListCB(i18n.getDict('%map-layertypelist')),
					size = mapin.size,
					map = mapin.map,
					zoombar = map.zoombar,
					layers = map.layers,
					extentMax = map.extentmax,
					extentInit = map.extentinit,
					lods = map.lods;

				// tooltip
				_self.tpNew = i18n.getDict('%projheader-tpnewmap');
				_self.tpSetMaxExtent = i18n.getDict('%map-tpsetmaxextent');
				_self.tpSetInitExtent = i18n.getDict('%map-tpsetinitextent');
				_self.tpVerifyURL = i18n.getDict('%map-tpverifyurl');
				_self.tpCheckAllLods = i18n.getDict('%map-tpcheckalllods');
				_self.tpUnCheckAllLods = i18n.getDict('%map-tpuncheckalllods');
				_self.tpOpenClose = i18n.getDict('%openclose');

				// class
				_self.hiddenLayer = ko.observable('gcaut-hidden');
				_self.hiddenMap = ko.observable('gcaut-hidden');
				_self.errormsg = ko.observable('gcaut-message-error');

				// error message
				_self.errortextbase = ko.observable();
				_self.errortextlayer = ko.observable();
				_self.msgHeight = i18n.getDict('%map-msgheight');
				_self.msgWidth = i18n.getDict('%map-msgwidth');

				// resolution
				_self.lodsAreChecked = ko.observable(true);
				_self.lblCheckUncheckAll = i18n.getDict('%map-checkuncheckall');

				// label
				_self.lblGeneralParams = i18n.getDict('%map-general');
				_self.lblHelperServicesParams = i18n.getDict('%map-helperservices');
				_self.lblMapServicesParams = i18n.getDict('%map-mapservices');
				_self.lblRemove = i18n.getDict('%remove');
				_self.lblMapSize = i18n.getDict('%size');
				_self.lblMapHeight = i18n.getDict('%height');
				_self.lblMapWidth = i18n.getDict('%width');
				_self.lblLink = i18n.getDict('%map-link');
				_self.lblZoom = i18n.getDict('%map-zoom');
				_self.lblZoombar = i18n.getDict('%map-zoombar');
				_self.lblResol = i18n.getDict('%map-resolution');
				_self.lblLods = i18n.getDict('%map-lods');
				_self.lblLevel = i18n.getDict('%map-level');
				_self.lblBasemap = i18n.getDict('%map-basemap');
				_self.lblMapSR = i18n.getDict('%map-spatialref');
				_self.lblUrlGeomServer = i18n.getDict('%map-urlgeomserver');
				_self.lblUrlProxy = i18n.getDict('%map-urlproxy');
				_self.lblUrlDownload = i18n.getDict('%map-urldownload');
				_self.lblExtentMax = i18n.getDict('%map-extentmax');
				_self.lblExtentInit = i18n.getDict('%map-extentinit');
				_self.lblExtentMinX = i18n.getDict('%map-extentminx');
				_self.lblExtentMinY = i18n.getDict('%map-extentminy');
				_self.lblExtentMaxX = i18n.getDict('%map-extentmaxx');
				_self.lblExtentMaxY = i18n.getDict('%map-extentmaxy');
				_self.lblSelectItem = i18n.getDict('%selectItem');
				_self.lblAddLayer = i18n.getDict('%map-addlayer');
				_self.lblLayerType = i18n.getDict('%map-layertype');
				_self.lblLayerURL = i18n.getDict('%map-layerurl');
				_self.lblSetExtent = i18n.getDict('%map-setextent');
				_self.lblBefBasemap = i18n.getDict('%map-befbasemap');
				_self.lblScale = i18n.getDict('%map-scale');
				_self.lblScaleMin = i18n.getDict('%minimum');
				_self.lblScaleMax = i18n.getDict('%maximum');
				_self.lblCluster = i18n.getDict('%map-lblcluster');
				_self.lblClusterEnable = i18n.getDict('%map-lblclusterenable');
				_self.lblClusterDist = i18n.getDict('%map-lblclusterdist');
				_self.lblClusterLabel = i18n.getDict('%map-lblclusterlabel');
				_self.lblClusterSymbol = i18n.getDict('%map-lblclustersymbol');
				_self.lblClusterSize = i18n.getDict('%map-lblclustersize');
				_self.lblClusterData = i18n.getDict('%map-lblclusterdata');
				_self.lblVerifyAdd = i18n.getDict('%map-lblverifyadd');

				// text
				_self.txtLayerErr = i18n.getDict('%map-layererror');

				// focus txt_mapHeight on init
				_self.focusMapHeight = ko.observable(true);

				// dialog
				_self.isLayerDialogOpen = ko.observable();
				_self.isExtentDialogOpen = ko.observable();
				_self.extentType = ko.observable();

				// services
				_self.baseURL = ko.observable();
				_self.layerURL = ko.observable();
				_self.availServBase = ko.observableArray([]);
				_self.availServLayer = ko.observableArray([]);

				// geometry server and proxy
				_self.urlGeomServer = ko.observable(map.urlgeomserv);
				_self.urlProxy = ko.observable(map.urlproxy);
				_self.urlDownload = ko.observable(map.urldownload);

				// map input
				_self.mapHeightValue = ko.observable(size.height).extend({ numeric: { precision: 0, validation: { min: 400, max: 2000, id: 'msg_height', msg: _self.msgHeight } } });
				_self.mapWidthValue = ko.observable(size.width).extend({ numeric: { precision: 0, validation: { min: 500, max: 2000, id: 'msg_width', msg: _self.msgWidth } } });
				_self.isLink = ko.observable(map.link);

				// zoom to full extent and zoombar
				_self.isZoomBar = ko.observable(zoombar.bar);
				_self.isZoom = ko.observable(zoombar.zoom);

				// set extent variable (for the dialog box)
				_self.setExtentMinX = ko.observable().extend({ numeric: { precision: 5 } });
				_self.setExtentMinY = ko.observable().extend({ numeric: { precision: 5 } });
				_self.setExtentMaxX = ko.observable().extend({ numeric: { precision: 5 } });
				_self.setExtentMaxY = ko.observable().extend({ numeric: { precision: 5 } });

				// hold selected layer type id when we request layers info
				_self.selectedType = ko.observable(0);

				// base layer input
				_self.bases = ko.observableArray();
				_self.baseType = baseType;
				_self.selectBaseLayerType = ko.observable();

				// set a timeout to fired updatebases in legendVM (workaround to avoid bad array)
				setTimeout(function() {
					_self.bases(map.bases);
					_self.selectBaseLayerType(baseType[1]);
				}, 750);

				// continue base layer input
				_self.srType = srType;
				_self.isLods = ko.observable(lods.enable);
				_self.lods = ko.observableArray(lods.values);
				_self.selectMapSR = ko.observable(srType[gcautFunc.getSrTypeIndex(srType, map.sr.wkid)]);
				_self.maxExtentMinX = ko.observable(extentMax.xmin).extend({ numeric: { precision: 5 } });
				_self.maxExtentMinY = ko.observable(extentMax.ymin).extend({ numeric: { precision: 5 } });
				_self.maxExtentMaxX = ko.observable(extentMax.xmax).extend({ numeric: { precision: 5 } });
				_self.maxExtentMaxY = ko.observable(extentMax.ymax).extend({ numeric: { precision: 5 } });
				_self.initExtentMinX = ko.observable(extentInit.xmin).extend({ numeric: { precision: 5 } });
				_self.initExtentMinY = ko.observable(extentInit.ymin).extend({ numeric: { precision: 5 } });
				_self.initExtentMaxX = ko.observable(extentInit.xmax).extend({ numeric: { precision: 5 } });
				_self.initExtentMaxY = ko.observable(extentInit.ymax).extend({ numeric: { precision: 5 } });

				// layer input
				_self.isLayer = ko.observable(false);
				_self.layers = ko.observableArray(map.layers).extend({ rateLimit: { method: 'notifyWhenChangesStop', timeout: 500 } });
				_self.layerType = layerType;
				_self.selectLayerType = ko.observable();
				_self.layersAreChecked = ko.observable(false);

				// layer service info array
				_self.servLayers = ko.observableArray();

				// subscribe functions
				_self.selectBaseLayerType.subscribe(function(val) {
					return _self.availServBase(_self.setServName(val.id));
				});

				_self.selectLayerType.subscribe(function(val) {
					return _self.availServLayer(_self.setServName(val.id));
				});

				// functions to create isChecked observable on lods when read. This way we can have select/unselect
				ko.utils.arrayForEach(_self.lods(), function(item) {
					item.isChecked = ko.observable(item.check);
				});

				_self.lodsCheckUncheck = function() {
					if (_self.lodsAreChecked() === true) {
						_self.lodsAreChecked(false);
					} else {
						_self.lodsAreChecked(true);
					}
					_self.checkLods(_self.lodsAreChecked());
					return true;
				};

				_self.checkLods = function(value) {
					ko.utils.arrayForEach(_self.lods(), function(item) {
						item.isChecked(value);
					});
				};

				// functions to create observable on layers
				ko.utils.arrayForEach(_self.layers(), function(item) {
					var beforebase = item.beforebase,
						scale = item.scale,
						cluster= item.cluster;

					// show before basemap
					beforebase = ko.observable(beforebase);

					// scale
					scale.min = ko.observable(scale.min).extend({ numeric: { precision: 0 } });
					scale.max = ko.observable(scale.max).extend({ numeric: { precision: 0 } });

					// cluster
					cluster.enable = ko.observable(cluster.enable);
					cluster.distance = ko.observable(cluster.distance).extend({ numeric: { precision: 0 } });
					cluster.label = ko.observable(cluster.label);
					cluster.symbol = ko.observable(cluster.symbol);
					cluster.maxsizeprop = ko.observable(cluster.maxsizeprop).extend({ numeric: { precision: 0 } });
					cluster.maxdataprop = ko.observable(cluster.maxdataprop).extend({ numeric: { precision: 0 } });
				});

				// clean the view model
				clean(ko, elem);

				_self.init = function() {
					// force layers update to be able to create the legend
					_self.layers.valueHasMutated();
					return { controlsDescendantBindings: true };
				};

				_self.bind = function() {
					// destroy dialog box we need to do this because it disapears from elem
					clean(ko, $aut('#map_addlayer')[0]);
					clean(ko, $aut('#map_extent')[0]);

					clean(ko, elem);
					ko.applyBindings(_self, elem);
				};

				// get the selected layer value from index
				_self.getLayerType = function(data) {
					return gcautFunc.getListValue(_self.layerType, data.type);
				};

				// select layers dialog buttons functions (ok and cancel)
				_self.dialogLayerOk = function() {
					_self.updateLayers(_self.servLayers(), layers, _self.selectedType());
					_self.dialogLayerCancel();
				};

				_self.dialogLayerCancel = function() {
					_self.baseURL('');
					_self.layerURL('');
					_self.hiddenLayer('gcaut-hidden');
					_self.isLayerDialogOpen(false);
				};

				// update layers array when they are selected from the dialog box
				_self.updateLayers = function(elem, list, type) {
					var layer,
						servLayers,
						url,
						lastIndex, firstIndex, name,
						layers = elem,
						category = _self.isLayer() ? 'layer' : 'base',
						len = layers.length;

					if (type === 2 || type === 4) {
						layer = layers[0];
						lastIndex = layer.url.indexOf('MapServer') - 1;
						url = layer.url.substring(0, lastIndex);
						firstIndex = url.lastIndexOf('/') + 1;
						url = url + '/MapServer';
						name = url.substring(firstIndex, lastIndex);

						if (category === 'base') {
							_self.bases.push({ label: name,
										id: gcautFunc.getUUID(),
										type: layer.type,
										url: url,
										scale: layer.scale });
						} else {
							_self.layers.push({ label: name,
											id: gcautFunc.getUUID(),
											type: layer.type,
											url: url,
											beforebase: layer.beforebase,
											scale: layer.scale,
											usecluster: layer.usecluster(),
											cluster: layer.cluster });
						}

					} else if (type === 5) {
						while (len--) {
							layer = layers[len];
							lastIndex = layer.url.indexOf('MapServer') - 1;
							url = layer.url.substring(0, lastIndex);
							firstIndex = url.lastIndexOf('/') + 1;
							name = url.substring(firstIndex, lastIndex);
							servLayers = layer.servLayers;

							if (servLayers.length === 0) {
								if (layer.isChecked()) {
									_self.layers.push({ label: name + '***' + layer.fullname,
														id: gcautFunc.getUUID(),
														type: layer.type,
														url: layer.url,
														beforebase: layer.beforebase,
														scale: layer.scale,
														usecluster: layer.usecluster(),
														cluster: layer.cluster });
								}
							} else {
								_self.updateLayers(servLayers, list, type);
							}
						}
					}
				};

				// five next function are use to check/uncheck element in layer dialog box
				_self.checkUncheckAllLayers = function(layer) {
					if (_self.layersAreChecked() === true) {
						_self.layersAreChecked(false);
					} else {
						_self.layersAreChecked(true);
					}
					_self.checkAll(layer, _self.layersAreChecked());
					return true;
				};

				_self.checkAll = function(layers, value) {
					var layer,
						len = layers.length;

					while (len--) {
						layer = layers[len];

						// set parent level
						layer.isUse(value);
						layer.isChecked(value);

						// check or uncheck all child layers and set the isUse
						checkSublayers(layer, 1);
					}

					return true;
				};

				_self.cascadeCheck = function(parents, item) {
					var check = !item.isChecked(),
						getRestInfo,
						serviceInfo,
						serviceJSON;

					// Set isUse for all parents;
					item.isUse(check);
					checkParentlayers(parents, check);

					// If feature layer and a point layer. set item.usecluster
					if (item.type === 5) {
						getRestInfo = gisServInfo.getRestServiceInformation(item.url);
						serviceInfo = getRestInfo.responseText;
						serviceJSON = $aut.parseJSON(serviceInfo);
						if (serviceJSON.geometryType === 'esriGeometryPoint') {
							item.usecluster(true);
						}
					}

					// check or uncheck all child layers and set the isUse
					checkSublayers(item, 0);

					return true;
				};

				checkParentlayers = function(parents, checked) {
					// minus 1 because the last item in the array is the view model
					var parent,
						use,
						len = parents.length - 1,
						index = 0;

					while (index !== len) {
						use = false;
						parent = parents[index];
						index++;

						// check if a layer on the same level is use
						ko.utils.arrayForEach(parent.servLayers, function(subitem) {
							if (subitem.isUse()) {
								use = true;
							}
						});

						// if a layer on the same level is use set to true
						if (use) {
							parent.isUse(true);
						} else {
							parent.isUse(checked);
						}
					}
				};

				checkSublayers = function(item, level) {
					var checked = level ? !item.isChecked() : item.isChecked(),
						getRestInfo,
						serviceInfo,
						serviceJSON;

					ko.utils.arrayForEach(item.servLayers, function(subitem) {
						subitem.isUse(!checked);
						subitem.isChecked(!checked);

						// If feature layer and a point layer. set item.usecluster
						if (subitem.type === 5) {
							getRestInfo = gisServInfo.getRestServiceInformation(subitem.url);
							serviceInfo = getRestInfo.responseText;
							serviceJSON = $aut.parseJSON(serviceInfo);
							if (serviceJSON.geometryType === 'esriGeometryPoint') {
								subitem.usecluster(true);
							}
						}
						checkSublayers(subitem, 1);
					});
				};

				// set extent dialog buttons functions (ok and cancel)
				_self.dialogExtentOk = function() {
					var type = _self.extentType();

					if (type === 'max') {
						_self.maxExtentMinX(_self.setExtentMinX());
						_self.maxExtentMinY(_self.setExtentMinY());
						_self.maxExtentMaxX(_self.setExtentMaxX());
						_self.maxExtentMaxY(_self.setExtentMaxY());
					} else {
						_self.initExtentMinX(_self.setExtentMinX());
						_self.initExtentMinY(_self.setExtentMinY());
						_self.initExtentMaxX(_self.setExtentMaxX());
						_self.initExtentMaxY(_self.setExtentMaxY());
					}

					_self.dialogExtentCancel();
				};

				_self.dialogExtentCancel = function() {
					$aut('#map_setExtent').remove();
					_self.hiddenMap('gcaut-hidden');
					_self.isExtentDialogOpen(false);
				};

				// create the inside of the extent dialog window
				_self.setExtent = function(type) {
					var size = { width:_self.mapWidthValue(),
									height: _self.mapHeightValue()
							},
						holder = [_self.setExtentMinX,
									_self.setExtentMinY,
									_self.setExtentMaxX,
									_self.setExtentMaxY];

					// show window to select extent
					_self.extentType(type);
					_self.isExtentDialogOpen(true);
					_self.hiddenMap('');

					// create the map
					gisM.createMap('map_setExtent',
									_self.selectBaseLayerType().id,
									_self.bases()[0].url,
									_self.lods(),
									size,
									holder);
				};

				// set the service name from the localstorage when layer's type change
				_self.setServName = function(id) {
					var array;

					if (id === 1) {
						array = localStorage.servnameWMST.split(';');
					} else if (id === 2)  {
						array = localStorage.servnameCacheREST.split(';');
					} else if (id === 3)  {
						array = localStorage.servnameWMS.split(';');
					} else if (id === 4)  {
						array = localStorage.servnameDynamicREST.split(';');
					} else if (id === 5)  {
						array = localStorage.servnameDynamicREST.split(';');
					}

					return array;
				};

				// when the remove layer icon is click, remove the layer from the array
				_self.removeLayer = function(type) {
					if (type === 'base') {
						_self.bases.remove(this);
					} else {
						_self.layers.remove(this);
					}
				};

				// when one item in the autocomple is selected, update the input text
				_self.setBaseURL = function(event, ui) {
					_self.baseURL(ui.item.value);

					return false;
				};

				// when one item in the autocomple is selected, update the input text
				_self.setLayerURL = function(event, ui) {
					_self.layerURL(ui.item.value);

					return false;
				};

				// launch when url validation button is push
				_self.validateURL = function(type) {
					var isValid,
						url,
						layerType;

					if (type === 'base') {
						_self.isLayer(false);
						url = _self.baseURL();
						layerType = _self.selectBaseLayerType().id;
					} else {
						_self.isLayer(true);
						_self.layersAreChecked(false);
						url = _self.layerURL();
						layerType = _self.selectLayerType().id;
					}

					// check the url
					isValid = gcautFunc.checkFormatURL(url, layerType);

					// clean error message
					if (type === 'base') {
						_self.errortextbase('');
					} else {
						_self.errortextlayer('');
					}

					if (isValid) {
						// get service info and validateURL as callback function
						gisServInfo.getResourceInfo(url, layerType, _self.readServInfo, function() { type === 'base' ? _self.errortextbase(_self.txtLayerErr) : _self.errortextlayer(_self.txtLayerErr); });
					} else {
						type === 'base' ? _self.errortextbase(_self.txtLayerErr) : _self.errortextlayer(_self.txtLayerErr);
					}
				};

				// callback function for gisServInfo.getResourceInfo
				_self.readServInfo = function(url, type, sender) {
					var addUrl,
						urlArr = [],
						category = _self.isLayer() ? 'layer' : 'base';

					// set the selected type (use to show or hide checkbox)
					_self.selectedType(type);
					if (sender.hasOwnProperty('error')) {
						category === 'base' ? _self.errortextbase(_self.txtLayerErr) : _self.errortextlayer(_self.txtLayerErr);
					} else {
						if (type === 2 || type === 4 || type === 5) {
							esriData.readInfo(sender, _self, url, type, category);
						}

						// check duplicate in service array and copy to localstorage
						if (category === 'base') {
							urlArr = _self.availServBase();
						} else {
							urlArr = _self.availServLayer();
						}

						if (!gcautFunc.checkDuplicate(urlArr, url)) {
							urlArr.push(url);
							addUrl = urlArr.join(';');
							if (type === 1) {
								localStorage.setItem('servnameWMTS', addUrl);
							} else if (type === 2)  {
								localStorage.setItem('servnameCacheREST', addUrl);
							} else if (type === 3)  {
								localStorage.setItem('servnameWMTS', addUrl);
							} else if (type === 4)  {
								localStorage.setItem('servnameDynamicREST', addUrl);
							} else if (type === 5)  {
								localStorage.setItem('servnameDynamicREST', addUrl);
							}
						}

						// show window to select layers
						_self.isLayerDialogOpen(true);
						_self.hiddenLayer('');
					}
				};

				_self.updateOrder = function() {
					// reorder layers array after sort
					var id,
						$elems = $aut('#layersoptions').find('.layeroption-title'),
						len = $elems.length,
						tmpLayers = [];

					while (len--) {
						id = $aut($elems[len]).attr('id');
						tmpLayers.push(gcautFunc.getObject(_self.layers(), 'id', id));
					}

					_self.layers(tmpLayers.reverse());
				};

				// if cluster is enable, update type from 5 to 6
				_self.updateType = function(item) {
					// enable is the oposite of the value because the vie wmodel
					// is not updated yet.
					(item.cluster.enable()) ? item.type = 5 : item.type = 6;
					return true;
				};

				_self.write = function() {
					var value;

					value = '"mapframe": {' +
								'"size": {' +
									'"height": ' + _self.mapHeightValue() +
									',"width": ' + _self.mapWidthValue() +
								'},' +
								'"map": {' +
									'"urlgeomserv": "' + _self.urlGeomServer() + '",' +
									'"urlproxy": "' + _self.urlProxy() + '",' +
									'"urldownload": "' + _self.urlDownload() + '",' +
									'"sr": {' +
										'"wkid": ' + _self.selectMapSR().id +
									'},' +
									'"extentmax": {' +
										'"xmin": ' + _self.maxExtentMinX() +
										',"ymin": ' + _self.maxExtentMinY() +
										',"xmax": ' + _self.maxExtentMaxX() +
										',"ymax": ' + _self.maxExtentMaxY() +
									'},' +
									'"extentinit": {' +
										'"xmin": ' + _self.initExtentMinX() +
										',"ymin": ' + _self.initExtentMinY() +
										',"xmax": ' + _self.initExtentMaxX() +
										',"ymax": ' + _self.initExtentMaxY() +
									'},' +
									'"lods": {' +
										'"enable": ' + _self.isLods() +
										'"disable": ' + _self.isNotLods() +
										',"values": ' + JSON.stringify(ko.toJS(_self.lods())).replace(/isChecked/g, 'check') +
									'},' +
									'"link": ' + _self.isLink() +
									',"zoombar": {' +
										'"bar": ' + _self.isZoomBar() +
										',"zoom": ' + _self.isZoom() +
									'},' +
									'"bases": ' + JSON.stringify(ko.toJS(_self.bases())) +
									',"layers": '+ JSON.stringify(ko.toJS(_self.layers())) +
								'}' +
							'}';

					return value;
				};

				_self.init();
			};

			vm = new mapViewModel(elem, map);
			ko.applyBindings(vm, elem); // This makes Knockout get to work
			return vm;
		};

		clean = function(ko, elem) {
			ko.cleanNode($aut('#map_addlayer')[0]);
			ko.cleanNode($aut('#map_extent')[0]);
			ko.cleanNode(elem);
			$aut('#layers').empty(); // remove layers from DOM
		};

		return {
			initialize: initialize,
			clean: clean
		};
	});
}).call(this);
