var pagedown = require("pagedown");
global.window.Markdown = pagedown;
global.window.Markdown.HookCollection = HookCollection;

var editor = require("./Markdown.Editor");

exports.getPagedownEditor = function() {
    return new Markdown.Editor(pagedown.getSanitizingConverter());
}

function identity(x) { return x; }
function returnFalse(x) { return false; }
function HookCollection() { }

HookCollection.prototype = {

    chain: function (hookname, func) {
        var original = this[hookname];
        if (!original)
            throw new Error("unknown hook " + hookname);

        if (original === identity)
            this[hookname] = func;
        else
            this[hookname] = function (x) { return func(original(x)); }
    },
    set: function (hookname, func) {
        if (!this[hookname])
            throw new Error("unknown hook " + hookname);
        this[hookname] = func;
    },
    addNoop: function (hookname) {
        this[hookname] = identity;
    },
    addFalse: function (hookname) {
        this[hookname] = returnFalse;
    }
};
