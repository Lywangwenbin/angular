'use strict';"use strict";
var browser_common_1 = require('angular2/src/platform/browser_common');
exports.BROWSER_PROVIDERS = browser_common_1.BROWSER_PROVIDERS;
exports.ELEMENT_PROBE_PROVIDERS = browser_common_1.ELEMENT_PROBE_PROVIDERS;
exports.ELEMENT_PROBE_PROVIDERS_PROD_MODE = browser_common_1.ELEMENT_PROBE_PROVIDERS_PROD_MODE;
exports.inspectNativeElement = browser_common_1.inspectNativeElement;
exports.BrowserDomAdapter = browser_common_1.BrowserDomAdapter;
exports.By = browser_common_1.By;
exports.Title = browser_common_1.Title;
exports.enableDebugTools = browser_common_1.enableDebugTools;
exports.disableDebugTools = browser_common_1.disableDebugTools;
var lang_1 = require('angular2/src/facade/lang');
var browser_common_2 = require('angular2/src/platform/browser_common');
var core_1 = require('angular2/core');
/**
 * An array of providers that should be passed into `application()` when bootstrapping a component
 * when all templates
 * have been precompiled offline.
 */
exports.BROWSER_APP_PROVIDERS = lang_1.CONST_EXPR(browser_common_2.BROWSER_APP_COMMON_PROVIDERS);
/**
 * See {@link bootstrap} for more information.
 */
function bootstrapStatic(appComponentType, customProviders, initReflector) {
    if (lang_1.isPresent(initReflector)) {
        initReflector();
    }
    var appProviders = lang_1.isPresent(customProviders) ? [exports.BROWSER_APP_PROVIDERS, customProviders] : exports.BROWSER_APP_PROVIDERS;
    return core_1.platform(browser_common_2.BROWSER_PROVIDERS).application(appProviders).bootstrap(appComponentType);
}
exports.bootstrapStatic = bootstrapStatic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zdGF0aWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLU1EOGFjd3g5LnRtcC9hbmd1bGFyMi9wbGF0Zm9ybS9icm93c2VyX3N0YXRpYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsK0JBVU8sc0NBQXNDLENBQUM7QUFUNUMsK0RBQWlCO0FBQ2pCLDJFQUF1QjtBQUN2QiwrRkFBaUM7QUFDakMscUVBQW9CO0FBQ3BCLCtEQUFpQjtBQUNqQixpQ0FBRTtBQUNGLHVDQUFLO0FBQ0wsNkRBQWdCO0FBQ2hCLCtEQUM0QztBQUU5QyxxQkFBMEMsMEJBQTBCLENBQUMsQ0FBQTtBQUNyRSwrQkFHTyxzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlDLHFCQUFxQyxlQUFlLENBQUMsQ0FBQTtBQUVyRDs7OztHQUlHO0FBQ1UsNkJBQXFCLEdBQzlCLGlCQUFVLENBQUMsNkNBQTRCLENBQUMsQ0FBQztBQUU3Qzs7R0FFRztBQUNILHlCQUFnQyxnQkFBc0IsRUFDdEIsZUFBd0QsRUFDeEQsYUFBd0I7SUFDdEQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsYUFBYSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQUksWUFBWSxHQUNaLGdCQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyw2QkFBcUIsRUFBRSxlQUFlLENBQUMsR0FBRyw2QkFBcUIsQ0FBQztJQUNsRyxNQUFNLENBQUMsZUFBUSxDQUFDLGtDQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzNGLENBQUM7QUFWZSx1QkFBZSxrQkFVOUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2FuZ3VsYXJfZW50cnlwb2ludCc7XG5leHBvcnQge1xuICBCUk9XU0VSX1BST1ZJREVSUyxcbiAgRUxFTUVOVF9QUk9CRV9QUk9WSURFUlMsXG4gIEVMRU1FTlRfUFJPQkVfUFJPVklERVJTX1BST0RfTU9ERSxcbiAgaW5zcGVjdE5hdGl2ZUVsZW1lbnQsXG4gIEJyb3dzZXJEb21BZGFwdGVyLFxuICBCeSxcbiAgVGl0bGUsXG4gIGVuYWJsZURlYnVnVG9vbHMsXG4gIGRpc2FibGVEZWJ1Z1Rvb2xzXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9wbGF0Zm9ybS9icm93c2VyX2NvbW1vbic7XG5cbmltcG9ydCB7VHlwZSwgaXNQcmVzZW50LCBDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtcbiAgQlJPV1NFUl9QUk9WSURFUlMsXG4gIEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlNcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2Jyb3dzZXJfY29tbW9uJztcbmltcG9ydCB7Q29tcG9uZW50UmVmLCBwbGF0Zm9ybX0gZnJvbSAnYW5ndWxhcjIvY29yZSc7XG5cbi8qKlxuICogQW4gYXJyYXkgb2YgcHJvdmlkZXJzIHRoYXQgc2hvdWxkIGJlIHBhc3NlZCBpbnRvIGBhcHBsaWNhdGlvbigpYCB3aGVuIGJvb3RzdHJhcHBpbmcgYSBjb21wb25lbnRcbiAqIHdoZW4gYWxsIHRlbXBsYXRlc1xuICogaGF2ZSBiZWVuIHByZWNvbXBpbGVkIG9mZmxpbmUuXG4gKi9cbmV4cG9ydCBjb25zdCBCUk9XU0VSX0FQUF9QUk9WSURFUlM6IEFycmF5PGFueSAvKlR5cGUgfCBQcm92aWRlciB8IGFueVtdKi8+ID1cbiAgICBDT05TVF9FWFBSKEJST1dTRVJfQVBQX0NPTU1PTl9QUk9WSURFUlMpO1xuXG4vKipcbiAqIFNlZSB7QGxpbmsgYm9vdHN0cmFwfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJvb3RzdHJhcFN0YXRpYyhhcHBDb21wb25lbnRUeXBlOiBUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21Qcm92aWRlcnM/OiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdFJlZmxlY3Rvcj86IEZ1bmN0aW9uKTogUHJvbWlzZTxDb21wb25lbnRSZWY+IHtcbiAgaWYgKGlzUHJlc2VudChpbml0UmVmbGVjdG9yKSkge1xuICAgIGluaXRSZWZsZWN0b3IoKTtcbiAgfVxuXG4gIGxldCBhcHBQcm92aWRlcnMgPVxuICAgICAgaXNQcmVzZW50KGN1c3RvbVByb3ZpZGVycykgPyBbQlJPV1NFUl9BUFBfUFJPVklERVJTLCBjdXN0b21Qcm92aWRlcnNdIDogQlJPV1NFUl9BUFBfUFJPVklERVJTO1xuICByZXR1cm4gcGxhdGZvcm0oQlJPV1NFUl9QUk9WSURFUlMpLmFwcGxpY2F0aW9uKGFwcFByb3ZpZGVycykuYm9vdHN0cmFwKGFwcENvbXBvbmVudFR5cGUpO1xufVxuIl19