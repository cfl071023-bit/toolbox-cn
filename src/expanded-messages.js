export const expandedLabels={
 'md-preview':['预览文档','Preview Markdown'],'md-table':['生成表格','Generate table'],percentage:['计算百分比','Calculate percentage'],units:['换算单位','Convert units'],'date-calc':['计算间隔','Calculate days'],regex:['测试匹配','Test pattern'],'css-code':['处理 CSS','Process CSS'],'js-code':['处理 JavaScript','Process JavaScript'],'json-view':['查看数据结构','Explore JSON'],'json-diff':['比较 JSON','Compare JSON'],'json-xml':['转成 XML','Convert to XML'],'xml-json':['转成 JSON','Convert to JSON'],'json-toml':['转成 TOML','Convert to TOML'],'toml-json':['转成 JSON','Convert to JSON'],'list-compare':['比较两份清单','Compare lists'],'html-text':['提取文字','Extract text'],'json-flat':['转换数据结构','Transform JSON']
};
export const expandedErrors={
 'md-preview':['请填写 Markdown 内容，最多 10 万字符；也可以先试用示例。','Enter Markdown, up to 100,000 characters, or try the example.'],
 'md-table':['请检查 CSV：首行是表头，每行列数一致；含逗号的单元格须加双引号。','Check CSV headers, matching column counts and quotes around cells containing commas.'],
 percentage:['请填写有效的基数和数值；占比与涨跌幅的基数不能为零，结果不能超出数字范围。','Enter finite numbers; share and change need a non-zero base and a finite result.'],
 units:['请填写有效数字，并选择同一类型的单位，例如米与厘米，不能把长度换成重量。','Enter a finite number and units of the same dimension, such as metres and centimetres.'],
 'date-calc':['请填写真实存在的 YYYY-MM-DD 日期，例如 2024-02-29，并检查结束日期。','Enter real YYYY-MM-DD dates, such as 2024-02-29, and check the end date.'],
 regex:['请检查表达式与标记；耗时超过 1 秒或匹配超过 1000 个时会停止。可简化表达式后重试。','Check the pattern and flags. Processing stops after one second or 1000 matches; simplify and retry.'],
 'css-code':['CSS 语法不能解析，或内容超过 10 万字符。请检查括号、属性和值后重试。','CSS could not be parsed or exceeds 100,000 characters. Check braces, properties and values.'],
 'js-code':['JavaScript 语法不能解析，或内容超过 10 万字符。请检查语法；本工具不执行代码。','JavaScript could not be parsed or exceeds 100,000 characters. Check syntax; code is never executed.'],
 'json-view':['请检查 JSON 语法；树状查看最多支持 5000 个节点、40 层嵌套和 10 万字符。','Check JSON syntax. Tree view supports up to 5000 nodes, 40 nested levels and 100,000 characters.'],
 'json-diff':['两份内容都必须是有效 JSON，每份最多 5000 个节点、40 层嵌套和 10 万字符。','Both inputs must be valid JSON, each with at most 5000 nodes, 40 levels and 100,000 characters.'],
 'json-xml':['请使用 xml-js 紧凑 JSON 结构（_text、_attributes），并确保只生成一个有效根元素。','Use xml-js compact JSON notation (_text, _attributes) and produce one valid XML root element.'],
 'xml-json':['请检查 XML 标签是否配对；本工具拒绝 DOCTYPE、实体声明和外部资源。','Check matching XML tags. DOCTYPE, entity declarations and external resources are rejected.'],
 'json-toml':['请填写有效 JSON 对象。TOML 不支持 null；请先移除或替换空值。','Enter a valid JSON object. TOML cannot represent null; remove or replace null values first.'],
 'toml-json':['请检查 TOML 语法、引号和重复字段；可以试用示例确认格式。','Check TOML syntax, quotes and duplicate keys, or try the example.'],
 'list-compare':['请在两侧填写清单，每行一项，每份最多 10 万字符。','Enter both lists, one item per line, with no more than 100,000 characters in each.'],
 'html-text':['请填写要提取的 HTML 或文字，最多 10 万字符；工具不会访问原网站。','Enter HTML or text up to 100,000 characters. The original website is never fetched.'],
 'json-flat':['请填写普通 JSON 对象；字段不能包含保留名称或冲突路径，展平前的字段名不能含点。','Enter a JSON object without reserved names or conflicting paths. Keys must not contain dots before flattening.']
};
