// Generated by CoffeeScript 1.7.1
(function() {
  if (localStorage["version"] == null) {
    localStorage["version"] = "google";
    window.location.reload();
  }

  foundry.angular.dependency = [];

  define('config', function() {
    var config;
    config = {};
    config.appName = 'FoundryTodo';
    config.plugins = {
      Todo: 'app/plugins/todo',
      user: 'core/plugins/user',
      workspace: 'core/plugins/workspace'
    };
    return config;
  });

  foundry.load_plugins();

  Nimbus.Auth.setup({
    'GDrive': {
      'app_id': '696230129324',
      'key': '696230129324-k4g89ugcu02k5obu9hs1u5tp3e54n02u.apps.googleusercontent.com',
      "scope": "openid https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.modify https://apps-apis.google.com/a/feeds/domain/"
    },
    "app_name": "FoundryTodo",
    'synchronous': false
  });

  Nimbus.Auth.authorized_callback = function() {
    if (Nimbus.Auth.authorized()) {
      return $("#login_buttons").addClass("redirect");
    }
  };

  foundry.ready(function() {
    if (Nimbus.Auth.authorized()) {
      foundry.init(function() {
        $('#loading').addClass('loaded');
        return $("#login_buttons").removeClass("redirect");
      });
    }
  });

  $(document).ready(function() {
    $('#google_login').on('click', function(evt) {
      if (!(localStorage["version"] === "google")) {
        localStorage["version"] = "google";
        window.location.reload();
      }
      return Nimbus.Auth.authorize('GDrive');
    });
    $('.logout_btn').on('click', function(evt) {
      foundry.logout();
      return location.reload();
    });
  });

}).call(this);
define('Todo', function(){
  return {
    title : 'Todo', // this will shown as the menu title
    name : 'Todo', // Foundry will add an object with this name, so you can access with it.
    type : 'plugin',
    anchor : '#/Todo', // this property is for angular route
    icon : 'icon-list',
    init : function(){
      // a basic method for foundry to init your plugin
      // we will setup a model here
      var self = this;
      foundry.model('Todo', ['title','completed'], function(model){
        // this callback will return the model being created
        // then you need to make this call to tell foundery 
        // the current plugin is finished loading and ready
        foundry.initialized(self.name);
      });
    },
    inited : function(){ 
       // inited is an optinal method
       // it will be called when all other plugin is loaded
       define_controller();
    }
  } 
});

// maybe some code for angular controller
function define_controller(){
  angular.module('foundry').controller('TodoController', ['$scope', function($scope){
    $scope.todos = [];
    // get a reference with the model we registered above
    todo_model = foundry._models.Todo

    $scope.load = function(){
        $scope.todos = todo_model.all()
    }

    $scope.add_todo = function(){
        todo_model.create({title:$scope.todo_title,completed:false});

        $scope.load();
        $scope.todo_title = '';
    }

    $scope.delete_todo = function(index){
        var id = $scope.todos[index].id,
            todo =todo_model.findByAttribute('id', id);

        todo.destroy();
        $scope.load();
    }

    $scope.load();
  }]);
}
