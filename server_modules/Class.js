class Test {
    constructor() {
        console.log('constructed');
    }
    initTest() {
        console.log('test');
    }
    testHello() {
        console.log('hello');
        this.initTest();
    }
}
module.exports = Test;