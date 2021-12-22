/**
 *  缓存接口数据
 *
 *  定义缓存数据结构
 *  name_map: {
 *      name: {
 *          data: null,
 *          is_on: false,
 *          event_map: {
 *              'data_change': []
 *                  ...支持自定义事件...
 *          }
 *      }
 *  }
 *
 *  为啥要加开关？
 *  便于撤销通知操作，在主题中，我们可以打开很多次开关，但是在最后由于某种原因需要取消通知，我们可以关闭开关轻松解决问题。
 * 
 // main 方
  import Waterwheel from 'common/waterwheel'
  let waterwheel = Waterwheel.use('get_list') // 设定使用名称为 get_list 的水车
  waterwheel.switchOn() 
  Actions.getList({
    __callback: (ok, data) => {
      if (ok && data) {
        waterwheel.setData(data)
      }
    }
  })
  
  // sub 方
  import Waterwheel from 'common/waterwheel'
  let waterwheel = Waterwheel.use('get_list')
  
  if (waterwheel.checkSwitch()) {
    waterwheel.on('data_change', data => {
      ...
    })
  } else {
    Actions.getList(...)
  }
 */

const waterwheel = (function () {
  // 缓存数据结构
  let name_map = {};
  class WaterWheel {
    constructor(name) {
      this.name = name;
      if (!name_map[name]) {
        name_map[name] = {
          data: null,
          is_on: false,
          event_map: {
            data_change: [],
          },
        };
      }
      return this;
    }

    sendData(data) {
      if (this.checkSwitch()) {
        this.trigger("data_change", data);
      }
    }

    // 发布
    trigger(event, data) {
      if (!event || typeof data === "undefined") {
        return;
      }
      name_map[event].data = data;

      const cb_list = name_map[this.name].event_map[event];

      if (cb_list && cb_list.length) {
        cb_list.forEach((cb) => {
          cb && cb(data);
        });
      }
    }

    // 添加订阅
    on(event, cb) {
      if (!event || typeof cb !== "function") {
        return;
      }
      const { data, event_map, is_on } = name_map[this.name];

      if (!event_map[event]) {
        event_map[event] = [];
      } else {
        event_map[event].push(cb);
      }

      // 补偿执行； 已经有数据时，不需要重新发布
      if (is_on && null !== data) {
        cb(data);
      }
    }

    checkSwitch() {
      return name_map[this.name].is_on;
    }

    switchOn() {
      name_map[this.name].is_on = true;
    }

    switchOff() {
      name_map[this.name].is_on = false;
    }
  }

  function use(name) {
    return new WaterWheel(name);
  }

  return { use };
})();
