const getType = (v: any) => Object.prototype.toString.call(v).replace(/\[object\s|\]/g, '')

export default {
  isNumber: (v: unknown): v is number => getType(v) === 'Number',
  isString: (v: unknown): v is string => getType(v) === 'String',
  isBoolean: (v: unknown): v is boolean => getType(v) === 'Boolean',
  isUndefined: (v: unknown): v is undefined => getType(v) === 'Undefined',
  isNull: (v: unknown): v is null => getType(v) === 'Null',
  isObject: (v: unknown): v is object => getType(v) === 'Object',
  isArray: (v: unknown): v is Array<any> => getType(v) === 'Array',
  isFunction: (v: unknown): v is Function => getType(v) === 'Function',
};