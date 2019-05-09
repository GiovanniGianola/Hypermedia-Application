'use strict';

var utils = require('../utils/writer.js');
var EventService = require('../service/EventService.js');

var offset = 0;
var limit = 0;

var current_month; 

module.exports.eventsGET = function eventsGET (req, res, next) {
    console.log("eventsGET");

    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    
    req.swagger.params['current_month'].value ? current_month = req.swagger.params['current_month'].value : current_month = undefined;
    
    EventService.eventsGET(offset,limit,current_month)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};