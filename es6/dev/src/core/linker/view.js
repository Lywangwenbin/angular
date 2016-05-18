var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ListWrapper, MapWrapper, Map, StringMapWrapper } from 'angular2/src/facade/collection';
import { Locals } from 'angular2/src/core/change_detection/change_detection';
import { DebugContext } from 'angular2/src/core/change_detection/interfaces';
import { AppElement } from './element';
import { isPresent, isBlank, CONST, CONST_EXPR } from 'angular2/src/facade/lang';
import { BaseException } from 'angular2/src/facade/exceptions';
import { RenderDebugInfo } from 'angular2/src/core/render/api';
import { ViewRef_ } from './view_ref';
import { ProtoPipes } from 'angular2/src/core/pipes/pipes';
import { camelCaseToDashCase } from 'angular2/src/core/render/util';
export { DebugContext } from 'angular2/src/core/change_detection/interfaces';
import { Pipes } from 'angular2/src/core/pipes/pipes';
import { ViewType } from './view_type';
const REFLECT_PREFIX = 'ng-reflect-';
const EMPTY_CONTEXT = CONST_EXPR(new Object());
/**
 * Cost of making objects: http://jsperf.com/instantiate-size-of-object
 *
 */
export class AppView {
    constructor(proto, renderer, viewManager, projectableNodes, containerAppElement, imperativelyCreatedProviders, rootInjector, changeDetector) {
        this.proto = proto;
        this.renderer = renderer;
        this.viewManager = viewManager;
        this.projectableNodes = projectableNodes;
        this.containerAppElement = containerAppElement;
        this.changeDetector = changeDetector;
        /**
         * The context against which data-binding expressions in this view are evaluated against.
         * This is always a component instance.
         */
        this.context = null;
        this.destroyed = false;
        this.ref = new ViewRef_(this);
        var injectorWithHostBoundary = AppElement.getViewParentInjector(this.proto.type, containerAppElement, imperativelyCreatedProviders, rootInjector);
        this.parentInjector = injectorWithHostBoundary.injector;
        this.hostInjectorBoundary = injectorWithHostBoundary.hostInjectorBoundary;
        var pipes;
        var context;
        switch (proto.type) {
            case ViewType.COMPONENT:
                pipes = new Pipes(proto.protoPipes, containerAppElement.getInjector());
                context = containerAppElement.getComponent();
                break;
            case ViewType.EMBEDDED:
                pipes = containerAppElement.parentView.pipes;
                context = containerAppElement.parentView.context;
                break;
            case ViewType.HOST:
                pipes = null;
                context = EMPTY_CONTEXT;
                break;
        }
        this.pipes = pipes;
        this.context = context;
    }
    init(rootNodesOrAppElements, allNodes, disposables, appElements) {
        this.rootNodesOrAppElements = rootNodesOrAppElements;
        this.allNodes = allNodes;
        this.disposables = disposables;
        this.appElements = appElements;
        var localsMap = new Map();
        StringMapWrapper.forEach(this.proto.templateVariableBindings, (templateName, _) => { localsMap.set(templateName, null); });
        for (var i = 0; i < appElements.length; i++) {
            var appEl = appElements[i];
            var providerTokens = [];
            if (isPresent(appEl.proto.protoInjector)) {
                for (var j = 0; j < appEl.proto.protoInjector.numberOfProviders; j++) {
                    providerTokens.push(appEl.proto.protoInjector.getProviderAtIndex(j).key.token);
                }
            }
            StringMapWrapper.forEach(appEl.proto.directiveVariableBindings, (directiveIndex, name) => {
                if (isBlank(directiveIndex)) {
                    localsMap.set(name, appEl.nativeElement);
                }
                else {
                    localsMap.set(name, appEl.getDirectiveAtIndex(directiveIndex));
                }
            });
            this.renderer.setElementDebugInfo(appEl.nativeElement, new RenderDebugInfo(appEl.getInjector(), appEl.getComponent(), providerTokens, localsMap));
        }
        var parentLocals = null;
        if (this.proto.type !== ViewType.COMPONENT) {
            parentLocals =
                isPresent(this.containerAppElement) ? this.containerAppElement.parentView.locals : null;
        }
        if (this.proto.type === ViewType.COMPONENT) {
            // Note: the render nodes have been attached to their host element
            // in the ViewFactory already.
            this.containerAppElement.attachComponentView(this);
            this.containerAppElement.parentView.changeDetector.addViewChild(this.changeDetector);
        }
        this.locals = new Locals(parentLocals, localsMap);
        this.changeDetector.hydrate(this.context, this.locals, this, this.pipes);
        this.viewManager.onViewCreated(this);
    }
    destroy() {
        if (this.destroyed) {
            throw new BaseException('This view has already been destroyed!');
        }
        this.changeDetector.destroyRecursive();
    }
    notifyOnDestroy() {
        this.destroyed = true;
        var hostElement = this.proto.type === ViewType.COMPONENT ? this.containerAppElement.nativeElement : null;
        this.renderer.destroyView(hostElement, this.allNodes);
        for (var i = 0; i < this.disposables.length; i++) {
            this.disposables[i]();
        }
        this.viewManager.onViewDestroyed(this);
    }
    get changeDetectorRef() { return this.changeDetector.ref; }
    get flatRootNodes() { return flattenNestedViewRenderNodes(this.rootNodesOrAppElements); }
    hasLocal(contextName) {
        return StringMapWrapper.contains(this.proto.templateVariableBindings, contextName);
    }
    setLocal(contextName, value) {
        if (!this.hasLocal(contextName)) {
            return;
        }
        var templateName = this.proto.templateVariableBindings[contextName];
        this.locals.set(templateName, value);
    }
    // dispatch to element injector or text nodes based on context
    notifyOnBinding(b, currentValue) {
        if (b.isTextNode()) {
            this.renderer.setText(this.allNodes[b.elementIndex], currentValue);
        }
        else {
            var nativeElement = this.appElements[b.elementIndex].nativeElement;
            if (b.isElementProperty()) {
                this.renderer.setElementProperty(nativeElement, b.name, currentValue);
            }
            else if (b.isElementAttribute()) {
                this.renderer.setElementAttribute(nativeElement, b.name, isPresent(currentValue) ? `${currentValue}` : null);
            }
            else if (b.isElementClass()) {
                this.renderer.setElementClass(nativeElement, b.name, currentValue);
            }
            else if (b.isElementStyle()) {
                var unit = isPresent(b.unit) ? b.unit : '';
                this.renderer.setElementStyle(nativeElement, b.name, isPresent(currentValue) ? `${currentValue}${unit}` : null);
            }
            else {
                throw new BaseException('Unsupported directive record');
            }
        }
    }
    logBindingUpdate(b, value) {
        if (b.isDirective() || b.isElementProperty()) {
            var nativeElement = this.appElements[b.elementIndex].nativeElement;
            this.renderer.setBindingDebugInfo(nativeElement, `${REFLECT_PREFIX}${camelCaseToDashCase(b.name)}`, `${value}`);
        }
    }
    notifyAfterContentChecked() {
        var count = this.appElements.length;
        for (var i = count - 1; i >= 0; i--) {
            this.appElements[i].ngAfterContentChecked();
        }
    }
    notifyAfterViewChecked() {
        var count = this.appElements.length;
        for (var i = count - 1; i >= 0; i--) {
            this.appElements[i].ngAfterViewChecked();
        }
    }
    getDebugContext(appElement, elementIndex, directiveIndex) {
        try {
            if (isBlank(appElement) && elementIndex < this.appElements.length) {
                appElement = this.appElements[elementIndex];
            }
            var container = this.containerAppElement;
            var element = isPresent(appElement) ? appElement.nativeElement : null;
            var componentElement = isPresent(container) ? container.nativeElement : null;
            var directive = isPresent(directiveIndex) ? appElement.getDirectiveAtIndex(directiveIndex) : null;
            var injector = isPresent(appElement) ? appElement.getInjector() : null;
            return new DebugContext(element, componentElement, directive, this.context, _localsToStringMap(this.locals), injector);
        }
        catch (e) {
            // TODO: vsavkin log the exception once we have a good way to log errors and warnings
            // if an error happens during getting the debug context, we return null.
            return null;
        }
    }
    getDirectiveFor(directive) {
        return this.appElements[directive.elementIndex].getDirectiveAtIndex(directive.directiveIndex);
    }
    getDetectorFor(directive) {
        var componentView = this.appElements[directive.elementIndex].componentView;
        return isPresent(componentView) ? componentView.changeDetector : null;
    }
    /**
     * Triggers the event handlers for the element and the directives.
     *
     * This method is intended to be called from directive EventEmitters.
     *
     * @param {string} eventName
     * @param {*} eventObj
     * @param {number} boundElementIndex
     * @return false if preventDefault must be applied to the DOM event
     */
    triggerEventHandlers(eventName, eventObj, boundElementIndex) {
        return this.changeDetector.handleEvent(eventName, boundElementIndex, eventObj);
    }
}
function _localsToStringMap(locals) {
    var res = {};
    var c = locals;
    while (isPresent(c)) {
        res = StringMapWrapper.merge(res, MapWrapper.toStringMap(c.current));
        c = c.parent;
    }
    return res;
}
/**
 *
 */
