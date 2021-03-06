
const DEFAULT_LONG = 116.4017;
const DEFAULT_LAT = 39.908802;
const DEFAULT_ZOOM_LEVEL = 12;
const MAP_ICON_W = 39;
const MAP_ICON_H = 25;
const AUTH_TOKEN = '';
const HEADER_HEIGHT = 72;
const SIDEBAR = [
  // { label: '所有项目', url: '/home/project/list/map/all', icon: 'environment' },
  // { label: '关注项目', url: '/home/project/list/map/attention', icon: 'star' },
  // { label: '新开工项目', url: '/home/project/list/map/batch', icon: 'flag' },
  { label: '项目建设分析', url: '/home/project/analysis', icon: 'area-chart', id: 'analysis', default: true },
  // { label: '附件管理', url: '/home/attachment', icon: 'file' },
];

const MAP_LABEL_STYLE = {
  border: '1px solid black',
  backgroundColor: 'rgba(41,34,34,0.8)',
  color: 'white',
  borderRadius: '3px',
  padding: '2px 5px',
  cursor: 'pointer'
  // fontSize: '1.5em'
};

const URL_FILETER_MAPPING = {}

const LIGHT_MAPPING = [
  { text: '延期', color: 'red', count: 0 },
  { text: '预警', color: 'yellow', count: 0 },
  { text: '正常', color: 'green', count: 0 },
  { text: '延期完成', color: 'blue', count: 0 },
  { text: '未到期', color: 'white', count: 0 },
  { text: '红闪', color: 'red', count: 0 },
  { text: '绿闪', color: 'green', count: 0 }
];

const ORDER_MAPPING = {
  '第一': 1,
  '第二': 2,
  '第三': 3,
  '第四': 4,
  '第五': 5,
  '第六': 6,
  '第七': 7,
  '第八': 8,
  '第九': 9,
  '第十': 10,
};

export default {
  DEFAULT_LONG,
  DEFAULT_LAT,
  DEFAULT_ZOOM_LEVEL,
  MAP_ICON_W,
  MAP_ICON_H,
  AUTH_TOKEN,
  HEADER_HEIGHT,
  SIDEBAR,
  MAP_LABEL_STYLE,
  LIGHT_MAPPING,
  URL_FILETER_MAPPING,
  ORDER_MAPPING,
}


