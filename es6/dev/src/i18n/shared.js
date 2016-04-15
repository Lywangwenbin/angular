import { ParseError } from 'angular2/src/compiler/parse_util';
import { HtmlElementAst, HtmlTextAst, HtmlCommentAst, htmlVisitAll } from 'angular2/src/compiler/html_ast';
import { isPresent, isBlank, StringWrapper } from 'angular2/src/facade/lang';
import { Message } from './message';
export const I18N_ATTR = "i18n";
export const I18N_ATTR_PREFIX = "i18n-";
var CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*"([\s\S]*?)"[\s\S]*\)/g;
/**
 * An i18n error.
 */
export class I18nError extends ParseError {
    constructor(span, msg) {
        super(span, msg);
    }
}
// Man, this is so ugly!
export function partition(nodes, errors) {
    let res = [];
    for (let i = 0; i < nodes.length; ++i) {
        let n = nodes[i];
        let temp = [];
        if (_isOpeningComment(n)) {
            let i18n = n.value.substring(5).trim();
            i++;
            while (!_isClosingComment(nodes[i])) {
                temp.push(nodes[i++]);
                if (i === nodes.length) {
                    errors.push(new I18nError(n.sourceSpan, "Missing closing 'i18n' comment."));
                    break;
                }
            }
            res.push(new Part(null, null, temp, i18n, true));
        }
        else if (n instanceof HtmlElementAst) {
            let i18n = _findI18nAttr(n);
            res.push(new Part(n, null, n.children, isPresent(i18n) ? i18n.value : null, isPresent(i18n)));
        }
        else if (n instanceof HtmlTextAst) {
            res.push(new Part(null, n, null, null, false));
        }
    }
    return res;
}
export class Part {
    constructor(rootElement, rootTextNode, children, i18n, hasI18n) {
        this.rootElement = rootElement;
        this.rootTextNode = rootTextNode;
        this.children = children;
        this.i18n = i18n;
        this.hasI18n = hasI18n;
    }
    get sourceSpan() {
        if (isPresent(this.rootElement))
            return this.rootElement.sourceSpan;
        else if (isPresent(this.rootTextNode))
            return this.rootTextNode.sourceSpan;
        else
            return this.children[0].sourceSpan;
    }
    createMessage(parser) {
        return new Message(stringifyNodes(this.children, parser), meaning(this.i18n), description(this.i18n));
    }
}
function _isOpeningComment(n) {
    return n instanceof HtmlCommentAst && isPresent(n.value) && n.value.startsWith("i18n:");
}
function _isClosingComment(n) {
    return n instanceof HtmlCommentAst && isPresent(n.value) && n.value == "/i18n";
}
function _findI18nAttr(p) {
    let i18n = p.attrs.filter(a => a.name == I18N_ATTR);
    return i18n.length == 0 ? null : i18n[0];
}
export function meaning(i18n) {
    if (isBlank(i18n) || i18n == "")
        return null;
    return i18n.split("|")[0];
}
export function description(i18n) {
    if (isBlank(i18n) || i18n == "")
        return null;
    let parts = i18n.split("|");
    return parts.length > 1 ? parts[1] : null;
}
export function messageFromAttribute(parser, p, attr) {
    let expectedName = attr.name.substring(5);
    let matching = p.attrs.filter(a => a.name == expectedName);
    if (matching.length > 0) {
        let value = removeInterpolation(matching[0].value, matching[0].sourceSpan, parser);
        return new Message(value, meaning(attr.value), description(attr.value));
    }
    else {
        throw new I18nError(p.sourceSpan, `Missing attribute '${expectedName}'.`);
    }
}
export function removeInterpolation(value, source, parser) {
    try {
        let parsed = parser.splitInterpolation(value, source.toString());
        let usedNames = new Map();
        if (isPresent(parsed)) {
            let res = "";
            for (let i = 0; i < parsed.strings.length; ++i) {
                res += parsed.strings[i];
                if (i != parsed.strings.length - 1) {
                    let customPhName = getPhNameFromBinding(parsed.expressions[i], i);
                    customPhName = dedupePhName(usedNames, customPhName);
                    res += `<ph name="${customPhName}"/>`;
                }
            }
            return res;
        }
        else {
            return value;
        }
    }
    catch (e) {
        return value;
    }
}
export function getPhNameFromBinding(input, index) {
    let customPhMatch = StringWrapper.split(input, CUSTOM_PH_EXP);
    return customPhMatch.length > 1 ? customPhMatch[1] : `${index}`;
}
export function dedupePhName(usedNames, name) {
    let duplicateNameCount = usedNames.get(name);
    if (isPresent(duplicateNameCount)) {
        usedNames.set(name, duplicateNameCount + 1);
        return `${name}_${duplicateNameCount}`;
    }
    else {
        usedNames.set(name, 1);
        return name;
    }
}
export function stringifyNodes(nodes, parser) {
    let visitor = new _StringifyVisitor(parser);
    return htmlVisitAll(visitor, nodes).join("");
}
class _StringifyVisitor {
    constructor(_parser) {
        this._parser = _parser;
        this._index = 0;
    }
    visitElement(ast, context) {
        let name = this._index++;
        let children = this._join(htmlVisitAll(this, ast.children), "");
        return `<ph name="e${name}">${children}</ph>`;
    }
    visitAttr(ast, context) { return null; }
    visitText(ast, context) {
        let index = this._index++;
        let noInterpolation = removeInterpolation(ast.value, ast.sourceSpan, this._parser);
        if (noInterpolation != ast.value) {
            return `<ph name="t${index}">${noInterpolation}</ph>`;
        }
        else {
            return ast.value;
        }
    }
    visitComment(ast, context) { return ""; }
    _join(strs, str) {
        return strs.filter(s => s.length > 0).join(str);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1JVGFGWDdWbi50bXAvYW5ndWxhcjIvc3JjL2kxOG4vc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQWtCLFVBQVUsRUFBQyxNQUFNLGtDQUFrQztPQUNyRSxFQUdMLGNBQWMsRUFFZCxXQUFXLEVBQ1gsY0FBYyxFQUNkLFlBQVksRUFDYixNQUFNLGdDQUFnQztPQUNoQyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFDLE1BQU0sMEJBQTBCO09BQ25FLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVztBQUdqQyxPQUFPLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUNoQyxPQUFPLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDO0FBQ3hDLElBQUksYUFBYSxHQUFHLHdFQUF3RSxDQUFDO0FBRTdGOztHQUVHO0FBQ0gsK0JBQStCLFVBQVU7SUFDdkMsWUFBWSxJQUFxQixFQUFFLEdBQVc7UUFBSSxNQUFNLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztJQUFDLENBQUM7QUFDdkUsQ0FBQztBQUdELHdCQUF3QjtBQUN4QiwwQkFBMEIsS0FBZ0IsRUFBRSxNQUFvQjtJQUM5RCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFFYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksSUFBSSxHQUFvQixDQUFFLENBQUMsS0FBSyxD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RUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsZUFBZSxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxjQUFjLEtBQUssS0FBSyxlQUFlLE9BQU8sQ0FBQztRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFtQixFQUFFLE9BQVksSUFBUyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUzRCxLQUFLLENBQUMsSUFBYyxFQUFFLEdBQVc7UUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7QUFDSCxDQUFDO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BhcnNlU291cmNlU3BhbiwgUGFyc2VFcnJvcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3BhcnNlX3V0aWwnO1xuaW1wb3J0IHtcbiAgSHRtbEFzdCxcbiAgSHRtbEFzdFZpc2l0b3IsXG4gIEh0bWxFbGVtZW50QXN0LFxuICBIdG1sQXR0ckFzdCxcbiAgSHRtbFRleHRBc3QsXG4gIEh0bWxDb21tZW50QXN0LFxuICBodG1sVmlzaXRBbGxcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2h0bWxfYXN0JztcbmltcG9ydCB7aXNQcmVzZW50LCBpc0JsYW5rLCBTdHJpbmdXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2UnO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb21waWxlci9leHByZXNzaW9uX3BhcnNlci9wYXJzZXInO1xuXG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSID0gXCJpMThuXCI7XG5leHBvcnQgY29uc3QgSTE4Tl9BVFRSX1BSRUZJWCA9IFwiaTE4bi1cIjtcbnZhciBDVVNUT01fUEhfRVhQID0gL1xcL1xcL1tcXHNcXFNdKmkxOG5bXFxzXFxTXSpcXChbXFxzXFxTXSpwaFtcXHNcXFNdKj1bXFxzXFxTXSpcIihbXFxzXFxTXSo/KVwiW1xcc1xcU10qXFwpL2c7XG5cbi8qKlxuICogQW4gaTE4biBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEkxOG5FcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKSB7IHN1cGVyKHNwYW4sIG1zZyk7IH1cbn1cblxuXG4vLyBNYW4sIHRoaXMgaXMgc28gdWdseSFcbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb24obm9kZXM6IEh0bWxBc3RbXSwgZXJyb3JzOiBQYXJzZUVycm9yW10pOiBQYXJ0W10ge1xuICBsZXQgcmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgIGxldCBuID0gbm9kZXNbaV07XG4gICAgbGV0IHRlbXAgPSBbXTtcbiAgICBpZiAoX2lzT3BlbmluZ0NvbW1lbnQobikpIHtcbiAgICAgIGxldCBpMThuID0gKDxIdG1sQ29tbWVudEFzdD5uKS52YWx1ZS5zdWJzdHJpbmcoNSkudHJpbSgpO1xuICAgICAgaSsrO1xuICAgICAgd2hpbGUgKCFfaXNDbG9zaW5nQ29tbWVudChub2Rlc1tpXSkpIHtcbiAgICAgICAgdGVtcC5wdXNoKG5vZGVzW2krK10pO1xuICAgICAgICBpZiAoaSA9PT0gbm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihuLnNvdXJjZVNwYW4sIFwiTWlzc2luZyBjbG9zaW5nICdpMThuJyBjb21tZW50LlwiKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG51bGwsIG51bGwsIHRlbXAsIGkxOG4sIHRydWUpKTtcblxuICAgIH0gZWxzZSBpZiAobiBpbnN0YW5jZW9mIEh0bWxFbGVtZW50QXN0KSB7XG4gICAgICBsZXQgaTE4biA9IF9maW5kSTE4bkF0dHIobik7XG4gICAgICByZXMucHVzaChuZXcgUGFydChuLCBudWxsLCBuLmNoaWxkcmVuLCBpc1ByZXNlbnQoaTE4bikgPyBpMThuLnZhbHVlIDogbnVsbCwgaXNQcmVzZW50KGkxOG4pKSk7XG4gICAgfSBlbHNlIGlmIChuIGluc3RhbmNlb2YgSHRtbFRleHRBc3QpIHtcbiAgICAgIHJlcy5wdXNoKG5ldyBQYXJ0KG51bGwsIG4sIG51bGwsIG51bGwsIGZhbHNlKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNsYXNzIFBhcnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcm9vdEVsZW1lbnQ6IEh0bWxFbGVtZW50QXN0LCBwdWJsaWMgcm9vdFRleHROb2RlOiBIdG1sVGV4dEFzdCxcbiAgICAgICAgICAgICAgcHVibGljIGNoaWxkcmVuOiBIdG1sQXN0W10sIHB1YmxpYyBpMThuOiBzdHJpbmcsIHB1YmxpYyBoYXNJMThuOiBib29sZWFuKSB7fVxuXG4gIGdldCBzb3VyY2VTcGFuKCk6IFBhcnNlU291cmNlU3BhbiB7XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLnJvb3RFbGVtZW50KSlcbiAgICAgIHJldHVybiB0aGlzLnJvb3RFbGVtZW50LnNvdXJjZVNwYW47XG4gICAgZWxzZSBpZiAoaXNQcmVzZW50KHRoaXMucm9vdFRleHROb2RlKSlcbiAgICAgIHJldHVybiB0aGlzLnJvb3RUZXh0Tm9kZS5zb3VyY2VTcGFuO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuWzBdLnNvdXJjZVNwYW47XG4gIH1cblxuICBjcmVhdGVNZXNzYWdlKHBhcnNlcjogUGFyc2VyKTogTWVzc2FnZSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlKHN0cmluZ2lmeU5vZGVzKHRoaXMuY2hpbGRyZW4sIHBhcnNlciksIG1lYW5pbmcodGhpcy5pMThuKSxcbiAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb24odGhpcy5pMThuKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2lzT3BlbmluZ0NvbW1lbnQobjogSHRtbEFzdCk6IGJvb2xlYW4ge1xuICByZXR1cm4gbiBpbnN0YW5jZW9mIEh0bWxDb21tZW50QXN0ICYmIGlzUHJlc2VudChuLnZhbHVlKSAmJiBuLnZhbHVlLnN0YXJ0c1dpdGgoXCJpMThuOlwiKTtcbn1cblxuZnVuY3Rpb24gX2lzQ2xvc2luZ0NvbW1lbnQobjogSHRtbEFzdCk6IGJvb2xlYW4ge1xuICByZXR1cm4gbiBpbnN0YW5jZW9mIEh0bWxDb21tZW50QXN0ICYmIGlzUHJlc2VudChuLnZhbHVlKSAmJiBuLnZhbHVlID09IFwiL2kxOG5cIjtcbn1cblxuZnVuY3Rpb24gX2ZpbmRJMThuQXR0cihwOiBIdG1sRWxlbWVudEFzdCk6IEh0bWxBdHRyQXN0IHtcbiAgbGV0IGkxOG4gPSBwLmF0dHJzLmZpbHRlcihhID0+IGEubmFtZSA9PSBJMThOX0FUVFIpO1xuICByZXR1cm4gaTE4bi5sZW5ndGggPT0gMCA/IG51bGwgOiBpMThuWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVhbmluZyhpMThuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhpMThuKSB8fCBpMThuID09IFwiXCIpIHJldHVybiBudWxsO1xuICByZXR1cm4gaTE4bi5zcGxpdChcInxcIilbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXNjcmlwdGlvbihpMThuOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhpMThuKSB8fCBpMThuID09IFwiXCIpIHJldHVybiBudWxsO1xuICBsZXQgcGFydHMgPSBpMThuLnNwbGl0KFwifFwiKTtcbiAgcmV0dXJuIHBhcnRzLmxlbmd0aCA+IDEgPyBwYXJ0c1sxXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlRnJvbUF0dHJpYnV0ZShwYXJzZXI6IFBhcnNlciwgcDogSHRtbEVsZW1lbnRBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cjogSHRtbEF0dHJBc3QpOiBNZXNzYWdlIHtcbiAgbGV0IGV4cGVjdGVkTmFtZSA9IGF0dHIubmFtZS5zdWJzdHJpbmcoNSk7XG4gIGxldCBtYXRjaGluZyA9IHAuYXR0cnMuZmlsdGVyKGEgPT4gYS5uYW1lID09IGV4cGVjdGVkTmFtZSk7XG5cbiAgaWYgKG1hdGNoaW5nLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgdmFsdWUgPSByZW1vdmVJbnRlcnBvbGF0aW9uKG1hdGNoaW5nWzBdLnZhbHVlLCBtYXRjaGluZ1swXS5zb3VyY2VTcGFuLCBwYXJzZXIpO1xuICAgIHJldHVybiBuZXcgTWVzc2FnZSh2YWx1ZSwgbWVhbmluZyhhdHRyLnZhbHVlKSwgZGVzY3JpcHRpb24oYXR0ci52YWx1ZSkpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBJMThuRXJyb3IocC5zb3VyY2VTcGFuLCBgTWlzc2luZyBhdHRyaWJ1dGUgJyR7ZXhwZWN0ZWROYW1lfScuYCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUludGVycG9sYXRpb24odmFsdWU6IHN0cmluZywgc291cmNlOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXI6IFBhcnNlcik6IHN0cmluZyB7XG4gIHRyeSB7XG4gICAgbGV0IHBhcnNlZCA9IHBhcnNlci5zcGxpdEludGVycG9sYXRpb24odmFsdWUsIHNvdXJjZS50b1N0cmluZygpKTtcbiAgICBsZXQgdXNlZE5hbWVzID0gbmV3IE1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICBpZiAoaXNQcmVzZW50KHBhcnNlZCkpIHtcbiAgICAgIGxldCByZXMgPSBcIlwiO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJzZWQuc3RyaW5ncy5sZW5ndGg7ICsraSkge1xuICAgICAgICByZXMgKz0gcGFyc2VkLnN0cmluZ3NbaV07XG4gICAgICAgIGlmIChpICE9IHBhcnNlZC5zdHJpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBsZXQgY3VzdG9tUGhOYW1lID0gZ2V0UGhOYW1lRnJvbUJpbmRpbmcocGFyc2VkLmV4cHJlc3Npb25zW2ldLCBpKTtcbiAgICAgICAgICBjdXN0b21QaE5hbWUgPSBkZWR1cGVQaE5hbWUodXNlZE5hbWVzLCBjdXN0b21QaE5hbWUpO1xuICAgICAgICAgIHJlcyArPSBgPHBoIG5hbWU9XCIke2N1c3RvbVBoTmFtZX1cIi8+YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGhOYW1lRnJvbUJpbmRpbmcoaW5wdXQ6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gIGxldCBjdXN0b21QaE1hdGNoID0gU3RyaW5nV3JhcHBlci5zcGxpdChpbnB1dCwgQ1VTVE9NX1BIX0VYUCk7XG4gIHJldHVybiBjdXN0b21QaE1hdGNoLmxlbmd0aCA+IDEgPyBjdXN0b21QaE1hdGNoWzFdIDogYCR7aW5kZXh9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwZVBoTmFtZSh1c2VkTmFtZXM6IE1hcDxzdHJpbmcsIG51bWJlcj4sIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBkdXBsaWNhdGVOYW1lQ291bnQgPSB1c2VkTmFtZXMuZ2V0KG5hbWUpO1xuICBpZiAoaXNQcmVzZW50KGR1cGxpY2F0ZU5hbWVDb3VudCkpIHtcbiAgICB1c2VkTmFtZXMuc2V0KG5hbWUsIGR1cGxpY2F0ZU5hbWVDb3VudCArIDEpO1xuICAgIHJldHVybiBgJHtuYW1lfV8ke2R1cGxpY2F0ZU5hbWVDb3VudH1gO1xuICB9IGVsc2Uge1xuICAgIHVzZWROYW1lcy5zZXQobmFtZSwgMSk7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeU5vZGVzKG5vZGVzOiBIdG1sQXN0W10sIHBhcnNlcjogUGFyc2VyKTogc3RyaW5nIHtcbiAgbGV0IHZpc2l0b3IgPSBuZXcgX1N0cmluZ2lmeVZpc2l0b3IocGFyc2VyKTtcbiAgcmV0dXJuIGh0bWxWaXNpdEFsbCh2aXNpdG9yLCBub2Rlcykuam9pbihcIlwiKTtcbn1cblxuY2xhc3MgX1N0cmluZ2lmeVZpc2l0b3IgaW1wbGVtZW50cyBIdG1sQXN0VmlzaXRvciB7XG4gIHByaXZhdGUgX2luZGV4OiBudW1iZXIgPSAwO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJzZXI6IFBhcnNlcikge31cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBIdG1sRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgbmFtZSA9IHRoaXMuX2luZGV4Kys7XG4gICAgbGV0IGNoaWxkcmVuID0gdGhpcy5fam9pbihodG1sVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKSwgXCJcIik7XG4gICAgcmV0dXJuIGA8cGggbmFtZT1cImUke25hbWV9XCI+JHtjaGlsZHJlbn08L3BoPmA7XG4gIH1cblxuICB2aXNpdEF0dHIoYXN0OiBIdG1sQXR0ckFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdFRleHQoYXN0OiBIdG1sVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9pbmRleCsrO1xuICAgIGxldCBub0ludGVycG9sYXRpb24gPSByZW1vdmVJbnRlcnBvbGF0aW9uKGFzdC52YWx1ZSwgYXN0LnNvdXJjZVNwYW4sIHRoaXMuX3BhcnNlcik7XG4gICAgaWYgKG5vSW50ZXJwb2xhdGlvbiAhPSBhc3QudmFsdWUpIHtcbiAgICAgIHJldHVybiBgPHBoIG5hbWU9XCJ0JHtpbmRleH1cIj4ke25vSW50ZXJwb2xhdGlvbn08L3BoPmA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhc3QudmFsdWU7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRDb21tZW50KGFzdDogSHRtbENvbW1lbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7IHJldHVybiBcIlwiOyB9XG5cbiAgcHJpdmF0ZSBfam9pbihzdHJzOiBzdHJpbmdbXSwgc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBzdHJzLmZpbHRlcihzID0+IHMubGVuZ3RoID4gMCkuam9pbihzdHIpO1xuICB9XG59XG4iXX0=