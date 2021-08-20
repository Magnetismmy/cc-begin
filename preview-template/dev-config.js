const NEX_CONFIG = {
	nodeSchema: {
		node: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				{ name: 'Name', key: 'name', type: 'text' },
				{ name: 'ID', key: '_id', type: 'text' },
				{ name: 'Position.X', parentKey: 'position', key: 'x', type: 'object_number', method: 'setPosition' },
				{ name: 'Position.Y', parentKey: 'position', key: 'y', type: 'object_number', method: 'setPosition' },
				{ name: 'Position.Z', parentKey: 'position', key: 'z', type: 'object_number', method: 'setPosition' },
				{ name: 'Angle.X', parentKey: 'eulerAngles', key: 'x', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Angle.Y', parentKey: 'eulerAngles', key: 'y', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Angle.Z', parentKey: 'eulerAngles', key: 'z', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Scale.X', parentKey: 'scale', key: 'x', type: 'object_number', method: 'setScale' },
				{ name: 'Scale.Y', parentKey: 'scale', key: 'y', type: 'object_number', method: 'setScale' },
				{ name: 'Scale.Z', parentKey: 'scale', key: 'z', type: 'object_number', method: 'setScale' },
				{ name: 'Layer', key: 'layer', type: 'number'},
			]
		},
	},
	componentsSchema: {
		'cc.Camera': {
			title: 'cc.Camera',
			key: 'cc.Camera',
			rows: [
				{ name: 'ClearDepth', key: 'clearDepth', type: 'number' },
				{ name: 'ClearColor', key: 'hex_clearColor', rawKey: 'clearColor', type: 'color' },
			]
		},
		'cc.DirectionalLight': {
			title: 'cc.DirectionalLight',
			key: 'cc.DirectionalLight',
			rows: [
				{ name: 'UseColorTemperature', key: 'useColorTemperature', type: 'bool' },
				{ name: 'ColorTemperature', key: 'colorTemperature', type: 'number' },
				{ name: 'Illuminance', key: 'illuminance', type: 'number' },
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
			]
		},
		'cc.UITransform': {
			key: 'cc.UITransform',
			title: 'cc.UITransform',
			rows: [
				{ name: 'Width', key: 'width', type: 'number' },
				{ name: 'Height', key: 'height', type: 'number' },
				{ name: 'AnchorX', key: 'anchorX', type: 'number' },
				{ name: 'AnchorY', key: 'anchorY', type: 'number' },
				// { name: 'Priority', key: 'priority', type: 'number' },
			]
		},
		'cc.Sprite': {
			key: 'cc.Sprite',
			title: 'cc.Sprite',
			rows: [
				{ name: 'Type', key: 'type', type: 'number' },
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
				{ name: 'SizeMode', key: 'sizeMode', type: 'number' },
				{ name: 'Trim', key: 'trim', type: 'bool' },
			]
		},
		'cc.Label': {
			title: 'cc.Label',
			key: 'cc.Label',
			rows: [
				{ name: 'String', key: 'string', type: 'textarea' },
				{ name: 'Font Size', key: 'fontSize', type: 'number' },
				{ name: 'Line Height', key: 'lineHeight', type: 'number' },
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
			]
		},
		'cc.RigidBody': {
			title: 'cc.RigidBody',
			key: 'cc.RigidBody',
			rows: [
				{ name: 'Group', key: 'group', type: 'number' },
				{ name: 'Awake', key: 'isAwake', type: 'bool' },
				{ name: 'Dynamic', key: 'isDynamic', type: 'bool' },
				{ name: 'Gravity', key: 'useGravity', type: 'bool' },
				{ name: 'Static', key: 'isStatic', type: 'bool' },
				{ name: 'Kinematic', key: 'isKinematic', type: 'bool' },
				{ name: 'Sleeping', key: 'isSleeping', type: 'bool' },
				{ name: 'Sleepy', key: 'isSleepy', type: 'bool' },
				{ name: 'Valid', key: 'isValid', type: 'bool' },
				{ name: 'Mass', key: 'mass', type: 'number' },
			]
		},
		'cc.Collider': {
			title: 'cc.Collider',
			// key: 'cc.Collider',
			include: 'Collider',
			rows: [
				{ name: 'CenterX', parentKey: 'center', key: 'x', type: 'object_number'},
				{ name: 'CenterY', parentKey:'center', key: 'y', type: 'object_number' },
				{ name: 'CenterZ', parentKey:'center', key: 'z', type: 'object_number' },
				{ name: 'Trigger', key: 'isTrigger', type: 'bool' },
			]
		}
	}
}