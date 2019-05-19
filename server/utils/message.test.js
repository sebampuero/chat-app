const expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage',()=>{
  it('should generate the correct message object',()=>{
    var result = generateMessage('Juanita','Hola');
    expect(result).toEqual({
      from: 'Juanita',
      text: 'Hola',
      createdAt: new Date().getTime()
    });
    expect(result.createdAt).toBeA('number');
  });
});
