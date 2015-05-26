'use strict';

var Marionette = require('backbone.marionette'),
    routeManager = require('./routeManager.js');

var Router = Marionette.AppRouter.extend({
    controller: routeManager,
    //Note:  This should match with assembl/lib/frontend_url.py
    appRoutes: {
        "": "home",
        "edition": "edition",
        "partners": "partners",
        "notifications": "notifications",
        "settings": "settings",
        "user/notifications": "userNotifications",
        "user/profile": "profile",
        "user/account": "account",
        "posts/:id": "post",
        "idea/:id": "idea",
        "*actions": "defaults"
    }

});

module.exports = Router;


