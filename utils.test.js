const utils = require('./utils');

test('json2String', () => {
    expect(utils.json2String({
        a: 1,
        b: {
            c: 2
        }
    })).toMatchSnapshot()
});

test('removeExtraSpaces', () => {
    expect(utils.removeExtraSpaces("  hello    world    ")).toBe("hello world")
});

test('removeWords', () => {
    expect(utils.removeWords("foo bar baz afoo foox bar baz", ["foo", "bar"])).toBe("baz afoo foox baz")
});

test('removeWords (with non ascii characters)', () => {
    expect(utils.removeWords("foo bàr baz àfoo foox bar baz", ["foo", "bar"])).toBe("bàr baz àfoo foox baz")
});

test('removeSmallWords (with non ascii characters)', () => {
    expect(utils.removeSmallWords("x féo à ba xbàz b xféo   xbar bàz ")).toBe(" féo xbàz xféo   xbar bàz ")
});