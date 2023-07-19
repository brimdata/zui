const assert = chai.assert;

describe('zq', () => {
  it('input is string', async () => {
    const input = '1 2 3';
    const resp = await zq({ input, program: 'this + 1' });
    assert.deepEqual(resp, [2, 3, 4]);
  });

  it('input is file', async () => {
    const input = new File(['1 2 3'], 'file.json');
    const resp = await zq({ input, program: 'this + 1' });

    assert.deepEqual(resp, [2, 3, 4]);
  });

  it('input is blob', async () => {
    const input = new Blob(['1 2 3']);
    const resp = await zq({ input, program: 'this + 1' });
    assert.deepEqual(resp, [2, 3, 4]);
  });

  it('input is readable stream', async () => {
    const input = new Blob(['1 2 3']).stream();
    const resp = await zq({ input, program: 'this + 1' });
    assert.deepEqual(resp, [2, 3, 4]);
  });

  it('input is a fetch', async () => {
    const input = await fetch('./package.json');
    const resp = await zq({ input, program: 'yield name' });
    assert.deepEqual(resp, ['@brimdata/zed-wasm']);
  });

  it('input is an array of JS objects', async () => {
    const input = [1, 2, 3];
    const zed = await zq({ input, program: 'this + 1', outputFormat: 'zed' });
    const resp = zed.map((val) => val.toJS());
    assert.deepEqual(resp, [2, 3, 4]);
  });

  it('works on 32kb+ file', async () => {
    const count = 16000;
    let str = '';
    for (let i = 0; i < count; i++) str += `1 `;
    const input = new File([str], '32kb.txt');
    const resp = await zq({ input, program: 'count()' });

    assert.deepEqual(resp, [count]);
  });
});
