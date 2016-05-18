'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var constants_1 = require('./constants');
var DirectiveIndex = (function () {
    function DirectiveIndex(elementIndex, directiveIndex) {
        this.elementIndex = elementIndex;
        this.directiveIndex = directiveIndex;
    }
    Object.defineProperty(DirectiveIndex.prototype, "name", {
        get: function () { return this.elementIndex + "_" + this.directiveIndex; },
        enumerable: true,
        configurable: true
    });
    return DirectiveIndex;
}());
exports.DirectiveIndex = DirectiveIndex;
var DirectiveRecord = (function () {
    function DirectiveRecord(_a) {
        var _b = _a === void 0 ? {} : _a, directiveIndex = _b.directiveIndex, callAfterContentInit = _b.callAfterContentInit, callAfterContentChecked = _b.callAfterContentChecked, callAfterViewInit = _b.callAfterViewInit, callAfterViewChecked = _b.callAfterViewChecked, callOnChanges = _b.callOnChanges, callDoCheck = _b.callDoCheck, callOnInit = _b.callOnInit, callOnDestroy = _b.callOnDestroy, changeDetection = _b.changeDetection, outputs = _b.outputs;
        this.directiveIndex = directiveIndex;
        this.callAfterContentInit = lang_1.normalizeBool(callAfterContentInit);
        this.callAfterContentChecked = lang_1.normalizeBool(callAfterContentChecked);
        this.callOnChanges = lang_1.normalizeBool(callOnChanges);
        this.callAfterViewInit = lang_1.normalizeBool(callAfterViewInit);
        this.callAfterViewChecked = lang_1.normalizeBool(callAfterViewChecked);
        this.callDoCheck = lang_1.normalizeBool(callDoCheck);
        this.callOnInit = lang_1.normalizeBool(callOnInit);
        this.callOnDestroy = lang_1.normalizeBool(callOnDestroy);
        this.changeDetection = changeDetection;
        this.outputs = outputs;
    }
    DirectiveRecord.prototype.isDefaultChangeDetection = function () {
        return constants_1.isDefaultChangeDetectionStrategy(this.changeDetection);
    };
    return DirectiveRecord;
}());
exports.DirectiveRecord = DirectiveRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX3JlY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtTUQ4YWN3eDkudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vZGlyZWN0aXZlX3JlY29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUJBQW9ELDBCQUEwQixDQUFDLENBQUE7QUFDL0UsMEJBQXdFLGFBQWEsQ0FBQyxDQUFBO0FBRXRGO0lBQ0Usd0JBQW1CLFlBQW9CLEVBQVMsY0FBc0I7UUFBbkQsaUJBQVksR0FBWixZQUFZLENBQVE7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBUTtJQUFHLENBQUM7SUFFMUUsc0JBQUksZ0NBQUk7YUFBUixjQUFhLE1BQU0sQ0FBSSxJQUFJLENBQUMsWUFBWSxTQUFJLElBQUksQ0FBQyxjQUFnQixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEUscUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLHNCQUFjLGlCQUkxQixDQUFBO0FBRUQ7SUFjRSx5QkFBWSxFQWNOO1lBZE0sNEJBY04sRUFkTyxrQ0FBYyxFQUFFLDhDQUFvQixFQUFFLG9EQUF1QixFQUFFLHdDQUFpQixFQUNoRiw4Q0FBb0IsRUFBRSxnQ0FBYSxFQUFFLDRCQUFXLEVBQUUsMEJBQVUsRUFBRSxnQ0FBYSxFQUMzRSxvQ0FBZSxFQUFFLG9CQUFPO1FBYW5DLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLHVCQUF1QixHQUFHLG9CQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsYUFBYSxHQUFHLG9CQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLG9CQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxXQUFXLEdBQUcsb0JBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLG9CQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxvQkFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrREFBd0IsR0FBeEI7UUFDRSxNQUFNLENBQUMsNENBQWdDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUE3Q0QsSUE2Q0M7QUE3Q1ksdUJBQWUsa0JBNkMzQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTdHJpbmdXcmFwcGVyLCBub3JtYWxpemVCb29sLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtpc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZUluZGV4IHtcbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnRJbmRleDogbnVtYmVyLCBwdWJsaWMgZGlyZWN0aXZlSW5kZXg6IG51bWJlcikge31cblxuICBnZXQgbmFtZSgpIHsgcmV0dXJuIGAke3RoaXMuZWxlbWVudEluZGV4fV8ke3RoaXMuZGlyZWN0aXZlSW5kZXh9YDsgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlyZWN0aXZlUmVjb3JkIHtcbiAgZGlyZWN0aXZlSW5kZXg6IERpcmVjdGl2ZUluZGV4O1xuICBjYWxsQWZ0ZXJDb250ZW50SW5pdDogYm9vbGVhbjtcbiAgY2FsbEFmdGVyQ29udGVudENoZWNrZWQ6IGJvb2xlYW47XG4gIGNhbGxBZnRlclZpZXdJbml0OiBib29sZWFuO1xuICBjYWxsQWZ0ZXJWaWV3Q2hlY2tlZDogYm9vbGVhbjtcbiAgY2FsbE9uQ2hhbmdlczogYm9vbGVhbjtcbiAgY2FsbERvQ2hlY2s6IGJvb2xlYW47XG4gIGNhbGxPbkluaXQ6IGJvb2xlYW47XG4gIGNhbGxPbkRlc3Ryb3k6IGJvb2xlYW47XG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3k7XG4gIC8vIGFycmF5IG9mIFtlbWl0dGVyIHByb3BlcnR5IG5hbWUsIGV2ZW50TmFtZV1cbiAgb3V0cHV0czogc3RyaW5nW11bXTtcblxuICBjb25zdHJ1Y3Rvcih7ZGlyZWN0aXZlSW5kZXgsIGNhbGxBZnRlckNvbnRlbnRJbml0LCBjYWxsQWZ0ZXJDb250ZW50Q2hlY2tlZCwgY2FsbEFmdGVyVmlld0luaXQsXG4gICAgICAgICAgICAgICBjYWxsQWZ0ZXJWaWV3Q2hlY2tlZCwgY2FsbE9uQ2hhbmdlcywgY2FsbERvQ2hlY2ssIGNhbGxPbkluaXQsIGNhbGxPbkRlc3Ryb3ksXG4gICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb24sIG91dHB1dHN9OiB7XG4gICAgZGlyZWN0aXZlSW5kZXg/OiBEaXJlY3RpdmVJbmRleCxcbiAgICBjYWxsQWZ0ZXJDb250ZW50SW5pdD86IGJvb2xlYW4sXG4gICAgY2FsbEFmdGVyQ29udGVudENoZWNrZWQ/OiBib29sZWFuLFxuICAgIGNhbGxBZnRlclZpZXdJbml0PzogYm9vbGVhbixcbiAgICBjYWxsQWZ0ZXJWaWV3Q2hlY2tlZD86IGJvb2xlYW4sXG4gICAgY2FsbE9uQ2hhbmdlcz86IGJvb2xlYW4sXG4gICAgY2FsbERvQ2hlY2s/OiBib29sZWFuLFxuICAgIGNhbGxPbkluaXQ/OiBib29sZWFuLFxuICAgIGNhbGxPbkRlc3Ryb3k/OiBib29sZWFuLFxuICAgIGNoYW5nZURldGVjdGlvbj86IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIG91dHB1dHM/OiBzdHJpbmdbXVtdXG4gIH0gPSB7fSkge1xuICAgIHRoaXMuZGlyZWN0aXZlSW5kZXggPSBkaXJlY3RpdmVJbmRleDtcbiAgICB0aGlzLmNhbGxBZnRlckNvbnRlbnRJbml0ID0gbm9ybWFsaXplQm9vbChjYWxsQWZ0ZXJDb250ZW50SW5pdCk7XG4gICAgdGhpcy5jYWxsQWZ0ZXJDb250ZW50Q2hlY2tlZCA9IG5vcm1hbGl6ZUJvb2woY2FsbEFmdGVyQ29udGVudENoZWNrZWQpO1xuICAgIHRoaXMuY2FsbE9uQ2hhbmdlcyA9IG5vcm1hbGl6ZUJvb2woY2FsbE9uQ2hhbmdlcyk7XG4gICAgdGhpcy5jYWxsQWZ0ZXJWaWV3SW5pdCA9IG5vcm1hbGl6ZUJvb2woY2FsbEFmdGVyVmlld0luaXQpO1xuICAgIHRoaXMuY2FsbEFmdGVyVmlld0NoZWNrZWQgPSBub3JtYWxpemVCb29sKGNhbGxBZnRlclZpZXdDaGVja2VkKTtcbiAgICB0aGlzLmNhbGxEb0NoZWNrID0gbm9ybWFsaXplQm9vbChjYWxsRG9DaGVjayk7XG4gICAgdGhpcy5jYWxsT25Jbml0ID0gbm9ybWFsaXplQm9vbChjYWxsT25Jbml0KTtcbiAgICB0aGlzLmNhbGxPbkRlc3Ryb3kgPSBub3JtYWxpemVCb29sKGNhbGxPbkRlc3Ryb3kpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uID0gY2hhbmdlRGV0ZWN0aW9uO1xuICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHM7XG4gIH1cblxuICBpc0RlZmF1bHRDaGFuZ2VEZXRlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzRGVmYXVsdENoYW5nZURldGVjdGlvblN0cmF0ZWd5KHRoaXMuY2hhbmdlRGV0ZWN0aW9uKTtcbiAgfVxufVxuIl19