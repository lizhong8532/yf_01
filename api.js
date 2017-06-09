let express = require('express');
let app = express();

let re = (data, pass = true) => {
  return {
    data: data,
    pass: pass
  };
};

let createProject = (n = 10) => {
  let arr = [];

  for (let i = 1; i <= n; i++) {
    let o = {};
    o.name = '湿地公园' + i + '期';
    o.lat = 39 + Math.random();
    o.long = 116 + Math.random();
    o.id = i;
    o.year = 2011 + Math.round(Math.random() * 6);
    o.isAttention = Math.random() >= 0.3;
    o.status = Math.ceil(Math.random() * 5) - 1;
    arr.push(o);
  }

  return arr;
};

// respond with "hello world" when a GET request is made to the homepage
let getProject = (req, res) => {
  let o = {};

  let arr = createProject(Math.ceil(Math.random() * 20));

  o.header = [{
    title: '项目名称',
    key: 'name',
  }, {
    title: '年份',
    key: 'year',
  }, {
    title: '是否关注项目',
    key: 'isAttention',
  }, {
    title: '经度',
    key: 'long',
  }, {
    title: '纬度',
    key: 'lat',
  }, {
    title: '状态',
    key: 'status',
  }];

  if (req.query.isAttention === 'true') {
    arr = arr.filter((item) => item.isAttention);
  }

  o.rows = arr;

  res.type('application/json');
  res.status(200).json(re(o));
};

let randInt = (n = 10) => {
  let arr = [];
  for (let i=0; i<n; i++){
    arr.push(Math.ceil(10 + Math.random() * 1000));
  }
  return arr;
};

let createOption = (title) => {
  let o = {};

  if (title === '项目月度投资') {
    o.title = title;
    o.header = [
      { title: '年度计划', key: 'annualPlan' },
      { title: '累计', key: 'total' },
    ];

    o.rows = [];
    let total = 0;
    for (let i = 0; i < 12; i++) {
      o.rows.push({
        id: i + 1,
        label: i+1 + '月',
        annualPlan: 1000,
        total: total += (50 + Math.random() * 50)
      });
    }
  }

  if (title === '项目总体状态') {
    o.title = title;    
    o.header = [
      { title: '正常项目', key: 'normal' },
      { title: '不正常项目', key: 'abnormal' },
    ];

    o.rows = [{
      id: 1,
      normal: Math.ceil(Math.random() * 100),
      abnormal: Math.ceil(Math.random() * 100),
    }];
  }

  if (title === '项目节点状态分析') {
    o.title = title;
    o.header = [
      { title: '正常节点', key: 'normal' },
      { title: '不正常节点', key: 'abnormal' },
    ];

    o.rows = [{
      id: 1,
      normal: Math.ceil(Math.random() * 100),
      abnormal: Math.ceil(Math.random() * 100),
    }];
  }

  if (title === '项目问题分析') {
    o.title = title;
    o.header = [
      { title: '处理中问题', key: 'doing' },
      { title: '已处理问题', key: 'did' },
      { title: '未处理问题', key: 'waiting' },
    ];

    o.rows = [{
      id: 1,
      waiting: Math.ceil(Math.random() * 100),
      did: Math.ceil(Math.random() * 100),
      doing: Math.ceil(Math.random() * 100),
    }];
  }

  if (title === '项目业主分析') {
    o.title = title;
    o.header = [
      { title: '原籍', key: 'native' },
      { title: '外籍', key: 'foreign' },
    ];

    o.rows = [{
      id: 1,
      native: Math.ceil(Math.random() * 100),
      foreign: Math.ceil(Math.random() * 100),
    }];
  }

  if (title === '责任部门年度投资完成') {
    o.title = title;
    o.header = [
      { title: '湿地局', key: 'shidiju' },
      { title: '园林局', key: 'yuanlinju' },
      { title: '税务局', key: 'shuiwuju' },
    ];
    o.rows = [];
    let a = 0, b = 0, c = 0;
    for (let i = 0; i < 12; i++) {
      o.rows.push({
        id: 1,
        label: i + 1 + '月',
        shidiju: a += Math.ceil(Math.random() * 100),
        yuanlinju: b += Math.ceil(Math.random() * 100),
        shuiwuju: c += Math.ceil(Math.random() * 100),
      });
    }
  }

  return o;
};

