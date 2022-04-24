#!/usr/bin/env node
const https = require('https');

class Robot {
  constructor(props) {
    const { token, robotConfig } = props || {};
    if (!token) {
      throw new Error('请填写钉钉群的webhook！');
    }
    this.token = token;
    this.config = robotConfig || {};
  }

  httpOptions = (token, data) => {
    return {
      hostname: 'api.dingtalk.com',
      port: 443,
      path: '/robot/send?access_token=' + token,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: JSON.stringify(data)
    }
  };

  /**
   * 发送钉钉信息
   * @param {*} data 发送的消息
   */
  send = (data) => {
    return https.request(this.httpOptions(this.token, data));
  }

  /**
   * 获取 @ 通知人员相关信息
   */
  #getAt = () => {
    const { atMobiles = [], atDingtalkIds = [], isAtAll = false } = this.config;
    return {
      atMobiles,
      atDingtalkIds,
      isAtAll,
    }
  }

  /**
   * 拼接@ 人员列表
   */
  #getAtUser = () => {
    const { atMobiles = [], atDingtalkIds = [] } = this.config;
    // 手机号列表
    const notify = atMobiles.length ? atMobiles.map(item => `@${item}`) : ''
    // userId列表
    const userIdList = atDingtalkIds.length ? atDingtalkIds.map(item => `@${item}`) : ''
    return `${notify} ${userIdList}`
  }

  /**
   * 文本类型信息
   */
  text = (content) => {
    return this.send({
      msgtype: 'text',
      text: content,
      at: this.#getAt(),
    })
  }

  /**
   * 链接类型信息
   */
  link = (content) => {
    const { title, text, messageUrl } = content || {};
    if (!title || !text || !messageUrl) {
      throw new Error('link类型参数不正确，参数详细格式请看：https://open.dingtalk.com/document/group/custom-robot-access')
    } else {
      return this.send({
        msgtype: 'link',
        link: content,
      })
    }
  }

  /**
   * actionCard类型信息
   */
  actionCard = (content) => {
    const { title, text } = content;
    if (!title || !text) {
      throw new Error('ActionCard类型参数不正确，参数详细格式请看：https://open.dingtalk.com/document/group/custom-robot-access')
    } else {
      return this.send({
        msgtype: 'actionCard',
        actionCard: content,
      })
    }
  }

  /**
   * feedCard类型信息
   */
  feedCard = (content) => {
    return this.send({
      msgtype: 'feedCard',
      feedCard: content,
    })
  }

  /**
   * markkdown类型信息
   */
  markdown = (content) => {
    const { title, text } = content;
    if (!title || !text) {
      throw new Error('markdown类型参数不正确，参数详细格式请看：https://open.dingtalk.com/document/group/custom-robot-access')
    } else {
      return this.send({
        msgtype: 'markdown',
        markdown: {
          ...content,
          text: `${text} ${this.#getAtUser()}`
        },
        at: this.#getAt(),
      })
    }
  }

  /**
   * 添加自定义属性及方法
   * @param {*} key 方法，属性
   * @param {*} value 函数，属性值
   */
  setKey = (key, value) => {
    if (!this[key]) {
      this[key] = value
    }
    return this;
  }
}

module.exports = Robot;
