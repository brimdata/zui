const assert = chai.assert;

describe('parse', () => {
  it('should parse some shit', async () => {
    try {
      const resp = await parse('me :=');
      console.log('resp', resp)
    }
    catch (err) {
      console.log("error.caught", err)
    }
  });
});
