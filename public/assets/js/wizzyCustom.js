window.onWizzyScriptLoaded = function () {
    window.wizzyConfig.events.registerEvent(window.wizzyConfig.events.allowedEvents.BEFORE_INIT, function (payload) {
        
        payload.search.view.domSelector = ".wizzy-main-content";
        payload.common.lazyDOMConfig.searchInputIdentifiers.push({dom: "#wizzy-search", type: "text"});
        payload.search.configs.general.formSubmissionBehaviour = "redirect_page";
        payload.common.isLazyInit = true;
        return payload;
    });
}