let getAnalysis = (req, res) => {
  let arr = [];

  arr.push(createOption('项目月度投资'));
  arr.push(createOption('项目总体状态'));
  arr.push(createOption('项目节点状态分析'));
  arr.push(createOption('项目问题分析'));
  arr.push(createOption('项目业主分析'));
  arr.push(createOption('责任部门年度投资完成'));
  

  res.type('application/json');
  res.status(200).json(re(arr));
};

let getProjectById = (req, res) => {
  let o = {};
  // o.info = {
  //   name: '湿地公园' + req.params.id + '期',
  //   status: Math.ceil(Math.random() * 5) - 1,
  //   long: 116 + Math.random(),
  //   lat: 39 + Math.random(),
  //   industry: '生态建设',
  //   category: '生态环保工程',
  //   department: '湿地局',
  //   person: '湿地局',
  //   planStartDate: '2017-02-01',
  //   planEndDate: '2018-08-31',
  //   startDate: '2017-02-01',
  //   endDate: '',
  //   planTotalInvest: '40000万元',
  //   finishedTotalInvest: '16000万元',
  //   annualPlanInvest: '16000万元',
  //   annualFinishedInvest: '16000万元',
  //   endDateRequire: '2018-12-31',
  //   annualTarget: '完成园林工程50%， 广场工程20%，绿化工程50%',
  //   content: '平安路附近3个村社区，全场4300米，面积165平方米，其中人防林27.4平方米，右岸南起除神堂渡口（接二期），北至富民路（四桥），属大新镇境内，涉及大新镇的徐神堂、董庙和张路口3个村委会，全长4660米，面积56万平方米。两岸合计地域面积约221万平方米（不含河流），宽度为椿樱大道与滨河大道之间',
  //   graphicProgress: '完成招标工作'
  // };

  let s1 =  Math.ceil(Math.random() * 5) - 1;
  let s2 =  '湿地公园' + req.params.id + '期';
  o.info = [
    [{ label: '项目名称', value: s2 }, { label: '责任部门', value: '湿地局' }],
    [{ label: '项目状态', value: s1 }, { label: '项目类型', value: '生态环保工程' }],
    [{ label: '行业类别', value: '生态建设' }, { label: '责任人', value: '湿地局' }],
    [{ label: '计划开工日期', value: '2017-02-01' }, { label: '计划竣工日期', value: '2018-08-31' }],
    [{ label: '实际开工日期', value: '2017-02-01' }, { label: '实际竣工日期', value: '-' }],
    [{ label: '计划总投资', value: '40000万元' }, { label: '实际完成总投资', value: '16000万元' }],
    [{ label: '年度计划投资', value: '16000万元' }, { label: '年度累计完成总投资', value: '16000万元' }],
    [{ label: '完成时限', value: '2018-12-31' }],
    [{ label: '工程年度目标', value: '完成园林工程50%， 广场工程20%，绿化工程50%' }],
    [{ label: '形象进度', value: '完成招标工作' }],
    [{ label: '建设内容', value: '平安路附近3个村社区，全场4300米，面积165平方米，其中人防林27.4平方米，右岸南起除神堂渡口（接二期），北至富民路（四桥），属大新镇境内，涉及大新镇的徐神堂、董庙和张路口3个村委会，全长4660米，面积56万平方米。两岸合计地域面积约221万平方米（不含河流），宽度为椿樱大道与滨河大道之间' }],
  ];

  o.geo = {
    long: 116 + Math.random(),
    lat: 39 + Math.random(),
    status: s1,
    name: s2
  };

  o.progress = [
    { title: '项目现场图片1', url: '/tmp/gc1.jpg' },
    { title: '项目现场图片2', url: '/tmp/gc2.jpg' },
    { title: '项目现场图片3', url: '/tmp/gc3.jpg' },
    { title: '项目现场图片4', url: '/tmp/gc4.jpg' },
    { title: '项目现场图片5', url: '/tmp/gc5.jpg' },
  ];

  o.invest = {
    header: [
      { title: '月度计划投资',  key: 'monthly' },
      { title: '当前实际完成投资',  key: 'finished' },
      { title: '年内累计完成投资',  key: 'annualTotal' },
      { title: '年度计划投资',  key: 'annualPlan' },
    ],
    rows: []
  };

  
  let annualTotal = 0;
  for (let i = 0; i < 12; i++) {
    let finished = 50 + Math.random() * 50;
    o.invest.rows.push({ 
      id: i + 1,
      label: i + 1 + '月',
      monthly: 1000 / 12,
      finished: finished,
      annualPlan: 1000,
      annualTotal: annualTotal += finished
    });
  }

  o.status = {
    header: [
      { title: '序号', key: 'order' },
      { title: '节点名称', key: 'name' },
      { title: '责任部门', key: 'department' },
      { title: '计划完成时间', key: 'planEndDate' },
      { title: '实际完成时间', key: 'endDate' },
      { title: '完成状态', key: 'status' },
      { title: '督查令', key: 'inspect' },
    ],
    rows: []
  };

  let titles = [ 
    '规划设计招标', '编制项目建议书、可研报告、地形测绘', '初步设计', '施工图设计', '图审',
    '施工招标', '开工准备', '完成路基开挖50%', '完成园工路工程30%'
  ];

  let n = Math.ceil(Math.random() * 11);
  for (let i = 0; i < n; i++) {
    o.status.rows.push({
      order: i + 1,
      id: i + 1,
      name: titles[Math.floor(Math.random() * titles.length)],
      department: '湿地局',
      planEndDate: '2017-' + (i + 1) + '-' + Math.ceil(Math.random() * 25),
      endDate: '2017-' + (i + 1) + '-' + Math.ceil(Math.random() * 25),
      status: Math.random() >= 0.5,
      inspect: Math.random() >= 0.5
    });
  }

  o.issue = {
    header: [
      { title: '月份', key: 'month' },
      { title: '标题', key: 'title' },
      { title: '阶段', key: 'stage' },
      { title: '附件', key: 'attachment' },
    ],
    rows: []
  };

  titles = [
    '拆迁户阻', '地面附属物需迁移', '场地内东北角桃树林拆迁补偿问题尚未解决', '部分苗木需要移除（城关镇）', '违建物代拆除',
  ];

  let titles1 = titles;

  n = Math.ceil(Math.random() * 11);
  for (let i = 0; i < n; i++) {
    o.issue.rows.push({
      order: i + 1,
      id: i + 1,
      month: Math.ceil(Math.random() * 11),
      title: titles[Math.floor(Math.random() * titles.length)],
      stage: ['前期', '中期', '后期'][Math.floor(Math.random() * 3)],
      attachment: ''
    });
  }

  o.inspect = {
    header: [
      { title: '月份', key: 'month' },
      { title: '标题', key: 'title' },
      { title: '对应节点', key: 'node' },
      { title: '附件', key: 'attachment' },
    ],
    rows: []
  };

  titles = [
    '用地许可证为什么没有被取得', '补偿金为什么没有到位', '项目已拖延三个月'
  ];

  n = Math.ceil(Math.random() * 5);
  for (let i = 0; i < n; i++) {
    o.inspect.rows.push({
      order: i + 1,
      id: i + 1,
      month: Math.ceil(Math.random() * 11),
      title: titles[Math.floor(Math.random() * titles.length)],
      node: titles1[Math.floor(Math.random() * titles1.length)],
      attachment: ''
    });
  }

  res.type('application/json');
  res.status(200).json(re(o));
};

app.get('/api/getProjects', getProject);
app.get('/api/getProject/:id', getProjectById);
app.get('/api/getAnalysis', getAnalysis);

app.listen(3002, function () {
  console.log('Example app listening on port 3002!');
});
