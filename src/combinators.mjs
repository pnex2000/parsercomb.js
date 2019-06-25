
const head = l => l[0]
const tail = l => l.slice(1)

// TODO convenience function for printing resulting match
// TODO add fmap

function Success(match, stream) {
    return {
        isFail: false,
        match,
        stream
    }
}

function Fail(stream) {
    return {
        isFail: true,
        match: '',
        stream
    }
}

function failWithMatch(fail, match) {
    return Object.assign({}, fail, { match })
}

// Char -> Parser
// Returns parser that matches the given char
function char(c) {
    return cs =>
        c === head(cs) ? Success(head(cs), tail(cs)) : Fail(cs)
}

// Char -> Match
// Matches any char
function anyChar(cs) {
    return cs.length > 0 ? Success(head(cs), tail(cs)) : Fail(cs)
}

// (Char -> Bool) -> Parser
// Returns parser that matches any char that passes the given test
function charTest(f) {
    return cs =>
        cs.length > 0 && f(head(cs)) ? Success(head(cs), tail(cs)) : Fail(cs)
}

// String -> Parser
// Returns parser that matches entire word
function word(str) {
    const eat = (remain, cs) => {
        if (remain.length === 0) return Success(str, cs)
        return head(remain) === head(cs) ? eat(tail(remain), tail(cs)) : Fail(cs)
    }
    return cs => eat(str, cs)
}

// [Parser a] -> Parser a
// Returns parser that succeeds on the first matching parser (union, |)
function oneOf(...parsers) {
    return cs => {
        for (const p of parsers) {
            const res = p(cs)
            if (!res.isFail) return res
        }
        return Fail(cs)
    }
}

// Parser a -> Parser [a]
// Returns parser that matches the given parser 0 or more times (closure, *)
function zeroOrMore(parser) {
    function eat(match, cs) {
        const res = parser(cs)
        return res.isFail ? Success(match, cs) : eat(match.concat(res.match), res.stream)
    }
    return cs => eat([], cs)
}

// [Parser] -> Parser
// Returns parser that matches every parser in the sequence (concatenation)
function seq(...parsers) {
    function eat(match, cs, parsers) {
        if (parsers.length === 0) return Success(match, cs)
        const res = head(parsers)(cs)
        return res.isFail ? failWithMatch(res, match) : eat(match.concat(res.match), res.stream, tail(parsers))
    }
    return cs => eat([], cs, parsers)
}

// Parser a -> Parser [a]
// matches the given parser at least once (+)
function oneOrMore(parser) {
    return seq(parser, zeroOrMore(parser))
}

// Parser a -> Parser b -> Parser [a]
// matches the given parser at least once so that further matches are separated with sep
function oneOrMoreSep(p, sep) {
    return seq(p, zeroOrMore(seq(sep, p)))
}

// Parser a -> Parser b
// matches the given parser once or zero times
function optional(parser) {
    return cs => {
        const res = parser(cs)
        return res.isFail ? Success([], cs) : Success([res.match], res.stream)
    }
}

// Parser a -> Parser b -> Parser [a]
// matches the given parser zero or more times so that further matches are separated with sep
function zeroOrMoreSep(p, sep) {
    return optional(oneOrMoreSep(p, sep))
}

export {
    anyChar,
    char,
    charTest,
    word,
    oneOf,
    zeroOrMore,
    seq,
    oneOrMore,
    oneOrMoreSep,
    optional,
    zeroOrMoreSep
}
