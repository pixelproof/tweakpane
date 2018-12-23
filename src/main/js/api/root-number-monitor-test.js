// @flow

import {describe as context, describe, it} from 'mocha';
import {assert} from 'chai';

import MonitorBinding from '../binding/monitor';
import GraphMonitorController from '../controller/monitor/graph';
import MultiLogMonitorController from '../controller/monitor/multi-log';
import SingleLogMonitorController from '../controller/monitor/single-log';
import RootController from '../controller/root';
import IntervalTicker from '../misc/ticker/interval';
import TestUtil from '../misc/test-util';
import RootApi from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {});
	return new RootApi(c);
}

describe(RootApi.name, () => {
	[
		{
			expectedClass: SingleLogMonitorController,
			params: {},
			value: 123,
		},
		{
			expectedClass: MultiLogMonitorController,
			params: {
				count: 10,
			},
			value: 123,
		},
		{
			expectedClass: GraphMonitorController,
			params: {
				type: 'graph',
			},
			value: 123,
		},
	].forEach((testCase) => {
		context(`when params = ${JSON.stringify(testCase.params)}`, () => {
			it(`should return class ${testCase.expectedClass.name}`, () => {
				const api = createApi();
				const obj = {foo: testCase.value};
				const bapi = api.addMonitor(obj, 'foo', testCase.params);
				assert.instanceOf(bapi.controller.controller, testCase.expectedClass);

				const b = bapi.controller.binding;
				if (b instanceof MonitorBinding) {
					const t = b.ticker;
					if (t instanceof IntervalTicker) {
						t.dispose();
					}
				}
			});
		});
	});
});
