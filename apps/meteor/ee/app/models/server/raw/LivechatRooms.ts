import { LivechatRoomsRaw } from '../../../../../server/models/raw/LivechatRooms';
import { queriesLogger } from '../../../livechat-enterprise/server/lib/logger';
import { addQueryRestrictionsToRoomsModel } from '../../../livechat-enterprise/server/lib/query.helper';
import { overwriteClassOnLicense } from '../../../license/server';

const applyRestrictions = (method: 'find' | 'update' | 'findPaginated') =>
	function (originalFn: any, originalQuery: object, ...args: any) {
		const query = addQueryRestrictionsToRoomsModel(originalQuery);
		queriesLogger.debug({ msg: `LivechatRoomsRaw.${method}`, query });

		// @ts-expect-error had to manually override the type because of the way the args are passed
		return originalFn.call(this, query, ...args);
	};

overwriteClassOnLicense('livechat-enterprise', LivechatRoomsRaw, {
	find: applyRestrictions('find'),
	update: applyRestrictions('update'),
	findPaginated: applyRestrictions('findPaginated'),
	updateDepartmentAncestorsById(_, _id, departmentAncestors) {
		const query = {
			_id,
		};
		const update = departmentAncestors ? { $set: { departmentAncestors } } : { $unset: { departmentAncestors: 1 } };
		return this.update(query, update);
	},
	async associateRoomsWithDepartmentToUnit(_, departments: string[], unitId: string) {
		const query = {
			departmentId: { $in: departments },
			$and: [
				{
					departmentAncestors: { $exists: true },
				},
				{
					departmentAncestors: { $ne: unitId },
				},
			],
		};
		const update = { $set: { departmentAncestors: [unitId] } };
		queriesLogger.debug({ msg: `LivechatRoomsRaw.associateRoomsWithDepartmentToUnit - association step`, query, update });
		const associationResult = await this.update(query, update, { multi: true });
		queriesLogger.debug({ msg: `LivechatRoomsRaw.associateRoomsWithDepartmentToUnit - association step`, result: associationResult });

		const queryToDisassociateOldRoomsConnectedToUnit = {
			departmentAncestors: unitId,
			departmentId: { $nin: departments },
		};
		const updateToDisassociateRooms = { $unset: { departmentAncestors: 1 } };
		queriesLogger.debug({ msg: `LivechatRoomsRaw.associateRoomsWithDepartmentToUnit - disassociation step`, query, update });
		await this.update(queryToDisassociateOldRoomsConnectedToUnit, updateToDisassociateRooms, { multi: true });
		queriesLogger.debug({ msg: `LivechatRoomsRaw.associateRoomsWithDepartmentToUnit - disassociation step`, result: associationResult });
	},
	async removeUnitAssociationFromRooms(_, unitId: string) {
		const query = {
			departmentAncestors: unitId,
		};
		const update = { $unset: { departmentAncestors: 1 } };
		queriesLogger.debug({ msg: `LivechatRoomsRaw.removeUnitAssociationFromRooms`, query, update });
		const result = await this.update(query, update, { multi: true });
		queriesLogger.debug({ msg: `LivechatRoomsRaw.removeUnitAssociationFromRooms`, result });
	},
});
