'use strict';
'require baseclass';
'require rpc';

var callSystemBoard = rpc.declare({
	object: 'system',
	method: 'board'
});

return baseclass.extend({
	title: _('Maintainer'),

	load: function() {
		return L.resolveDefault(callSystemBoard(), {});
	},

	render: function(boardinfo) {
		var model = (boardinfo && boardinfo.model) ? boardinfo.model : '';
		/* Only show on RG-MA3063; hide on other ipq50xx devices sharing base-files. */
		if (model && model.toLowerCase().indexOf('ma3063') < 0)
			return E('em', {}, _('Not applicable for this device.'));
		var fields = [
			_('Maintainer'), 'REITZG1',
			_('GitHub'), E('a', {
				'href': 'https://github.com/REITZG1/openwrt-ruijie-rg-ma3063',
				'target': '_blank',
				'rel': 'noopener noreferrer'
			}, ['https://github.com/REITZG1/openwrt-ruijie-rg-ma3063']),
			_('Device'), 'Ruijie RG-MA3063 (IPQ5018)'
		];

		var table = E('table', { 'class': 'table' });

		for (var i = 0; i < fields.length; i += 2) {
			table.appendChild(E('tr', { 'class': 'tr' }, [
				E('td', { 'class': 'td left', 'width': '33%' }, [fields[i]]),
				E('td', { 'class': 'td left' }, [(fields[i + 1] != null) ? fields[i + 1] : '?'])
			]));
		}

		return table;
	}
});
