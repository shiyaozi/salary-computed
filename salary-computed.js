// 个人类别
const categoryPersonal = 'Personal';
// 单位类别
const categoryCompany = 'Company';

/**
 * 颜色
 */
let COLOR;
(function (COLOR) {
    COLOR[(COLOR['blue'] = 36)] = 'blue';
    COLOR[(COLOR['red'] = 91)] = 'red';
    COLOR[(COLOR['green'] = 92)] = 'green';
    COLOR[(COLOR['violet'] = 95)] = 'violet';
    COLOR[(COLOR['white'] = 97)] = 'white';
})(COLOR || (COLOR = {}));

/**
 * 给文字快捷上色
 * @param {string} text 文字内容
 * @param {COLOR} color 颜色
 * @returns 上过色之后的文字
 */
function colorFn(text, color) {
    const colorBase = '\033[49;$colorm$text\033[0m';
    return colorBase.replace('$color', color).replace('$text', text);
}
/**
 * 可以对这里进行认缴率的调节
 */
const persent = {
    // 养老保险
    elderlyCarePersonal: { v: 8, d: '养老保险(个人缴) ' },
    elderlyCareCompany: { v: 16, d: '养老保险(单位缴) ' },
    // 医疗保险
    medicalCarePersonal: { v: 2, d: '医疗保险(个人缴) ' },
    medicalCareCompany: { v: 10, d: '医疗保险(单位缴) ' },
    // 失业保险
    gCarePersonal: { v: 0.5, d: '失业保险(个人缴) ' },
    gCareCompany: { v: 0.5, d: '失业保险(单位缴) ' },

    // 生育保险
    birthCarePersonal: { v: 0, d: '生育保险(个人缴) ' },
    birthCareCompany: { v: 0.7, d: '生育保险(单位缴) ' },

    // 工伤保险
    injuryCarePersonal: { v: 0, d: '工伤保险(个人缴) ' },
    injuryCareCompany: { v: 0.3, d: '工伤保险(单位缴) ' },

    // 公积金
    publicCarePersonal: { v: 7, d: '公积金(个人缴)   ' },
    publicCareCompany: { v: 7, d: '公积金(单位缴)   ' }
};

/**
 * 转换整数为百分数
 * @param {number} num 整数
 * @returns 百分数
 */
const $ = (num) => num / 100;

/**
 * 版本信息
 * @returns 版本信息
 */
function version() {
    const text = `\n\n    
    Power by 诗遥子shiyaozi 2022\n    
    脚本不具备任何联网行为;\n 
    它只适用于长春市,其他城市地区调节下相关参数就好了呗;\n   
    初衷只是为了让大家更清楚的认识自己的薪资结构;\n    
    避免出现不必要的纠纷.\n
    邮箱: ${colorFn('shiyao.cy@gmail.com',COLOR.violet)}\n
    github首页: ${colorFn('https://github.com/shiyaozi',COLOR.violet)}
    \n\n`;
    console.log(text);
}

/**
 * 使用帮助
 */
function help() {
    const text = `
    \n
    Power by 诗遥子shiyaozi 2022\n
    node main 基本薪资 查询个人和单位所缴 \n
    node main 基本薪资 [-p] 指定查询个人所缴 \n
    node main 基本薪资 [-c] 指定查询单位所缴 \n
    node main -h 查询帮助 \n
    node main -v 查看当前版本信息 \n
    了解更多有关社保(长春)政策,请登录吉林省社保局官网: ${colorFn('http://ccshbx.changchun.gov.cn/',COLOR.red)}
    \n`
    console.log(text);
}

/**
 * 错误
 */
function error() {
    const text = `\n\n   
    主启动指令为 \"node main 基本薪资\"\n   
    输入 \"node main -h\"获取更多帮助\n\n`;
    console.log(text);
}

/**
 * setup
 * @returns 
 */
function setup() {
    const args = process.argv;
    const salary = args[2];
    const type = args[3];
    if (!salary) {
        error();
        return;
    }
    if (salary == '-v') {
        version();
        return;
    }
    if (salary == '-h') {
        help();
        return;
    }
    return { salary, type };
}

/**
 * 计算函数
 * @param salary 工资基数
 * @param type 查询类型
 * @returns 
 */
function computed({ salary, type }) {
    let results = Object.keys(persent).map(item => {
        let pers = persent[item];
        return {
            title: pers.d,
            value: Math.round($(pers.v) * salary),
            type: item.indexOf(categoryPersonal) > -1 ? categoryPersonal : categoryCompany
        }
    });
    const companyCount = results.map(item => item.type === categoryCompany ? item.value : 0).reduce((a, b) => a + b);
    const personalCount = results.map(item => item.type === categoryPersonal ? item.value : 0).reduce((a, b) => a + b);

    if (type === '-p') {
        results = results.filter(item => item.type === categoryPersonal);
    }
    if (type === '-c') {
        results = results.filter(item => item.type === categoryCompany);
    }
    return {
        companyCount,
        personalCount,
        details: results,
        salary,
        print: function () {
            print(this)
        }
    }

}

/**
 * 打印函数
 */
function print({ companyCount, personalCount, details, salary }) {
    console.log('\n\n\n  当月社保等缴纳明细 \n  = = = = = = = = = = = = =\n');
    details.forEach(item => {
        if (item.type === categoryPersonal) {
            console.log(`  ${colorFn(item.title, COLOR.green)}: ${colorFn(item.value, COLOR.green)}`);
        } else {
            console.log(`  ${colorFn(item.title, COLOR.blue)}: ${colorFn(item.value, COLOR.blue)}`);
        }
    });
    console.log('\n');
    console.log(`  工资总数        : ${colorFn(salary, COLOR.violet)}`);
    console.log(`  ${colorFn('单位缴纳总额', COLOR.blue)}    : ${colorFn(companyCount, COLOR.blue)}`);
    console.log(`  ${colorFn('个人缴纳总额', COLOR.green)}    : ${colorFn(personalCount, COLOR.green)}`);
    console.log(`  ${colorFn('应发工资', COLOR.red)}        : ${colorFn(salary - personalCount, COLOR.red)}`);
    console.log('\n  = = = = = = = = = = = = =\n\n');
}

/**
 * 主函数
 */
(function () {
    const setupArgs = setup();
    if (!setupArgs) {
        return;
    }
    computed(setupArgs).print();
})();