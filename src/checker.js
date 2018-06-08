class ErrorMessage {
  NON_PAIR(bracket) {
    return `배열의 ${bracket} 개수 오류`
  }
  UNKNOWN_TYPE(str) {
    return `${str}은 알 수 없는 타입입니다`
  }
  NOT_PAIR_QUOTE(str) {
    return `${str}은 올바른 문자열이 아닙니다`
  }
  NOT_FOUND_KEY() {
    return `':'이 누락된 객체표현이 있습니다`
  }
}
class Syntax {
  constructor() {
    this.ERROR_MESSAGE = new ErrorMessage();
    this.errorMessage = null;
  }
  checkError(targetString, option) {
    if (this.isString(targetString)) {
      this.checkPairQuote(targetString);
    } else {
      this.isMixedType(targetString);
    }
    this.isStringWithoutQuote(targetString, option);
    if (this.errorMessage) throw this.errorMessage;
  }
  isMixedType(targetString) {
    if (targetString.match(/[0-9]\D|\D[0-9]/)) {
      this.errorMessage = this.ERROR_MESSAGE.UNKNOWN_TYPE(targetString);
      return this.ERROR_MESSAGE.UNKNOWN_TYPE(targetString);
    } else return true;
  }
  isStringWithoutQuote(targetString, key) {
    const exceptionWord = ['null', 'true', 'false'];
    if (key === 'key') return;
    else if (exceptionWord.indexOf(targetString) > -1) return;
    else if (!Number.isInteger(+targetString) && !this.isString(targetString)) {
      this.errorMessage = this.ERROR_MESSAGE.UNKNOWN_TYPE(targetString);
      return this.ERROR_MESSAGE.UNKNOWN_TYPE(targetString);
    }
    else return true;
  }

  checkPairQuote(str) {
    str = this.removeSideBracket(str);
    const countQuote = (str.match(/\'/g) || []).length;
    if (countQuote === 0 || countQuote === 2) {
      return true;
    } else {
      this.errorMessage = this.ERROR_MESSAGE.NOT_PAIR_QUOTE(str);
      return this.errorMessage;
    }
  }
  isNumber(str) {
    if (str === '') return false;
    if (!isNaN(+str)) return true;
  }
  isString(str) {
    if (str[0] === "'" && str[str.length - 1] === "'") return true;
  }
  isEmpty(str) {
    if (str === ' ') return true;
  }

  isArray(str) {
    if (str[0] === '[' && str[str.length - 1] === ']') return true;
  }
  isObject(str) {
    if (str[0] === '{' && str[str.length - 1] === '}') return true;
  }
  changeToNullAndBoolean(str) {
    if (str === 'null') return null;
    if (str === 'true') return true;
    if (str === 'false') return false;
    return str;
  }
  checkKey(context) {
    if (context.temp === '') throw this.ERROR_MESSAGE.NOT_FOUND_KEY();
  }
  isPairBracket(str) {
    if (!str) return;
    let minimumBracket = false;
    const curlyLeft = (str.match(/\{/g) || []).length;
    const curlyRight = (str.match(/\}/g) || []).length;
    const squareLeft = (str.match(/\[/g) || []).length;
    const squareRight = (str.match(/\]/g) || []).length;
    if (curlyLeft || curlyRight || squareLeft || squareRight) minimumBracket = true;
    const curly = curlyLeft - curlyRight;
    const square = squareLeft - squareRight;
    if (!minimumBracket) return;
    if (!curly && !square) return true;
    else if (square) this.errorMessage = this.ERROR_MESSAGE.NON_PAIR('대괄호');
    else if (curly) this.errorMessage = this.ERROR_MESSAGE.NON_PAIR('중괄호');
    return this.errorMessage;
  }
  removeLastComma(str) {
    const removed = (str[str.length - 1] === ',') ? str.substr(0, str.length - 1) : str;
    return removed;
  }
  removeLastEqual(str) {
    const removed = (str[str.length - 1] === ':') ? str.substr(0, str.length - 1) : str;
    return removed
  }
  removeBracket(str) {
    const removed = str.substring(1, str.length - 1);
    return removed;
  }
  removeSideBracket(str) {
    const removed = str.replace(/\[|\]/g, '');
    return removed;
  }
  removeSideQuote(str) {
    let removed = str.replace(/^\'|\'$/g, '')
    return removed;
  }
}
exports.Syntax = Syntax;
exports.ErrorMessage = ErrorMessage;
const st = new Syntax(new ErrorMessage());