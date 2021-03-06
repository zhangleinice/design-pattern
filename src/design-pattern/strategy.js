/**
 * 缺点
 * 1.calculateBonus函数比较庞大，包含了许多if-else语句
 * 2.缺乏弹性，新增一种新的绩效，必须深入calculateBonus的内部实现，违反开放封闭原则
 * 3.算法的复用性差
 */
var calculateBonus = function( performanceLevel, salary ) {
    if ( performanceLevel === 'S' ) {
        return salary * 4;
    }
    if ( performanceLevel === 'A' ) {
        return salary * 3;
    }
    if ( performanceLevel === 'B' ) {
        return salary * 2;
    }
};

calculateBonus( 'B', 20000 ); // 输出：40000
calculateBonus( 'S', 6000 ); // 输出：24000


/**
 * 策略模式
 * js中函数也是对象，直接把strategies定义城函数
 */
var strategies = {
    "S": function( salary ) {
        return salary * 4;
    },
    "A": function( salary ) {
        return salary * 3;
    },
    "B": function( salary ) {
        return salary * 2;
    }
};
var calculateBonus = function( level, salary ) {
    return strategies[ level ]( salary );
};

console.log( calculateBonus( 'S', 20000 ) ); // 输出：80000
console.log( calculateBonus( 'A', 10000 ) ); // 输出：30000


/**
 *  高阶函数版策略模式
 */
const S = salary => salary * 4
const A = salary => salary * 3
const B = salary => salary * 2

const calculateBonus = ( func, salary ) => func( salary )

calculateBonus( S, 10000 ) // 输出： 40000


/**
 * 表单校验
 */
/***********************策略对象**************************/
var strategies = {
    isNonEmpty: function( value, errorMsg ) {
        if ( value === '' ) {
            return errorMsg;
        }
    },
    minLength: function( value, length, errorMsg ) {
        if ( value.length < length ) {
            return errorMsg;
        }
    },
    isMobile: function( value, errorMsg ) {
        if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ) {
            return errorMsg;
        }
    }
};
/***********************Validator 类**************************/
var Validator = function() {
    this.cache = [];
};
Validator.prototype.add = function( dom, rules ) {
    var self = this;
    for ( var i = 0, rule; rule = rules[ i++ ]; ) {
        ( function( rule ) {
            var strategyAry = rule.strategy.split( ':' );
            var errorMsg = rule.errorMsg;
            self.cache.push( function() {
                var strategy = strategyAry.shift();
                strategyAry.unshift( dom.value );
                strategyAry.push( errorMsg );
                return strategies[ strategy ].apply( dom, strategyAry );
            } );
        } )( rule )
    }
};
Validator.prototype.start = function() {
    for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ) {
        var errorMsg = validatorFunc();
        if ( errorMsg ) {
            return errorMsg;
        }
    }
};
/***********************客户调用代码**************************/
var registerForm = document.getElementById( 'registerForm' );
var validataFunc = function() {
    var validator = new Validator();
    validator.add( registerForm.userName, [ {
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于10 位'
    } ] );
    validator.add( registerForm.password, [ {
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于6 位'
    } ] );
    var errorMsg = validator.start();
    return errorMsg;
}
registerForm.onsubmit = function() {
    var errorMsg = validataFunc();
    if ( errorMsg ) {
        alert( errorMsg );
        return false;
    }

};