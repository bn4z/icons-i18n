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
    expect(utils.removeWords("foo bar baz afoo bar baz", ["foo", "bar"])).toBe("baz afoo baz")
});