export class AppProtoView {
    constructor(type, protoPipes, templateVariableBindings) {
        this.type = type;
        this.protoPipes = protoPipes;
        this.templateVariableBindings = templateVariableBindings;
    }
    static create(metadataCache, type, pipes, templateVariableBindings) {
        var protoPipes = null;
        if (isPresent(pipes) && pipes.length > 0) {
            var boundPipes = ListWrapper.createFixedSize(pipes.length);
            for (var i = 0; i < pipes.length; i++) {
                boundPipes[i] = metadataCache.getResolvedPipeMetadata(pipes[i]);
            }
            protoPipes = ProtoPipes.fromProviders(boundPipes);
        }
        return new AppProtoView(type, protoPipes, templateVariableBindings);
    }
}
export let HostViewFactory = class HostViewFactory {
    constructor(selector, viewFactory) {
        this.selector = selector;
        this.viewFactory = viewFactory;
    }
};
HostViewFactory = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [String, Function])
], HostViewFactory);
export function flattenNestedViewRenderNodes(nodes) {
    return _flattenNestedViewRenderNodes(nodes, []);
}
function _flattenNestedViewRenderNodes(nodes, renderNodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node instanceof AppElement) {
            var appEl = node;
            renderNodes.push(appEl.nativeElement);
            if (isPresent(appEl.nestedViews)) {
                for (var k = 0; k < appEl.nestedViews.length; k++) {
                    _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
                }
            }
        }
        else {
            renderNodes.push(node);
        }
    }
    return renderNodes;
}
export function findLastRenderNode(node) {
    var lastNode;
    if (node instanceof AppElement) {
        var appEl = node;
        lastNode = appEl.nativeElement;
        if (isPresent(appEl.nestedViews)) {
            // Note: Views might have no root nodes at all!
            for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
                var nestedView = appEl.nestedViews[i];
                if (nestedView.rootNodesOrAppElements.length > 0) {
                    lastNode = findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
                }
            }
        }
    }
    else {
        lastNode = node;
    }
    return lastNode;
}
export function checkSlotCount(componentName, expectedSlotCount, projectableNodes) {
    var givenSlotCount = isPresent(projectableNodes) ? projectableNodes.length : 0;
    if (givenSlotCount < expectedSlotCount) {
        throw new BaseException(`The component ${componentName} has ${expectedSlotCount} <ng-content> elements,` +
            ` but only ${givenSlotCount} slots were provided.`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUp0Y2lRalEudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztPQUFPLEVBQ0wsV0FBVyxFQUNYLFVBQVUsRUFDVixHQUFHLEVBQ0gsZ0JBQWdCLEVBQ2pCLE1BQU0sZ0NBQWdDO09BQ2hDLEVBS0wsTUFBTSxFQUdQLE1BQU0scURBQXFEO09BRXJELEVBQUMsWUFBWSxFQUFDLE1BQU0sK0NBQStDO09BRW5FLEVBQWtCLFVBQVUsRUFBb0IsTUFBTSxXQUFXO09BQ2pFLEVBQ0wsU0FBUyxFQUNULE9BQU8sRUFJUCxLQUFLLEVBQ0wsVUFBVSxFQUNYLE1BQU0sMEJBQTBCO09BQzFCLEVBQUMsYUFBYSxFQUFtQixNQUFNLGdDQUFnQztPQUN2RSxFQUF5QixlQUFlLEVBQUMsTUFBTSw4QkFBOEI7T0FDN0UsRUFBQyxRQUFRLEVBQXFCLE1BQU0sWUFBWTtPQUNoRCxFQUFDLFVBQVUsRUFBQyxNQUFNLCtCQUErQjtPQUNqRCxFQUFDLG1CQUFtQixFQUFDLE1BQU0sK0JBQStCO0FBRWpFLFNBQVEsWUFBWSxRQUFPLCtDQUErQyxDQUFDO09BQ3BFLEVBQUMsS0FBSyxFQUFDLE1BQU0sK0JBQStCO09BRzVDLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYTtBQUVwQyxNQUFNLGNBQWMsR0FBVyxhQUFhLENBQUM7QUFFN0MsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsQ0FBQztBQUUvQzs7O0dBR0c7QUFDSDtJQWdDRSxZQUFtQixLQUFtQixFQUFTLFFBQWtCLEVBQzlDLFdBQTRCLEVBQVMsZ0JBQW9DLEVBQ3pFLG1CQUErQixFQUN0Qyw0QkFBZ0QsRUFBRSxZQUFzQixFQUNqRSxjQUE4QjtRQUo5QixVQUFLLEdBQUwsS0FBSyxDQUFjO1FB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QUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN2RCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pELFFBQVEsR0FBRyxrQkFBa0IsQ0FDekIsVUFBVSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sUUFBUSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBRUQsK0JBQStCLGFBQXFCLEVBQUUsaUJBQXlCLEVBQ2hELGdCQUF5QjtJQUN0RCxJQUFJLGNBQWMsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQy9FLEVBQUUsQ0FBQyxDQUFDLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLGFBQWEsQ0FDbkIsaUJBQWlCLGFBQWEsUUFBUSxpQkFBaUIseUJBQXlCO1lBQ2hGLGFBQWEsY0FBYyx1QkFBdUIsQ0FBQyxDQUFDO0lBQzFELENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTGlzdFdyYXBwZXIsXG4gIE1hcFdyYXBwZXIsXG4gIE1hcCxcbiAgU3RyaW5nTWFwV3JhcHBlcixcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yLFxuICBDaGFuZ2VEaXNwYXRjaGVyLFxuICBEaXJlY3RpdmVJbmRleCxcbiAgQmluZGluZ1RhcmdldCxcbiAgTG9jYWxzLFxuICBQcm90b0NoYW5nZURldGVjdG9yLFxuICBDaGFuZ2VEZXRlY3RvclJlZlxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24nO1xuaW1wb3J0IHtSZXNvbHZlZFByb3ZpZGVyLCBJbmplY3RhYmxlLCBJbmplY3Rvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtEZWJ1Z0NvbnRleHR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vaW50ZXJmYWNlcyc7XG5cbmltcG9ydCB7QXBwUHJvdG9FbGVtZW50LCBBcHBFbGVtZW50LCBEaXJlY3RpdmVQcm92aWRlcn0gZnJvbSAnLi9lbGVtZW50JztcbmltcG9ydCB7XG4gIGlzUHJlc2VudCxcbiAgaXNCbGFuayxcbiAgVHlwZSxcbiAgaXNBcnJheSxcbiAgaXNOdW1iZXIsXG4gIENPTlNULFxuICBDT05TVF9FWFBSXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge1JlbmRlcmVyLCBSb290UmVuZGVyZXIsIFJlbmRlckRlYnVnSW5mb30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5pbXBvcnQge1ZpZXdSZWZfLCBIb3N0Vmlld0ZhY3RvcnlSZWZ9IGZyb20gJy4vdmlld19yZWYnO1xuaW1wb3J0IHtQcm90b1BpcGVzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9waXBlcy9waXBlcyc7XG5pbXBvcnQge2NhbWVsQ2FzZVRvRGFzaENhc2V9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3JlbmRlci91dGlsJztcblxuZXhwb3J0IHtEZWJ1Z0NvbnRleHR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vaW50ZXJmYWNlcyc7XG5pbXBvcnQge1BpcGVzfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9waXBlcy9waXBlcyc7XG5pbXBvcnQge0FwcFZpZXdNYW5hZ2VyXywgQXBwVmlld01hbmFnZXJ9IGZyb20gJy4vdmlld19tYW5hZ2VyJztcbmltcG9ydCB7UmVzb2x2ZWRNZXRhZGF0YUNhY2hlfSBmcm9tICcuL3Jlc29sdmVkX21ldGFkYXRhX2NhY2hlJztcbmltcG9ydCB7Vmlld1R5cGV9IGZyb20gJy4vdmlld190eXBlJztcblxuY29uc3QgUkVGTEVDVF9QUkVGSVg6IHN0cmluZyA9ICduZy1yZWZsZWN0LSc7XG5cbmNvbnN0IEVNUFRZX0NPTlRFWFQgPSBDT05TVF9FWFBSKG5ldyBPYmplY3QoKSk7XG5cbi8qKlxuICogQ29zdCBvZiBtYWtpbmcgb2JqZWN0czogaHR0cDovL2pzcGVyZi5jb20vaW5zdGFudGlhdGUtc2l6ZS1vZi1vYmplY3RcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBWaWV3IGltcGxlbWVudHMgQ2hhbmdlRGlzcGF0Y2hlciB7XG4gIHJlZjogVmlld1JlZl87XG4gIHJvb3ROb2Rlc09yQXBwRWxlbWVudHM6IGFueVtdO1xuICBhbGxOb2RlczogYW55W107XG4gIGRpc3Bvc2FibGVzOiBGdW5jdGlvbltdO1xuICBhcHBFbGVtZW50czogQXBwRWxlbWVudFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGV4dCBhZ2FpbnN0IHdoaWNoIGRhdGEtYmluZGluZyBleHByZXNzaW9ucyBpbiB0aGlzIHZpZXcgYXJlIGV2YWx1YXRlZCBhZ2FpbnN0LlxuICAgKiBUaGlzIGlzIGFsd2F5cyBhIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAgICovXG4gIGNvbnRleHQ6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFZhcmlhYmxlcywgbG9jYWwgdG8gdGhpcyB2aWV3LCB0aGF0IGNhbiBiZSB1c2VkIGluIGJpbmRpbmcgZXhwcmVzc2lvbnMgKGluIGFkZGl0aW9uIHRvIHRoZVxuICAgKiBjb250ZXh0KS4gVGhpcyBpcyB1c2VkIGZvciB0aGluZyBsaWtlIGA8dmlkZW8gI3BsYXllcj5gIG9yXG4gICAqIGA8bGkgdGVtcGxhdGU9XCJmb3IgI2l0ZW0gb2YgaXRlbXNcIj5gLCB3aGVyZSBcInBsYXllclwiIGFuZCBcIml0ZW1cIiBhcmUgbG9jYWxzLCByZXNwZWN0aXZlbHkuXG4gICAqL1xuICBsb2NhbHM6IExvY2FscztcblxuICBwaXBlczogUGlwZXM7XG5cbiAgcGFyZW50SW5qZWN0b3I6IEluamVjdG9yO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHJvb3QgaW5qZWN0b3JzIG9mIHRoaXMgdmlld1xuICAgKiBoYXZlIGEgaG9zdEJvdW5kYXJ5LlxuICAgKi9cbiAgaG9zdEluamVjdG9yQm91bmRhcnk6IGJvb2xlYW47XG5cbiAgZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHByb3RvOiBBcHBQcm90b1ZpZXcsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyB2aWV3TWFuYWdlcjogQXBwVmlld01hbmFnZXJfLCBwdWJsaWMgcHJvamVjdGFibGVOb2RlczogQXJyYXk8YW55IHwgYW55W10+LFxuICAgICAgICAgICAgICBwdWJsaWMgY29udGFpbmVyQXBwRWxlbWVudDogQXBwRWxlbWVudCxcbiAgICAgICAgICAgICAgaW1wZXJhdGl2ZWx5Q3JlYXRlZFByb3ZpZGVyczogUmVzb2x2ZWRQcm92aWRlcltdLCByb290SW5qZWN0b3I6IEluamVjdG9yLFxuICAgICAgICAgICAgICBwdWJsaWMgY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yKSB7XG4gICAgdGhpcy5yZWYgPSBuZXcgVmlld1JlZl8odGhpcyk7XG4gICAgdmFyIGluamVjdG9yV2l0aEhvc3RCb3VuZGFyeSA9IEFwcEVsZW1lbnQuZ2V0Vmlld1BhcmVudEluamVjdG9yKFxuICAgICAgICB0aGlzLnByb3RvLnR5cGUsIGNvbnRhaW5lckFwcEVsZW1lbnQsIGltcGVyYXRpdmVseUNyZWF0ZWRQcm92aWRlcnMsIHJvb3RJbmplY3Rvcik7XG4gICAgdGhpcy5wYXJlbnRJbmplY3RvciA9IGluamVjdG9yV2l0aEhvc3RCb3VuZGFyeS5pbmplY3RvcjtcbiAgICB0aGlzLmhvc3RJbmplY3RvckJvdW5kYXJ5ID0gaW5qZWN0b3JXaXRoSG9zdEJvdW5kYXJ5Lmhvc3RJbmplY3RvckJvdW5kYXJ5O1xuICAgIHZhciBwaXBlcztcbiAgICB2YXIgY29udGV4dDtcbiAgICBzd2l0Y2ggKHByb3RvLnR5cGUpIHtcbiAgICAgIGNhc2UgVmlld1R5cGUuQ09NUE9ORU5UOlxuICAgICAgICBwaXBlcyA9IG5ldyBQaXBlcyhwcm90by5wcm90b1BpcGVzLCBjb250YWluZXJBcHBFbGVtZW50LmdldEluamVjdG9yKCkpO1xuICAgICAgICBjb250ZXh0ID0gY29udGFpbmVyQXBwRWxlbWVudC5nZXRDb21wb25lbnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFZpZXdUeXBlLkVNQkVEREVEOlxuICAgICAgICBwaXBlcyA9IGNvbnRhaW5lckFwcEVsZW1lbnQucGFyZW50Vmlldy5waXBlcztcbiAgICAgICAgY29udGV4dCA9IGNvbnRhaW5lckFwcEVsZW1lbnQucGFyZW50Vmlldy5jb250ZXh0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVmlld1R5cGUuSE9TVDpcbiAgICAgICAgcGlwZXMgPSBudWxsO1xuICAgICAgICBjb250ZXh0ID0gRU1QVFlfQ09OVEVYVDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMucGlwZXMgPSBwaXBlcztcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICB9XG5cbiAgaW5pdChyb290Tm9kZXNPckFwcEVsZW1lbnRzOiBhbnlbXSwgYWxsTm9kZXM6IGFueVtdLCBkaXNwb3NhYmxlczogRnVuY3Rpb25bXSxcbiAgICAgICBhcHBFbGVtZW50czogQXBwRWxlbWVudFtdKSB7XG4gICAgdGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzID0gcm9vdE5vZGVzT3JBcHBFbGVtZW50cztcbiAgICB0aGlzLmFsbE5vZGVzID0gYWxsTm9kZXM7XG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IGRpc3Bvc2FibGVzO1xuICAgIHRoaXMuYXBwRWxlbWVudHMgPSBhcHBFbGVtZW50cztcbiAgICB2YXIgbG9jYWxzTWFwID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goXG4gICAgICAgIHRoaXMucHJvdG8udGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzLFxuICAgICAgICAodGVtcGxhdGVOYW1lOiBzdHJpbmcsIF86IHN0cmluZykgPT4geyBsb2NhbHNNYXAuc2V0KHRlbXBsYXRlTmFtZSwgbnVsbCk7IH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXBwRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBhcHBFbCA9IGFwcEVsZW1lbnRzW2ldO1xuICAgICAgdmFyIHByb3ZpZGVyVG9rZW5zID0gW107XG4gICAgICBpZiAoaXNQcmVzZW50KGFwcEVsLnByb3RvLnByb3RvSW5qZWN0b3IpKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXBwRWwucHJvdG8ucHJvdG9JbmplY3Rvci5udW1iZXJPZlByb3ZpZGVyczsgaisrKSB7XG4gICAgICAgICAgcHJvdmlkZXJUb2tlbnMucHVzaChhcHBFbC5wcm90by5wcm90b0luamVjdG9yLmdldFByb3ZpZGVyQXRJbmRleChqKS5rZXkudG9rZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBTdHJpbmdNYXBXcmFwcGVyLmZvckVhY2goYXBwRWwucHJvdG8uZGlyZWN0aXZlVmFyaWFibGVCaW5kaW5ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGlyZWN0aXZlSW5kZXg6IG51bWJlciwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNCbGFuayhkaXJlY3RpdmVJbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxzTWFwLnNldChuYW1lLCBhcHBFbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2Fsc01hcC5zZXQobmFtZSwgYXBwRWwuZ2V0RGlyZWN0aXZlQXRJbmRleChkaXJlY3RpdmVJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50RGVidWdJbmZvKFxuICAgICAgICAgIGFwcEVsLm5hdGl2ZUVsZW1lbnQsIG5ldyBSZW5kZXJEZWJ1Z0luZm8oYXBwRWwuZ2V0SW5qZWN0b3IoKSwgYXBwRWwuZ2V0Q29tcG9uZW50KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlclRva2VucywgbG9jYWxzTWFwKSk7XG4gICAgfVxuICAgIHZhciBwYXJlbnRMb2NhbHMgPSBudWxsO1xuICAgIGlmICh0aGlzLnByb3RvLnR5cGUgIT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgICAgcGFyZW50TG9jYWxzID1cbiAgICAgICAgICBpc1ByZXNlbnQodGhpcy5jb250YWluZXJBcHBFbGVtZW50KSA/IHRoaXMuY29udGFpbmVyQXBwRWxlbWVudC5wYXJlbnRWaWV3LmxvY2FscyA6IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnByb3RvLnR5cGUgPT09IFZpZXdUeXBlLkNPTVBPTkVOVCkge1xuICAgICAgLy8gTm90ZTogdGhlIHJlbmRlciBub2RlcyBoYXZlIGJlZW4gYXR0YWNoZWQgdG8gdGhlaXIgaG9zdCBlbGVtZW50XG4gICAgICAvLyBpbiB0aGUgVmlld0ZhY3RvcnkgYWxyZWFkeS5cbiAgICAgIHRoaXMuY29udGFpbmVyQXBwRWxlbWVudC5hdHRhY2hDb21wb25lbnRWaWV3KHRoaXMpO1xuICAgICAgdGhpcy5jb250YWluZXJBcHBFbGVtZW50LnBhcmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IuYWRkVmlld0NoaWxkKHRoaXMuY2hhbmdlRGV0ZWN0b3IpO1xuICAgIH1cbiAgICB0aGlzLmxvY2FscyA9IG5ldyBMb2NhbHMocGFyZW50TG9jYWxzLCBsb2NhbHNNYXApO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuaHlkcmF0ZSh0aGlzLmNvbnRleHQsIHRoaXMubG9jYWxzLCB0aGlzLCB0aGlzLnBpcGVzKTtcbiAgICB0aGlzLnZpZXdNYW5hZ2VyLm9uVmlld0NyZWF0ZWQodGhpcyk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1RoaXMgdmlldyBoYXMgYWxyZWFkeSBiZWVuIGRlc3Ryb3llZCEnKTtcbiAgICB9XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3Rvci5kZXN0cm95UmVjdXJzaXZlKCk7XG4gIH1cblxuICBub3RpZnlPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHZhciBob3N0RWxlbWVudCA9XG4gICAgICAgIHRoaXMucHJvdG8udHlwZSA9PT0gVmlld1R5cGUuQ09NUE9ORU5UID8gdGhpcy5jb250YWluZXJBcHBFbGVtZW50Lm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuICAgIHRoaXMucmVuZGVyZXIuZGVzdHJveVZpZXcoaG9zdEVsZW1lbnQsIHRoaXMuYWxsTm9kZXMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kaXNwb3NhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlc1tpXSgpO1xuICAgIH1cbiAgICB0aGlzLnZpZXdNYW5hZ2VyLm9uVmlld0Rlc3Ryb3llZCh0aGlzKTtcbiAgfVxuXG4gIGdldCBjaGFuZ2VEZXRlY3RvclJlZigpOiBDaGFuZ2VEZXRlY3RvclJlZiB7IHJldHVybiB0aGlzLmNoYW5nZURldGVjdG9yLnJlZjsgfVxuXG4gIGdldCBmbGF0Um9vdE5vZGVzKCk6IGFueVtdIHsgcmV0dXJuIGZsYXR0ZW5OZXN0ZWRWaWV3UmVuZGVyTm9kZXModGhpcy5yb290Tm9kZXNPckFwcEVsZW1lbnRzKTsgfVxuXG4gIGhhc0xvY2FsKGNvbnRleHROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gU3RyaW5nTWFwV3JhcHBlci5jb250YWlucyh0aGlzLnByb3RvLnRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncywgY29udGV4dE5hbWUpO1xuICB9XG5cbiAgc2V0TG9jYWwoY29udGV4dE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNMb2NhbChjb250ZXh0TmFtZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRlbXBsYXRlTmFtZSA9IHRoaXMucHJvdG8udGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzW2NvbnRleHROYW1lXTtcbiAgICB0aGlzLmxvY2Fscy5zZXQodGVtcGxhdGVOYW1lLCB2YWx1ZSk7XG4gIH1cblxuICAvLyBkaXNwYXRjaCB0byBlbGVtZW50IGluamVjdG9yIG9yIHRleHQgbm9kZXMgYmFzZWQgb24gY29udGV4dFxuICBub3RpZnlPbkJpbmRpbmcoYjogQmluZGluZ1RhcmdldCwgY3VycmVudFZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoYi5pc1RleHROb2RlKCkpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0VGV4dCh0aGlzLmFsbE5vZGVzW2IuZWxlbWVudEluZGV4XSwgY3VycmVudFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5hdGl2ZUVsZW1lbnQgPSB0aGlzLmFwcEVsZW1lbnRzW2IuZWxlbWVudEluZGV4XS5uYXRpdmVFbGVtZW50O1xuICAgICAgaWYgKGIuaXNFbGVtZW50UHJvcGVydHkoKSkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRQcm9wZXJ0eShuYXRpdmVFbGVtZW50LCBiLm5hbWUsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGIuaXNFbGVtZW50QXR0cmlidXRlKCkpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50QXR0cmlidXRlKG5hdGl2ZUVsZW1lbnQsIGIubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJlc2VudChjdXJyZW50VmFsdWUpID8gYCR7Y3VycmVudFZhbHVlfWAgOiBudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAoYi5pc0VsZW1lbnRDbGFzcygpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKG5hdGl2ZUVsZW1lbnQsIGIubmFtZSwgY3VycmVudFZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoYi5pc0VsZW1lbnRTdHlsZSgpKSB7XG4gICAgICAgIHZhciB1bml0ID0gaXNQcmVzZW50KGIudW5pdCkgPyBiLnVuaXQgOiAnJztcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUobmF0aXZlRWxlbWVudCwgYi5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ByZXNlbnQoY3VycmVudFZhbHVlKSA/IGAke2N1cnJlbnRWYWx1ZX0ke3VuaXR9YCA6IG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1Vuc3VwcG9ydGVkIGRpcmVjdGl2ZSByZWNvcmQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2dCaW5kaW5nVXBkYXRlKGI6IEJpbmRpbmdUYXJnZXQsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoYi5pc0RpcmVjdGl2ZSgpIHx8IGIuaXNFbGVtZW50UHJvcGVydHkoKSkge1xuICAgICAgdmFyIG5hdGl2ZUVsZW1lbnQgPSB0aGlzLmFwcEVsZW1lbnRzW2IuZWxlbWVudEluZGV4XS5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRCaW5kaW5nRGVidWdJbmZvKFxuICAgICAgICAgIG5hdGl2ZUVsZW1lbnQsIGAke1JFRkxFQ1RfUFJFRklYfSR7Y2FtZWxDYXNlVG9EYXNoQ2FzZShiLm5hbWUpfWAsIGAke3ZhbHVlfWApO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUFmdGVyQ29udGVudENoZWNrZWQoKTogdm9pZCB7XG4gICAgdmFyIGNvdW50ID0gdGhpcy5hcHBFbGVtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IGNvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuYXBwRWxlbWVudHNbaV0ubmdBZnRlckNvbnRlbnRDaGVja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5QWZ0ZXJWaWV3Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICB2YXIgY291bnQgPSB0aGlzLmFwcEVsZW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gY291bnQgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5hcHBFbGVtZW50c1tpXS5uZ0FmdGVyVmlld0NoZWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBnZXREZWJ1Z0NvbnRleHQoYXBwRWxlbWVudDogQXBwRWxlbWVudCwgZWxlbWVudEluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICBkaXJlY3RpdmVJbmRleDogbnVtYmVyKTogRGVidWdDb250ZXh0IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGlzQmxhbmsoYXBwRWxlbWVudCkgJiYgZWxlbWVudEluZGV4IDwgdGhpcy5hcHBFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgYXBwRWxlbWVudCA9IHRoaXMuYXBwRWxlbWVudHNbZWxlbWVudEluZGV4XTtcbiAgICAgIH1cbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lckFwcEVsZW1lbnQ7XG5cbiAgICAgIHZhciBlbGVtZW50ID0gaXNQcmVzZW50KGFwcEVsZW1lbnQpID8gYXBwRWxlbWVudC5uYXRpdmVFbGVtZW50IDogbnVsbDtcbiAgICAgIHZhciBjb21wb25lbnRFbGVtZW50ID0gaXNQcmVzZW50KGNvbnRhaW5lcikgPyBjb250YWluZXIubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICB2YXIgZGlyZWN0aXZlID1cbiAgICAgICAgICBpc1ByZXNlbnQoZGlyZWN0aXZlSW5kZXgpID8gYXBwRWxlbWVudC5nZXREaXJlY3RpdmVBdEluZGV4KGRpcmVjdGl2ZUluZGV4KSA6IG51bGw7XG4gICAgICB2YXIgaW5qZWN0b3IgPSBpc1ByZXNlbnQoYXBwRWxlbWVudCkgPyBhcHBFbGVtZW50LmdldEluamVjdG9yKCkgOiBudWxsO1xuXG4gICAgICByZXR1cm4gbmV3IERlYnVnQ29udGV4dChlbGVtZW50LCBjb21wb25lbnRFbGVtZW50LCBkaXJlY3RpdmUsIHRoaXMuY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9sb2NhbHNUb1N0cmluZ01hcCh0aGlzLmxvY2FscyksIGluamVjdG9yKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIFRPRE86IHZzYXZraW4gbG9nIHRoZSBleGNlcHRpb24gb25jZSB3ZSBoYXZlIGEgZ29vZCB3YXkgdG8gbG9nIGVycm9ycyBhbmQgd2FybmluZ3NcbiAgICAgIC8vIGlmIGFuIGVycm9yIGhhcHBlbnMgZHVyaW5nIGdldHRpbmcgdGhlIGRlYnVnIGNvbnRleHQsIHdlIHJldHVybiBudWxsLlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGlyZWN0aXZlRm9yKGRpcmVjdGl2ZTogRGlyZWN0aXZlSW5kZXgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmFwcEVsZW1lbnRzW2RpcmVjdGl2ZS5lbGVtZW50SW5kZXhdLmdldERpcmVjdGl2ZUF0SW5kZXgoZGlyZWN0aXZlLmRpcmVjdGl2ZUluZGV4KTtcbiAgfVxuXG4gIGdldERldGVjdG9yRm9yKGRpcmVjdGl2ZTogRGlyZWN0aXZlSW5kZXgpOiBDaGFuZ2VEZXRlY3RvciB7XG4gICAgdmFyIGNvbXBvbmVudFZpZXcgPSB0aGlzLmFwcEVsZW1lbnRzW2RpcmVjdGl2ZS5lbGVtZW50SW5kZXhdLmNvbXBvbmVudFZpZXc7XG4gICAgcmV0dXJuIGlzUHJlc2VudChjb21wb25lbnRWaWV3KSA/IGNvbXBvbmVudFZpZXcuY2hhbmdlRGV0ZWN0b3IgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJzIHRoZSBldmVudCBoYW5kbGVycyBmb3IgdGhlIGVsZW1lbnQgYW5kIHRoZSBkaXJlY3RpdmVzLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnRlbmRlZCB0byBiZSBjYWxsZWQgZnJvbSBkaXJlY3RpdmUgRXZlbnRFbWl0dGVycy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZVxuICAgKiBAcGFyYW0geyp9IGV2ZW50T2JqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBib3VuZEVsZW1lbnRJbmRleFxuICAgKiBAcmV0dXJuIGZhbHNlIGlmIHByZXZlbnREZWZhdWx0IG11c3QgYmUgYXBwbGllZCB0byB0aGUgRE9NIGV2ZW50XG4gICAqL1xuICB0cmlnZ2VyRXZlbnRIYW5kbGVycyhldmVudE5hbWU6IHN0cmluZywgZXZlbnRPYmo6IEV2ZW50LCBib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlRGV0ZWN0b3IuaGFuZGxlRXZlbnQoZXZlbnROYW1lLCBib3VuZEVsZW1lbnRJbmRleCwgZXZlbnRPYmopO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9sb2NhbHNUb1N0cmluZ01hcChsb2NhbHM6IExvY2Fscyk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgdmFyIHJlcyA9IHt9O1xuICB2YXIgYyA9IGxvY2FscztcbiAgd2hpbGUgKGlzUHJlc2VudChjKSkge1xuICAgIHJlcyA9IFN0cmluZ01hcFdyYXBwZXIubWVyZ2UocmVzLCBNYXBXcmFwcGVyLnRvU3RyaW5nTWFwKGMuY3VycmVudCkpO1xuICAgIGMgPSBjLnBhcmVudDtcbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG4vKipcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBBcHBQcm90b1ZpZXcge1xuICBzdGF0aWMgY3JlYXRlKG1ldGFkYXRhQ2FjaGU6IFJlc29sdmVkTWV0YWRhdGFDYWNoZSwgdHlwZTogVmlld1R5cGUsIHBpcGVzOiBUeXBlW10sXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IEFwcFByb3RvVmlldyB7XG4gICAgdmFyIHByb3RvUGlwZXMgPSBudWxsO1xuICAgIGlmIChpc1ByZXNlbnQocGlwZXMpICYmIHBpcGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBib3VuZFBpcGVzID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKHBpcGVzLmxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBpcGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvdW5kUGlwZXNbaV0gPSBtZXRhZGF0YUNhY2hlLmdldFJlc29sdmVkUGlwZU1ldGFkYXRhKHBpcGVzW2ldKTtcbiAgICAgIH1cbiAgICAgIHByb3RvUGlwZXMgPSBQcm90b1BpcGVzLmZyb21Qcm92aWRlcnMoYm91bmRQaXBlcyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQXBwUHJvdG9WaWV3KHR5cGUsIHByb3RvUGlwZXMsIHRlbXBsYXRlVmFyaWFibGVCaW5kaW5ncyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogVmlld1R5cGUsIHB1YmxpYyBwcm90b1BpcGVzOiBQcm90b1BpcGVzLFxuICAgICAgICAgICAgICBwdWJsaWMgdGVtcGxhdGVWYXJpYWJsZUJpbmRpbmdzOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSkge31cbn1cblxuXG5AQ09OU1QoKVxuZXhwb3J0IGNsYXNzIEhvc3RWaWV3RmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWxlY3Rvcjogc3RyaW5nLCBwdWJsaWMgdmlld0ZhY3Rvcnk6IEZ1bmN0aW9uKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2Rlcyhub2RlczogYW55W10pOiBhbnlbXSB7XG4gIHJldHVybiBfZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2Rlcyhub2RlcywgW10pO1xufVxuXG5mdW5jdGlvbiBfZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2Rlcyhub2RlczogYW55W10sIHJlbmRlck5vZGVzOiBhbnlbXSk6IGFueVtdIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBub2RlID0gbm9kZXNbaV07XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcHBFbGVtZW50KSB7XG4gICAgICB2YXIgYXBwRWwgPSA8QXBwRWxlbWVudD5ub2RlO1xuICAgICAgcmVuZGVyTm9kZXMucHVzaChhcHBFbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIGlmIChpc1ByZXNlbnQoYXBwRWwubmVzdGVkVmlld3MpKSB7XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgYXBwRWwubmVzdGVkVmlld3MubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICBfZmxhdHRlbk5lc3RlZFZpZXdSZW5kZXJOb2RlcyhhcHBFbC5uZXN0ZWRWaWV3c1trXS5yb290Tm9kZXNPckFwcEVsZW1lbnRzLCByZW5kZXJOb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVuZGVyTm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlbmRlck5vZGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZExhc3RSZW5kZXJOb2RlKG5vZGU6IGFueSk6IGFueSB7XG4gIHZhciBsYXN0Tm9kZTtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcHBFbGVtZW50KSB7XG4gICAgdmFyIGFwcEVsID0gPEFwcEVsZW1lbnQ+bm9kZTtcbiAgICBsYXN0Tm9kZSA9IGFwcEVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgaWYgKGlzUHJlc2VudChhcHBFbC5uZXN0ZWRWaWV3cykpIHtcbiAgICAgIC8vIE5vdGU6IFZpZXdzIG1pZ2h0IGhhdmUgbm8gcm9vdCBub2RlcyBhdCBhbGwhXG4gICAgICBmb3IgKHZhciBpID0gYXBwRWwubmVzdGVkVmlld3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIG5lc3RlZFZpZXcgPSBhcHBFbC5uZXN0ZWRWaWV3c1tpXTtcbiAgICAgICAgaWYgKG5lc3RlZFZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGFzdE5vZGUgPSBmaW5kTGFzdFJlbmRlck5vZGUoXG4gICAgICAgICAgICAgIG5lc3RlZFZpZXcucm9vdE5vZGVzT3JBcHBFbGVtZW50c1tuZXN0ZWRWaWV3LnJvb3ROb2Rlc09yQXBwRWxlbWVudHMubGVuZ3RoIC0gMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxhc3ROb2RlID0gbm9kZTtcbiAgfVxuICByZXR1cm4gbGFzdE5vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1Nsb3RDb3VudChjb21wb25lbnROYW1lOiBzdHJpbmcsIGV4cGVjdGVkU2xvdENvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGFibGVOb2RlczogYW55W11bXSk6IHZvaWQge1xuICB2YXIgZ2l2ZW5TbG90Q291bnQgPSBpc1ByZXNlbnQocHJvamVjdGFibGVOb2RlcykgPyBwcm9qZWN0YWJsZU5vZGVzLmxlbmd0aCA6IDA7XG4gIGlmIChnaXZlblNsb3RDb3VudCA8IGV4cGVjdGVkU2xvdENvdW50KSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oXG4gICAgICAgIGBUaGUgY29tcG9uZW50ICR7Y29tcG9uZW50TmFtZX0gaGFzICR7ZXhwZWN0ZWRTbG90Q291bnR9IDxuZy1jb250ZW50PiBlbGVtZW50cyxgICtcbiAgICAgICAgYCBidXQgb25seSAke2dpdmVuU2xvdENvdW50fSBzbG90cyB3ZXJlIHByb3ZpZGVkLmApO1xuICB9XG59XG4iXX0=