# DD Robot

自定义钉钉机器人Nodejs SDK

官方文档：[https://open.dingtalk.com/document/group/custom-robot-access](https://open.dingtalk.com/document/group/custom-robot-access)

## 用法

### 安装依赖

```javascript
yarn add dd-robot
```

### 创建机器人实例，引入钉钉机器人配置文件

钉钉机器人配置文件robotconfig.js

```javascript
const robotConfig = {
  token: '9651356172cdb41401f9963e3d0a2d732e88368703f103a3c161fc9270ff9215',
  // 需要@人员手机号
  atMobiles: [],
  // 被@人的用户ID
  atUserIds: [],
  // 是否需要@所有人
  isAtAll: false,
  // 钉钉群通知关键字
  keyword: ['发布'],
};

module.exports = {
  robotConfig,
};
```

```javascript
const DdRobot = require('dd-robot');
const robotConfig = require('./robotConfig');

const robot = new DdRobot({
  token: '9651356172cdb41401f9963e3d0a2d732e88368703f103a3c161fc9270ff9215',
  robotConfig: robotConfig,
});

// 或者通过内置的setRobotConfig方法来设置钉钉机器人的配置
const robot = new DdRobot({
  token: '9651356172cdb41401f9963e3d0a2d732e88368703f103a3c161fc9270ff9215',
}).setRobotConfig(robotConfig);
```

### 发送钉钉信息

#### 自定义发布消息

需要手动拼接参数及相关通知人员信息，可以自定义发布样式，灵活度高

```javascript
// 假如需要发送markdown类型
robot.send(
  {
    "msgtype": "markdown",
    "markdown": {
      "title": `我在发布markdown类型通知`,
      "text": `#### 我在发布markdown类型通知@150xxxxxxxx`,
    },
    "at": {
      "atMobiles": ['150xxxxxxxx'],
      "atDingtalkIds": [],
      "isAtAll": false
  }}
)
```

#### 使用内置的发布模板

只需要传入发布消息即可，人员通知信息可以直接从钉钉机器人配置文件中读取

```javascript
const markdownContent = {
  "title": `我在发布markdown类型通知`,
  "text": `#### 我在发布markdown类型通知`,
}

robot.markdown(markdownContent);
```

### 各种格式信息demo

#### text

```javascript
const textContent = {
  text: '我在发布文本类型通知',
}

robot.text(textContent);
```

#### link

```javascript
const linkContent = {
  title: '我在发布link类型通知', 
  text: '我在发布文本类型通知', 
  messageUrl: 'https://img.zcool.cn/community/031ikplcvuktiz5dhy0wziy3531.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
  picUrl: '',
}

robot.link(textContent);
```

#### markdown

```javascript
const markdownContent = {
  "title": `我在发布markdown类型通知`,
  "text": `#### 我在发布markdown类型通知`,
}

robot.markdown(markdownContent);
```

#### ActionCard

```javascript
const actionCardContent = {
  title: '我在发布ActionCard类型通知',
  text: '我在发布ActionCard类型通知',
  singleTitle: '我在发布ActionCard类型通知',
  singleURL: 'https://img.zcool.cn/community/031ikplcvuktiz5dhy0wziy3531.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100'
}

robot.actionCard(actionCardContent);
```

#### FeedCard

```javascript
const feedCardContent = {
  links: [
    {
      title: '我在发布FeedCard类型通知', 
      messageURL: 'https://img.zcool.cn/community/031ikplcvuktiz5dhy0wziy3531.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
      picURL: ''
    }
  ]
}

robot.feedCard(feedCardContent);
```

### 暴露的方法

#### 信息发送

```javascript
robot.send(content)
```

#### 信息发送类型方法

```javascript
// 文本类型
robot.text(content);
// link类型
robot.link(content);
// markdown类型
robot.markdown(content);
// actionCard类型
robot.actionCard(content);
// feedCard类型
robot.feedCard(content);
```

#### 预留方法

```javascript
/*
* setKey
* 用来新增自定义类型的方法或者自定义字段
*/
// 自定义新的通知方式
robot.setKey('img', (content) => {
  return this.send({
    msgtype: 'img',
    img: content,
  })
})
// 使用方式
const imgContent = {
  title: '我是新定义的img类型通知',
  singleURL: 'https://img.zcool.cn/community/031ikplcvuktiz5dhy0wziy3531.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
}
robot.img(imgContent);

// 自定义属性值
robot.setKey('time', new Date());
// 使用方式
const imgContent = {
  title: `推送时间${this.time}`,
  singleURL: 'https://img.zcool.cn/community/031ikplcvuktiz5dhy0wziy3531.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
}
robot.img(imgContent);

// 自定义机器人配置
robot.setKey('config', robotConfig)
```

## 注意的点

- 每分钟最多发送20条信息，信息过多时使用`markdown`摘要的形式发送
- 发起请求是字符集需要设置为`uff-8`

## 相关问题

[钉钉机器人相关问题](https://github.com/xccjk/x-blog/issues/67)
