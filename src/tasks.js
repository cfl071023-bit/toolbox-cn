// Curated task routes, not AI inference. Every route maps to existing working tools.
export const tasks=[
 {id:'smaller-image',label:['让照片小一点','Make an image smaller'],tools:['image'],aliases:['我想让照片小一点','图片变小','照片太大','缩小照片','压缩图片','make my image smaller','reduce photo size','compress image'],match:/照片.{0,8}(小|压缩)|图片.{0,8}(缩小|变小)|(?:image|photo).*(?:smaller|compress|reduce)/i},
 {id:'make-qr',label:['给链接做二维码','Make a QR code'],tools:['qr','wifi'],aliases:['制作二维码','生成二维码','给网址生成二维码','链接转二维码','create qr code','make a qr code'],match:/(?:链接|网址).{0,8}二维码|(?:make|create|generate).{0,8}(?:a )?qr/i},
 {id:'compare-writing',label:['比较两段文字','Compare two texts'],tools:['diff'],aliases:['比较两个文档','对比文档内容','比较两份文档','看看文字哪里不同','compare documents','compare two texts'],match:/(比较|对比|找不同).{0,10}(文档|文字|文本)|compare.*(?:documents|texts)/i},
 {id:'clean-list',label:['清理重复名单','Clean a list'],tools:['dedupe','case'],aliases:['删除重复行','名单去重','清理重复文字','clean duplicate text','remove duplicate lines','clean up some text'],match:/(名单|清单).{0,6}(重复|去重|清理)|(?:clean|remove|delete).*(?:duplicate|repeated)/i},
 {id:'convert-table',label:['转换表格数据','Convert table data'],tools:['csv-json','json-csv','json-yaml','yaml-json'],aliases:['表格转换','转换表格数据','表格转成数据','convert table data','convert a file'],match:/表格.{0,6}(转换|转成|数据)/i},
 {id:'count-words',label:['看看文章多少字','Count words'],tools:['stats'],aliases:['看看文章多少字','统计文章字数','这段文字有多少字','文章多少字','count my words','word count'],match:/(文章|文字|作文).{0,8}(多少字|字数)|count.*words/i}
];
const direct={ 'smaller-image':'image','make-qr':'qr','compare-writing':'diff','clean-list':'dedupe','count-words':'stats' };
tasks.forEach(t=>{t.primary=direct[t.id]});
const expandedIntents=[
 {tools:['pdf-merge'],match:/(pdf.{0,10}(合并|合在一起|拼接)|合并.{0,10}pdf|(?:merge|join|combine).{0,20}pdf)/i},
 {tools:['pdf-split'],match:/(pdf.{0,10}(拆分|提取|选页)|提取.{0,10}(pdf|页面)|(?:split|extract).{0,20}pdf)/i},
 {tools:['image-resize'],match:/(照片|图片).{0,10}(改尺寸|改宽度|调整大小|改分辨率)|resize.{0,15}(image|photo)/i},
 {tools:['image-crop'],match:/(裁剪|裁切).{0,10}(图片|照片)|(?:crop|cut).{0,15}(image|photo)/i},
 {tools:['qr-read'],match:/(识别|读取|扫描).{0,10}二维码|(?:scan|read|decode).{0,15}qr/i},
 {tools:['date-calc'],match:/(日期|两个日期).{0,10}(相隔|间隔|多少天)|还有多少天|date.{0,10}(difference|calculator)/i},
 {tools:['md-preview'],match:/(markdown|md).{0,5}预览|预览.{0,5}(markdown|md)|markdown preview/i}
];
export function taskMatches(query){const q=query.trim().toLowerCase();if(!q)return [];const extra=expandedIntents.filter(t=>t.match.test(q));return [...extra,...tasks.filter(t=>t.aliases.some(a=>q===a.toLowerCase()||q.includes(a.toLowerCase()))||t.match.test(q)).map(t=>t.id==='make-qr'&&/wifi|wi-fi|无线|联网/i.test(q)?{...t,tools:['wifi','qr']}:t)];}
export const unsupportedDocumentQuery=query=>/pdf|docx|xlsx|word\s*(转|to)|转\s*word|excel\s*(文件|to)/i.test(query);
