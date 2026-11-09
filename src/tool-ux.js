import {expandedLabels,expandedErrors} from './expanded-messages';
const labels={
 json:['整理 JSON','Format JSON'],base64:['转换 Base64','Convert Base64'],time:['换算时间','Convert time'],color:['转换色值','Convert color'],stats:['统计字数','Count text'],case:['转换大小写','Convert case'],dedupe:['清理名单','Clean list'],'url-codec':['转换网址编码','Convert URL encoding'],'url-parse':['分析网址','Inspect URL'],'json-yaml':['转成 YAML','Convert to YAML'],'yaml-json':['转成 JSON','Convert to JSON'],'json-csv':['转成 CSV 表格','Convert to CSV'],'csv-json':['转成 JSON','Convert to JSON'],xml:['整理 XML','Format XML'],sql:['整理 SQL','Format SQL'],markdown:['转成 HTML','Convert to HTML'],html:['处理 HTML 转义','Convert HTML entities'],hash:['生成文本摘要','Hash text'],token:['生成随机字符串','Generate a random string'],base:['转换进制','Convert number base'],temperature:['换算温度','Convert temperature'],roman:['转换罗马数字','Convert Roman numerals'],subnet:['计算子网','Calculate subnet'],jwt:['查看令牌内容','Decode token'],svg:['生成占位图','Generate placeholder']
};
const errors={
 json:['这段 JSON 还不能解析。请检查双引号、括号和末尾逗号；也可以先试用示例。','This JSON cannot be parsed. Check double quotes, brackets and trailing commas, or try the example.'],
 base64:['这不是有效的 Base64。请粘贴完整编码，不要混入其他文字；普通文字请选择编码模式。','This is not valid Base64. Paste the complete encoding without extra text, or choose Encode for ordinary text.'],
 time:['请填写秒/毫秒时间戳，或带时区的日期，例如 2024-01-01T08:00:00+08:00；请确认日期确实存在。','Enter Unix seconds/milliseconds or a date with timezone, such as 2024-01-01T08:00:00+08:00. Check the calendar date.'],
 color:['请填写有效色值，例如 #6366f1、rgb(99, 102, 241)，也可以用取色器。','Enter a valid color such as #6366f1 or rgb(99, 102, 241), or use the picker.'],
 qr:['请填写要分享的链接或文字；内容太长时，请适当精简后重试。','Enter a link or message. Shorten the content if it exceeds QR capacity.'],
 wifi:['请填写网络名称，并为 WPA/WEP 网络填写密码；开放网络请选择“无密码”。','Enter the network name and a password for WPA/WEP, or choose No password for an open network.'],
 'json-yaml':['请输入有效 JSON。检查双引号和括号，或用示例确认输入格式。','Enter valid JSON. Check quotes and brackets, or use the example.'],
 'yaml-json':['YAML 还不能解析。请检查缩进、冒号和重复字段；本工具一次处理一个文档。','Check YAML indentation, colons and duplicate keys. Use one document at a time.'],
 'json-csv':['请粘贴非空的扁平对象数组，例如 [{"姓名":"小明"}]；嵌套对象需要先整理。','Paste a non-empty array of flat objects, e.g. [{"name":"Sam"}]. Flatten nested objects first.'],
 'csv-json':['CSV 首行需要互不重复的字段名，每行列数应一致；含逗号的单元格请用双引号包裹。','Use unique headers and the same number of columns in each row. Quote cells containing commas.'],
 'url-codec':['请检查百分号编码是否完整，例如 %E4%BD%A0；普通文字应选择编码。','Check percent-encoded text, e.g. %E4%BD%A0. Choose Encode for ordinary text.'],
 'url-parse':['请填写完整网址并包含协议，例如 https://example.com/search?q=中文。这里只分析，不会访问网址。','Enter an absolute URL such as https://example.com/search?q=text. This tool does not visit it.'],
 xml:['XML 标签需要正确配对和闭合。请检查引号、起止标签，或试用示例。','Check matching XML tags, closing tags and attribute quotes, or try the example.'],
 sql:['请检查 SQL 语句，并确认选择了对应的 SQL 语法。这里只排版，不执行查询。','Check the SQL text and selected dialect. This tool formats without executing queries.'],
 token:['字符串长度应为 8–128 的整数，请检查长度和字符集。','Choose an integer length from 8–128 and a valid character set.'],
 base:['请检查原进制与数字是否匹配。例如二进制只能包含 0 和 1。','Check the input base. Binary input may contain only 0 and 1.'],
 temperature:['请输入有效温度；温度不能低于绝对零度（−273.15°C）。','Enter a valid temperature at or above absolute zero (−273.15°C).'],
 roman:['请输入 1–3999 的整数或有效罗马数字，例如 2026 或 MMXXVI。','Enter an integer from 1–3999 or a valid Roman numeral such as MMXXVI.'],
 subnet:['请输入 IPv4/CIDR，例如 192.168.1.10/24；每段地址为 0–255，前缀为 0–32。','Enter IPv4/CIDR, e.g. 192.168.1.10/24. Octets must be 0–255 and the prefix 0–32.'],
 jwt:['请输入完整的三段式 JWT。解码不会验证签名，也不能证明令牌可信。','Enter a complete three-part JWT. Decoding does not verify its signature or trust.'],
 svg:['宽高应为 1–4096 的整数，背景色应为有效的六位 HEX 色值。','Use integer dimensions from 1–4096 and a valid six-digit HEX background color.']
};
export const actionLabel=(id,lang,mode)=>id==='base64'?(mode==='decode'?['还原成文字','Decode to text']:['编码成 Base64','Encode to Base64'])[lang==='en'?1:0]:(labels[id]??expandedLabels[id]??['开始处理','Process'])[lang==='en'?1:0];
export const errorMessage=(id,lang)=>(errors[id]??expandedErrors[id]??['请先填写要处理的内容，并检查上方选项；可以用示例确认格式。','Enter your content and check the options above, or try the example.'])[lang==='en'?1:0];
export function toolLink(href,id){const url=new URL(href);url.search='';url.hash=id;return url.href;}

