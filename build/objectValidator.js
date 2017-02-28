(function () {
    "use strict"
    angular.module('ObjectValidator').factory('objectValidator', objectValidator);

    objectValidator.$inject = [];

    function objectValidator() {

        var _config = {
            checkProto: true,
            matchPropertyCount: true
        };
        var _configModel = {
            checkProto: true,
            matchPropertyCount: false
        };

        var _classes = {};

        var service = {
            test: test,
            type: type,
            config: config,
            getClass: getClass,
            addClass: addClass,
            removeclass: removeclass,
            getAllClasses: getAllClasses,
            removeAllClasses: removeAllClasses

        }
        return service;

        function test(className, testTarget) {

            var isValid = true;
            if (type(testTarget) != "Object" || type(className) != "String") {
                console.error("Validate object must receive a class name and an object");
                return false;
            }

            var model = getClass(className);

            return checkObjects(testTarget, model);
        }
        function checkObjects(testTarget, model) {
            var isValid = true;

            //test that number of properties are correct
            if (_config.checkProto) {
                if (propCount(testTarget) < propCount(model)) return false;
            } else {
                if (Object.keys(testTarget).length < Object.keys(model).length) return false;
            }


            if (_config.matchPropertyCount) {
                if (_config.checkProto) {
                    if (propCount(testTarget) != propCount(model)) return false;
                } else {
                    if (Object.keys(testTarget).length != Object.keys(model).length) return false;
                }

            }
           
            var count = 0;
            for (var modelProp in model) {

                if (!_config.checkProto) {
                    if (!model.hasOwnProperty(modelProp)) {
                        count++;
                        continue;
                    }
                }
                var modelPropertyName = modelProp;
                var modelProperty = model[modelProp];



                var countTarget = 0;
                var propertyExists = false;
                for (var targetProp in testTarget) {

                    if (!_config.checkProto) {
                        if (!testTarget.hasOwnProperty(targetProp)) {
                            countTarget++;
                            continue;
                        }
                    }
                    var targetPropertyName = targetProp;
                    var targetProperty = testTarget[targetProp];

                    if (modelPropertyName == targetPropertyName) {

                        propertyExists = true;

                        //make sure types are the same
                        if (type(modelProperty) !== type(targetProperty)) {

                            isValid = false;
                        } else if (type(targetProperty) == "Object") {
                            isValid = checkObjects(targetProperty, modelProperty);
                        }
                        break;
                    }
                    countTarget++;
                }
                if (!propertyExists) {
                    isValid = false;
                }

                count++;

            }
            return isValid;
        }

        function propCount(obj) {
            var count = 0;
            for (var x in obj) {
                count++;
            }
            return count;
        }
        function type(val) {
            if (angular.isUndefined(val)) return "Undefined";
            if (angular.isArray(val)) return "Array";
            if (angular.isDate(val)) return "Date";
            if (angular.isElement(val)) return "Element";
            if (angular.isObject(val)) return "Object";
            if (angular.isString(val)) return "String";
            if (angular.isFunction(val)) return "Function";
            if (angular.isNumber(val)) return "Number";
            if (!!val === val) return "Boolean";
            if (angular.isDefined(val)) return "Defined";
            return null;
        }
        function config(val) {
            if (type(val) == "Object") {

                var valueSet = false;

                if (type(val.checkProto) == "Boolean") {
                    _config.checkProto = val.checkProto;
                    valueSet = true;
                }
                if (type(val.matchPropertyCount) == "Boolean") {
                    _config.matchPropertyCount = val.matchPropertyCount;
                    valueSet = true;
                }
                if (!valueSet) {
                    console.error("Invalid config object");
                }


            } else {
                console.error("Must use object to set config");
                _config = _configModel;
            }
        }

        function getClass(name) {
            if (type(name) != "String") {
                console.error("Must use string to get class");
                return null;
            } else {
                return _classes[name];
            }
        }
        function addClass(name, obj) {
            if (type(name) == "String" && type(obj) == "Object") {
                _classes[name] = obj;
            } else {
                console.error("Must use string/object pair to set class");
            }

        }
        function removeclass(name) {
            if (type(name) == "String") {
                delete _classes[name];
            } else {
                console.error("Must use string to remove class");
            }
        }
        function getAllClasses() {
            return _classes;
        }
        function removeAllClasses() {
            _classes = {};
        }
    }
})();
