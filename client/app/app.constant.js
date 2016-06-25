(function(angular, undefined) {
  angular.module("higginsApp.constants", [])

.constant("moment", moment)
.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
})

;
})(angular);
