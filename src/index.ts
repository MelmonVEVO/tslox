import { readFileSync } from 'fs';

enum TokenType {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,
  // One or two character tokens.
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  // Literals.
  IDENTIFIER,
  STRING,
  NUMBER,
  // Keywords.
  AND,
  CLASS,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  NIL,
  OR,
  PRINT,
  RETURN,
  SUPER,
  THIS,
  TRUE,
  VAR,
  WHILE,

  EOF
}

enum ExpressionType {
  UNARY,
  BINARY,
  GROUPING,
  OPERATOR
}

const KEYWORDS_MAP = {
  AND: TokenType.AND,
  CLASS: TokenType.CLASS,
  ELSE: TokenType.ELSE,
  FALSE: TokenType.FALSE,
  FUN: TokenType.FUN,
  FOR: TokenType.FOR,
  IF: TokenType.IF,
  NIL: TokenType.NIL,
  OR: TokenType.OR,
  PRINT: TokenType.PRINT,
  RETURN: TokenType.RETURN,
  SUPER: TokenType.SUPER,
  THIS: TokenType.THIS,
  TRUE: TokenType.TRUE,
  VAR: TokenType.VAR,
  WHILE: TokenType.WHILE
};

interface BinaryExpr {
  type: ExpressionType.BINARY;
  symbols: [Expression, Token, Expression];
}

interface UnaryExpr {
  type: ExpressionType.UNARY;
  symbols: [Token, Expression];
}

interface GroupingExpr {
  type: ExpressionType.GROUPING;
  symbols: [Token, Expression, Token];
}

interface OperatorExpr {
  type: ExpressionType.OPERATOR;
  symbols: [Token];
}

type Expression = BinaryExpr | UnaryExpr | GroupingExpr | OperatorExpr

interface Token {
  type: TokenType;
  lexeme: string;
  line: number;
}

const isDigit = (c: string) => /\d/.test(c);

const isAlpha = (c: string) => /[a-zA-Z]/.test(c);

const isAlphanumeric = (c: string) => isDigit(c) || isAlpha(c);

// Pretty prints a provided error message.
const reportErr = (line: number, message: string) => {
  console.error(`[line ${line}] Error: ${message}`);
};

const parseTokens = (tokens: Token[]) => {
};

// Takes in a script, tokenises it and returns the resulting array.
const scanTokens = (script: string): Token[] => {
  const tokens: Token[] = [];
  let startChar = 0;
  let currentChar = 0;
  let line = 1;

  const eof = () => currentChar >= script.length;

  const newToken = (type: TokenType) => {
    tokens.push({
      type,
      lexeme: script.substring(startChar, currentChar),
      line
    });
  };

  const matchNext = (expected: string): boolean => {
    if (eof()) return false;
    if (script[currentChar] != expected) return false;
    currentChar++;
    return true;
  };

  const scanToken = () => {
    const character = script[currentChar++];
    switch (character) {
      case '(':
        newToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        newToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        newToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        newToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        newToken(TokenType.COMMA);
        break;
      case '.':
        newToken(TokenType.DOT);
        break;
      case '-':
        newToken(TokenType.MINUS);
        break;
      case '+':
        newToken(TokenType.PLUS);
        break;
      case ';':
        newToken(TokenType.SEMICOLON);
        break;
      case '*':
        newToken(TokenType.STAR);
        break;
      case '!':
        newToken(matchNext('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        newToken(matchNext('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        newToken(matchNext('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        newToken(matchNext('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (matchNext('/')) {
          // Comment that goes to the end of the line.
          while (!eof() && script[currentChar] != '\n') currentChar++;
          break;
        }
        newToken(TokenType.SLASH);
        break;
      case '"':
        while (script[currentChar] != '"' && !eof()) {
          if (eof()) reportErr(line, 'Unterminated string.');
          if (script[currentChar] == '\n') line++;
          currentChar++;
        }
        currentChar++;
        newToken(TokenType.STRING);
        break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        line++;
        break;
      default:
        if (isDigit(character)) {
          while (isDigit(script[currentChar])) currentChar++;
          if (
            currentChar + 1 < script.length &&
            matchNext('.') &&
            isDigit(script[currentChar + 1])
          ) {
            currentChar++;
            while (isDigit(script[currentChar])) currentChar++;
          }
          newToken(TokenType.NUMBER);
          break;
        }
        if (isAlpha(character)) {
          while (isAlpha(script[currentChar])) currentChar++;
          const keyword = script
            .substring(startChar, currentChar)
            .toUpperCase();
          if (keyword in KEYWORDS_MAP) newToken(KEYWORDS_MAP[keyword]);
          else newToken(TokenType.IDENTIFIER);
          break;
        }
        reportErr(line, 'Unexpected character.');
        break;
    }
  };

  while (!eof()) {
    startChar = currentChar;
    scanToken();
  }

  tokens.push({
    type: TokenType.EOF,
    lexeme: '',
    line
  });

  return tokens;
};

// Interprets a provided script.
const runScript = (script: string) => {
  const tokens: Token[] = scanTokens(script);
  console.log(tokens); // just for now
};

// Loads up a file and runs the whole thing.
const runFile = (fileLocation: string) => {
  const script: string = readFileSync(fileLocation, 'utf8');
  runScript(script);
};

// Processing for the user REPL.
const repl = () => {
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  process.stdout.write('lox> ');
  process.stdin.on('data', (data) => {
    const command = data.toString().trim();
    if (command.toUpperCase() === 'EXIT') {
      console.log('Exiting...');
      process.exit(0);
    }
    runScript(command);

    process.stdout.write('lox> ');
  });
};

const main = (args: string[]) => {
  if (args.length > 1) {
    console.log('usage: lox [script]');
    process.exit(1);
  }
  if (args.length === 0) {
    repl();
  }
};

const args = process.argv.slice(2);
main(args);
