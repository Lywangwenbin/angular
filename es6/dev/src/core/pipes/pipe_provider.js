import { resolveProvider, ResolvedProvider_ } from 'angular2/src/core/di/provider';
import { Provider } from 'angular2/src/core/di';
export class PipeProvider extends ResolvedProvider_ {
    constructor(name, pure, key, resolvedFactories, multiBinding) {
        super(key, resolvedFactories, multiBinding);
        this.name = name;
        this.pure = pure;
    }
    static createFromType(type, metadata) {
        var provider = new Provider(type, { useClass: type });
        var rb = resolveProvider(provider);
        return new PipeProvider(metadata.name, metadata.pure, rb.key, rb.resolvedFactories, rb.multiProvider);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtOUp0Y2lRalEudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL3BpcGVzL3BpcGVfcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQ08sRUFBa0IsZUFBZSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sK0JBQStCO09BQzFGLEVBQXdCLFFBQVEsRUFBQyxNQUFNLHNCQUFzQjtBQUdwRSxrQ0FBa0MsaUJBQWlCO0lBQ2pELFlBQW1CLElBQVksRUFBUyxJQUFhLEVBQUUsR0FBUSxFQUNuRCxpQkFBb0MsRUFBRSxZQUFxQjtRQUNyRSxNQUFNLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUYzQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUztJQUdyRCxDQUFDO0lBRUQsT0FBTyxjQUFjLENBQUMsSUFBVSxFQUFFLFFBQXNCO1FBQ3RELElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixFQUMxRCxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7UmVzb2x2ZWRGYWN0b3J5LCByZXNvbHZlUHJvdmlkZXIsIFJlc29sdmVkUHJvdmlkZXJffSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaS9wcm92aWRlcic7XG5pbXBvcnQge0tleSwgUmVzb2x2ZWRQcm92aWRlciwgUHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7UGlwZU1ldGFkYXRhfSBmcm9tICcuLi9tZXRhZGF0YS9kaXJlY3RpdmVzJztcblxuZXhwb3J0IGNsYXNzIFBpcGVQcm92aWRlciBleHRlbmRzIFJlc29sdmVkUHJvdmlkZXJfIHtcbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHB1cmU6IGJvb2xlYW4sIGtleTogS2V5LFxuICAgICAgICAgICAgICByZXNvbHZlZEZhY3RvcmllczogUmVzb2x2ZWRGYWN0b3J5W10sIG11bHRpQmluZGluZzogYm9vbGVhbikge1xuICAgIHN1cGVyKGtleSwgcmVzb2x2ZWRGYWN0b3JpZXMsIG11bHRpQmluZGluZyk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlRnJvbVR5cGUodHlwZTogVHlwZSwgbWV0YWRhdGE6IFBpcGVNZXRhZGF0YSk6IFBpcGVQcm92aWRlciB7XG4gICAgdmFyIHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKHR5cGUsIHt1c2VDbGFzczogdHlwZX0pO1xuICAgIHZhciByYiA9IHJlc29sdmVQcm92aWRlcihwcm92aWRlcik7XG4gICAgcmV0dXJuIG5ldyBQaXBlUHJvdmlkZXIobWV0YWRhdGEubmFtZSwgbWV0YWRhdGEucHVyZSwgcmIua2V5LCByYi5yZXNvbHZlZEZhY3RvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYi5tdWx0aVByb3ZpZGVyKTtcbiAgfVxufVxuIl19