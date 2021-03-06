/*
 *
 * GeoCanAut tools / Outil GéoCanAut
 * geocanaut.github.io/geocanaut/License-eng.txt / geocanaut.github.io/geocanaut/Licence-fra.txt
 *
 * Globals functions
 */
(function () {
	'use strict';
	define([], function() {

		var debounce,
			getListCB,
			getListCBCust,
			getSrType,
			getSrTypeIndex,
			getListValue,
			checkFormatURL,
			getObject,
			getElemValueVM,
			setVM,
			vmObject,
			getUUID,
			checkDuplicate;

		debounce = function(func, threshold, execAsap) {

			var timeout;

			return function debounced () {
				var obj = this,
					args = arguments;

				function delayed () {
					if (!execAsap) {
						func.apply(obj, args);
					}
					timeout = null;
				}

				if (timeout) {
					clearTimeout(timeout);
				}
				else if (execAsap) {
					func.apply(obj, args);
				}

				timeout = setTimeout(delayed, threshold || 100);
			};
		};

		getListCB = function(val) {
			var i = 1,
				typeArr = [],
				array = val.split(';'),
				len = array.length;

			array = array.reverse();
			while (len--) {
				typeArr.push({ id: i, val: array[len] });
				i++;
			}

			return typeArr;
		};

		getListCBCust = function(comp, val) {
			var id = comp.reverse(),
				typeArr = [],
				array = val.split(';'),
				len = array.length;

			array = array.reverse();
			while (len--) {
				typeArr.push({ id: id[len], val: array[len] });
			}

			return typeArr;
		};

		getSrType = function(val) {
			var items, item,
				typeArr = [],
				array = val.split(';'),
				len = array.length;

			array = array.reverse();
			while (len--) {
				item = array[len];
				items = item.split(' - ');
				typeArr.push({ id: parseInt(items[0], 10), val: item });
			}

			return typeArr;
		};

		getSrTypeIndex = function(array, val) {
			var len = array.length,
				rev = array.reverse();

			while (len--) {
				if (rev[len].id === val) {
					return len;
				}
			}
		};

		getListValue = function(array, id) {
			var item,
				len = array.length;

			while (len--) {
				item = array[len];
				if (item.id === id) {
					return item.val;
				}
			}
		};

		checkFormatURL = function(url, type) {
			var regObj,
				flag = false,
				regexp = '(^(http|https):\\/\\/)';

			// create regex from type
			if (type === 2 || type === 4 || type === 5) {
				// esri cache or dynamic
				regexp += '*(/rest/services/)*\/(MapServer)';
			}

			regObj = new RegExp(regexp);
			if (regObj.test(url)) {
				flag = true;
			}

			return flag;
		};

		getObject = function(array, field, text) {
			var item,
				value = null,
				len = array.length;

			while (len--) {
				item = array[len];
				if (item[field] === text) {
					value = item;
				}
			}

			return value;
		};

		getElemValueVM = function(name, element) {
			return vmObject[name][element]();
		};

		setVM = function(vm) {
			vmObject = vm;
		};

		// http://slavik.meltser.info/?p=142
		getUUID = function() {
			function _p8(s) {
				var p = (Math.random().toString(16) + '000000000').substr(2,8);
				return s ? '-' + p.substr(0,4) + '-' + p.substr(4,4) : p ;
			}
			return _p8() + _p8(true) + _p8(true) + _p8();
		};

		checkDuplicate = function(array, value) {
			var len = array.length,
				flag = false;

			while (len--) {
				if (array[len] === value) {
					flag = true;
				}
			}

			return flag;
		};

		return {
			debounce: debounce,
			getListCB: getListCB,
			getListCBCust: getListCBCust,
			getSrType: getSrType,
			getSrTypeIndex: getSrTypeIndex,
			getListValue: getListValue,
			checkFormatURL: checkFormatURL,
			getObject: getObject,
			getElemValueVM: getElemValueVM,
			setVM: setVM,
			getUUID: getUUID,
			checkDuplicate: checkDuplicate
		};
	});
}());
