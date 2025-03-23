import { readFileSync } from 'fs';
import readline from 'readline';

enum TokenType {
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,
  // One or two character tokens.
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,
  // Literals.
  IDENTIFIER, STRING, NUMBER,
  // Keywords.
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
};

interface Token {
  type: TokenType;
  lexeme: string;
  line: number;
};

// Pretty prints a provided error message.
const reportErr = (line: number, where: string, message: string) => {
  console.error(`[line ${line}] Error ${where}: ${message}`);
};

const scanToken = (lexeme: string): TokenType => {
  if (lexeme.length === 1) {
    switch (lexeme) {
      case '(': return TokenType.LEFT_PAREN;
      case ')': return TokenType.RIGHT_PAREN;
      case '{': return TokenType.LEFT_BRACE;
      case '}': return TokenType.RIGHT_BRACE;
      case ',': return TokenType.COMMA;
      case '.': return TokenType.DOT;
      case '-': return TokenType.MINUS;
      case '+': return TokenType.PLUS;
      case ';': return TokenType.SEMICOLON;
      case '*': return TokenType.STAR;
    }
  }
  if (lexeme.length === 2) {
    switch (lexeme) {
      case '!': return TokenType.BANG;
      case '!=': return TokenType.BANG_EQUAL;
      case '=': return TokenType.EQUAL;
      case '==': return TokenType.EQUAL_EQUAL;
      case '>': return TokenType.GREATER;
      case '>=': return TokenType.GREATER_EQUAL;
      case '<': return TokenType.LESS;
      case '<=': return TokenType.LESS_EQUAL;
    }
  }

}

// Takes in a string, tokenises it and returns the resulting array.
const scanTokens = (script: string): Token[] => {
  const tokens: Token[] = [];
  const lexemes = script.split(' ');
  for (const lex in lexemes) {
  }
};

// Interprets a provided script.
const runScript = (script: string) => {
  const tokens: Token[] = scanTokens(script);
  for (const i in tokens) {
    console.log(i);
  }
};

// Loads up a file and runs the whole thing.
const runFile = (fileLocation: string) => {
  const script: string = readFileSync(fileLocation, 'utf8');
  runScript(script);
};

// Processing for the user REPL.
const repl = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  let user_input: string = '';
  while (true) {
    rl.question('lox> ', (command: string) => user_input = command);
    if (user_input === '') { continue; }
    runScript(user_input);
  }
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
