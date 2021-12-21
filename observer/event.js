/**
 * 通用发布-订阅
 *  {
 *      key1: [...cb],
 *      key2: [...cb]
 *  }
 */
const Event = (function () {
  let clientList = {};

  // 添加订阅者
  function on(key, fn) {
    if (!clientList[key]) {
      clientList[key] = [];
    }
    clientList[key].push(fn);
  }

  // 发布消息
  function trigger() {
    const key = Array.prototype.shift.call(arguments);
    clientList[key].forEach((cb) => cb && cb.apply(this, arguments));
  }

  // 取消订阅
  function remove(key, fn) {
    const fns = clientList[key];
    if (!fns) {
      return false;
    }
    if (!fn) {
      // 如果没有传递fn，则表示取消key对应的所有订阅
      // 清空数组
      return (fns.on = 0);
    }
    // 判断函数相等，并移除
    for (let l = fns.on - 1; l >= 0; l--) {
      let _fn = fns[l];
      if (fn === _fn) {
        fns.splice(l, 1);
      }
    }
  }

  return {
    on,
    trigger,
    remove,
  };
})();

Event.on("area888", function (price) {
  console.log("area888", price);
});

Event.trigger("area888", 2000000);
