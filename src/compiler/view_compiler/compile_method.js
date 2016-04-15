'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var o = require('../output/output_ast');
var _DebugState = (function () {
    function _DebugState(nodeIndex, sourceAst) {
        this.nodeIndex = nodeIndex;
        this.sourceAst = sourceAst;
    }
    return _DebugState;
}());
var NULL_DEBUG_STATE = new _DebugState(null, null);
var CompileMethod = (function () {
    function CompileMethod(_view) {
        this._view = _view;
        this._newState = NULL_DEBUG_STATE;
        this._currState = NULL_DEBUG_STATE;
        this._bodyStatements = [];
        this._debugEnabled = this._view.genConfig.genDebugInfo;
    }
    CompileMethod.prototype._updateDebugContextIfNeeded = function () {
        if (this._newState.nodeIndex !== this._currState.nodeIndex ||
            this._newState.sourceAst !== this._currState.sourceAst) {
            var expr = this._updateDebugContext(this._newState);
            if (lang_1.isPresent(expr)) {
                this._bodyStatements.push(expr.toStmt());
            }
        }
    };
    CompileMethod.prototype._updateDebugContext = function (newState) {
        this._currState = this._newState = newState;
        if (this._debugEnabled) {
            var sourceLocation = lang_1.isPresent(newState.sourceAst) ? newState.sourceAst.sourceSpan.start : null;
            return o.THIS_EXPR.callMethod('debug', [
                o.literal(newState.nodeIndex),
                lang_1.isPresent(sourceLocation) ? o.literal(sourceLocation.line) : o.NULL_EXPR,
                lang_1.isPresent(sourceLocation) ? o.literal(sourceLocation.col) : o.NULL_EXPR
            ]);
        }
        else {
            return null;
        }
    };
    CompileMethod.prototype.resetDebugInfoExpr = function (nodeIndex, templateAst) {
        var res = this._updateDebugContext(new _DebugState(nodeIndex, templateAst));
        return lang_1.isPresent(res) ? res : o.NULL_EXPR;
    };
    CompileMethod.prototype.resetDebugInfo = function (nodeIndex, templateAst) {
        this._newState = new _DebugState(nodeIndex, templateAst);
    };
    CompileMethod.prototype.addStmt = function (stmt) {
        this._updateDebugContextIfNeeded();
        this._bodyStatements.push(stmt);
    };
    CompileMethod.prototype.addStmts = function (stmts) {
        this._updateDebugContextIfNeeded();
        collection_1.ListWrapper.addAll(this._bodyStatements, stmts);
    };
    CompileMethod.prototype.finish = function () { return this._bodyStatements; };
    CompileMethod.prototype.isEmpty = function () { return this._bodyStatements.length === 0; };
    return CompileMethod;
}());
exports.CompileMethod = CompileMethod;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9tZXRob2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLThzSDA5WHRZLnRtcC9hbmd1bGFyMi9zcmMvY29tcGlsZXIvdmlld19jb21waWxlci9jb21waWxlX21ldGhvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQWlDLDBCQUEwQixDQUFDLENBQUE7QUFDNUQsMkJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFFdkUsSUFBWSxDQUFDLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUsxQztJQUNFLHFCQUFtQixTQUFpQixFQUFTLFNBQXNCO1FBQWhELGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFhO0lBQUcsQ0FBQztJQUN6RSxrQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFbkQ7SUFRRSx1QkFBb0IsS0FBa0I7UUFBbEIsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQVA5QixjQUFTLEdBQWdCLGdCQUFnQixDQUFDO1FBQzFDLGVBQVUsR0FBZ0IsZ0JBQWdCLENBQUM7UUFJM0Msb0JBQWUsR0FBa0IsRUFBRSxDQUFDO1FBRzFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO0lBQ3pELENBQUM7SUFFTyxtREFBMkIsR0FBbkM7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7WUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLDJDQUFtQixHQUEzQixVQUE0QixRQUFxQjtRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksY0FBYyxHQUNkLGdCQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFFL0UsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtnQkFDckMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2dCQUM3QixnQkFBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTO2dCQUN4RSxnQkFBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTO2FBQ3hFLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUVELDBDQUFrQixHQUFsQixVQUFtQixTQUFpQixFQUFFLFdBQXdCO1FBQzVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0NBQWMsR0FBZCxVQUFlLFNBQWlCLEVBQUUsV0FBd0I7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELCtCQUFPLEdBQVAsVUFBUSxJQUFpQjtRQUN2QixJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsZ0NBQVEsR0FBUixVQUFTLEtBQW9CO1FBQzNCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1FBQ25DLHdCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELDhCQUFNLEdBQU4sY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBRXhELCtCQUFPLEdBQVAsY0FBcUIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsb0JBQUM7QUFBRCxDQUFDLEFBNURELElBNERDO0FBNURZLHFCQUFhLGdCQTREekIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtNYXBXcmFwcGVyLCBMaXN0V3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge1RlbXBsYXRlQXN0fSBmcm9tICcuLi90ZW1wbGF0ZV9hc3QnO1xuXG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5cbmNsYXNzIF9EZWJ1Z1N0YXRlIHtcbiAgY29uc3RydWN0b3IocHVibGljIG5vZGVJbmRleDogbnVtYmVyLCBwdWJsaWMgc291cmNlQXN0OiBUZW1wbGF0ZUFzdCkge31cbn1cblxudmFyIE5VTExfREVCVUdfU1RBVEUgPSBuZXcgX0RlYnVnU3RhdGUobnVsbCwgbnVsbCk7XG5cbmV4cG9ydCBjbGFzcyBDb21waWxlTWV0aG9kIHtcbiAgcHJpdmF0ZSBfbmV3U3RhdGU6IF9EZWJ1Z1N0YXRlID0gTlVMTF9ERUJVR19TVEFURTtcbiAgcHJpdmF0ZSBfY3VyclN0YXRlOiBfRGVidWdTdGF0ZSA9IE5VTExfREVCVUdfU1RBVEU7XG5cbiAgcHJpdmF0ZSBfZGVidWdFbmFibGVkOiBib29sZWFuO1xuXG4gIHByaXZhdGUgX2JvZHlTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB0aGlzLl9kZWJ1Z0VuYWJsZWQgPSB0aGlzLl92aWV3LmdlbkNvbmZpZy5nZW5EZWJ1Z0luZm87XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVEZWJ1Z0NvbnRleHRJZk5lZWRlZCgpIHtcbiAgICBpZiAodGhpcy5fbmV3U3RhdGUubm9kZUluZGV4ICE9PSB0aGlzLl9jdXJyU3RhdGUubm9kZUluZGV4IHx8XG4gICAgICAgIHRoaXMuX25ld1N0YXRlLnNvdXJjZUFzdCAhPT0gdGhpcy5fY3VyclN0YXRlLnNvdXJjZUFzdCkge1xuICAgICAgdmFyIGV4cHIgPSB0aGlzLl91cGRhdGVEZWJ1Z0NvbnRleHQodGhpcy5fbmV3U3RhdGUpO1xuICAgICAgaWYgKGlzUHJlc2VudChleHByKSkge1xuICAgICAgICB0aGlzLl9ib2R5U3RhdGVtZW50cy5wdXNoKGV4cHIudG9TdG10KCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZURlYnVnQ29udGV4dChuZXdTdGF0ZTogX0RlYnVnU3RhdGUpOiBvLkV4cHJlc3Npb24ge1xuICAgIHRoaXMuX2N1cnJTdGF0ZSA9IHRoaXMuX25ld1N0YXRlID0gbmV3U3RhdGU7XG4gICAgaWYgKHRoaXMuX2RlYnVnRW5hYmxlZCkge1xuICAgICAgdmFyIHNvdXJjZUxvY2F0aW9uID1cbiAgICAgICAgICBpc1ByZXNlbnQobmV3U3RhdGUuc291cmNlQXN0KSA/IG5ld1N0YXRlLnNvdXJjZUFzdC5zb3VyY2VTcGFuLnN0YXJ0IDogbnVsbDtcblxuICAgICAgcmV0dXJuIG8uVEhJU19FWFBSLmNhbGxNZXRob2QoJ2RlYnVnJywgW1xuICAgICAgICBvLmxpdGVyYWwobmV3U3RhdGUubm9kZUluZGV4KSxcbiAgICAgICAgaXNQcmVzZW50KHNvdXJjZUxvY2F0aW9uKSA/IG8ubGl0ZXJhbChzb3VyY2VMb2NhdGlvbi5saW5lKSA6IG8uTlVMTF9FWFBSLFxuICAgICAgICBpc1ByZXNlbnQoc291cmNlTG9jYXRpb24pID8gby5saXRlcmFsKHNvdXJjZUxvY2F0aW9uLmNvbCkgOiBvLk5VTExfRVhQUlxuICAgICAgXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0RGVidWdJbmZvRXhwcihub2RlSW5kZXg6IG51bWJlciwgdGVtcGxhdGVBc3Q6IFRlbXBsYXRlQXN0KTogby5FeHByZXNzaW9uIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fdXBkYXRlRGVidWdDb250ZXh0KG5ldyBfRGVidWdTdGF0ZShub2RlSW5kZXgsIHRlbXBsYXRlQXN0KSk7XG4gICAgcmV0dXJuIGlzUHJlc2VudChyZXMpID8gcmVzIDogby5OVUxMX0VYUFI7XG4gIH1cblxuICByZXNldERlYnVnSW5mbyhub2RlSW5kZXg6IG51bWJlciwgdGVtcGxhdGVBc3Q6IFRlbXBsYXRlQXN0KSB7XG4gICAgdGhpcy5fbmV3U3RhdGUgPSBuZXcgX0RlYnVnU3RhdGUobm9kZUluZGV4LCB0ZW1wbGF0ZUFzdCk7XG4gIH1cblxuICBhZGRTdG10KHN0bXQ6IG8uU3RhdGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlRGVidWdDb250ZXh0SWZOZWVkZWQoKTtcbiAgICB0aGlzLl9ib2R5U3RhdGVtZW50cy5wdXNoKHN0bXQpO1xuICB9XG5cbiAgYWRkU3RtdHMoc3RtdHM6IG8uU3RhdGVtZW50W10pIHtcbiAgICB0aGlzLl91cGRhdGVEZWJ1Z0NvbnRleHRJZk5lZWRlZCgpO1xuICAgIExpc3RXcmFwcGVyLmFkZEFsbCh0aGlzLl9ib2R5U3RhdGVtZW50cywgc3RtdHMpO1xuICB9XG5cbiAgZmluaXNoKCk6IG8uU3RhdGVtZW50W10geyByZXR1cm4gdGhpcy5fYm9keVN0YXRlbWVudHM7IH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fYm9keVN0YXRlbWVudHMubGVuZ3RoID09PSAwOyB9XG59XG4iXX0=