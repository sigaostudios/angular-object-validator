(function () {
    "use strict";
    angular.module('ObjectValidator', []);
})();
(function () {
    "use strict"
    angular.module('ObjectValidator').factory('objectValidator', objectValidator);

    objectValidator.$inject = [];

    function objectValidator() {
        var _strictMode = true;
        var _classes = {};

        var service = {
            test: test,
            type: type,
            setStrictMode:setStrictMode,
            getClass: getClass,
            addClass: addClass,
            removeclass:removeclass,
            getAllClasses: getAllClasses,
            removeAllClasses: removeAllClasses

        }
        return service;

        function test(className, testTarget) {
            var strictMode = _strictMode;
            var isValid = true;
            if (type(testTarget) != "Object" || type(className) != "String") {
                console.error("Validate object must receive 2 objects and an optional 'strict mode' boolean");
                return false;
            }

            var model = getClass(className);

            //test that number of properties are the same
            if (Object.keys(testTarget).length != Object.keys(model).length) return false;

            return checkObjects(testTarget, model, strictMode);
        }
        function checkObjects(testTarget, model, strictMode) {
            var isValid = true;
            var count = 0;
            for (var property in model) {
                if (model.hasOwnProperty(property)) {
                    var targetProperty = Object.keys(testTarget)[count];
                    var targetPropertyType = type(testTarget[Object.keys(testTarget)[count]]);
                    var modelPropertyType = type(model[property]);

                    //check property names are same
                    if (strictMode) {
                        if (targetProperty !== property) {
                            isValid = false;
                            break;
                        }
                    }

                    //make sure types are the same
                    if (targetPropertyType !== modelPropertyType) {
                        isValid = false;
                        break;
                    }

                    if (targetPropertyType == "Object") {
                        isValid = checkObjects(testTarget[Object.keys(testTarget)[count]], model[property], strictMode);
                    }

                    count++;
                }
            }
            return isValid;
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
        function setStrictMode(val) {
            if (type(val) != "Boolean") {
                console.error("Must use boolean to set strict mode");
            } else {
                _strictMode = val;
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
        function removeclass(name){
             if (type(name) == "String") {
               delete _classes[name];
            } else {
                console.error("Must use string to remove class");
            }
        }
        function getAllClasses(){
            return _classes;
        }
        function removeAllClasses(){
           _classes = {};          
        }
    }
})();
