const express = require("express");
const error = require("./errors");

const apiKeys = ["AndYouDontSeemToUnderstand", "ItsAShameYouSeemedLikeAnHonestMan"];

//TODO: Switch to using body for user privacy
function api(req, res, next) {
    const key = req.query["api-key"];
    //const key = req.body["api-key"];

    if (!key) next(error(400, "API Key Required"));
    if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

    //req.key = key;
    next();
}
module.exports = api;