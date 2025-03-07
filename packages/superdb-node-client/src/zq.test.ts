import * as Stream from 'stream';
import { createTransformStream, zq } from './zq';
import { getPath } from '@brimdata/sample-data';
import { createReadStream } from 'fs';

if (process.env['GITHUB_ACTIONS'] === 'true') {
  jest.setTimeout(30_000);
}

test('zq.stream', async () => {
  const input = Stream.Readable.from('1 2 3', { encoding: 'utf-8' });
  const zq = createTransformStream({ query: '{num: this}', f: 'jsup' });
  let text = '';
  for await (const chunk of input.pipe(zq)) {
    if (chunk) text += chunk.toString();
  }
  expect(text).toMatchInlineSnapshot(`
    "{
        num: 1
    }
    {
        num: 2
    }
    {
        num: 3
    }
    "
  `);
});

test('zq with readable stream', async () => {
  const input = Stream.Readable.from('1 2 3', { encoding: 'utf-8' });
  const objects = await zq({ query: '{num: this}', as: 'js', input });

  expect(objects).toMatchInlineSnapshot(`
    [
      {
        "num": 1,
      },
      {
        "num": 2,
      },
      {
        "num": 3,
      },
    ]
  `);
});

test('zq with file', async () => {
  const file = getPath('zillow.csv');
  const objects = await zq({ query: 'head 1', as: 'js', file });

  expect(objects).toMatchInlineSnapshot(`
    [
      {
        "Bathrooms": 4,
        "Bedrooms": 4,
        "Broker agent": null,
        "Broker name": "Coldwell Banker West",
        "City": "Alpine",
        "Country": "USA",
        "Days on Zillow": null,
        "Listing description": "Foreclosure",
        "Living Area": 3653,
        "Living Area Unit": "sqft",
        "Lot size": null,
        "Lot size unit": null,
        "MLS ID": null,
        "Price cut amount": null,
        "Price cut date": null,
        "Price per sqft": 273.75,
        "Price was cut": "No",
        "Property URL": "https://www.zillow.com/homedetails/1333-Ramblewood-Rd-Alpine-CA-91901/16903660_zpid/",
        "Property price": 1000000,
        "Property type": "OTHER",
        "State": "CA",
        "Street Address": "1333 Ramblewood Rd",
        "Zip": 91901,
      },
    ]
  `);
});

test('zq with zjson objects', async () => {
  const path = getPath('prs.json');
  const input = createReadStream(path);

  const data = await zq({ query: 'over this | head 10', as: 'zjson', input });

  expect(data).toHaveLength(10);
});

test('zq with a file ', async () => {
  const path = getPath('prs.json');

  const data = await zq({
    query: 'over this | head 10',
    as: 'zjson',
    file: path,
  });

  expect(data).toHaveLength(10);
});

test('zq with a bad zed ', async () => {
  const path = getPath('prs.json');
  const promise = zq({
    query: 'over this | isNull(*) | head 10',
    as: 'zjson',
    input: createReadStream(path),
  });

  await expect(promise).rejects.toThrowError(
    /parse error at line 1, column 20/
  );
});

test('head 100 on guns ', async () => {
  const path = getPath('background_checks.csv');
  const data = await zq({
    query: 'head 100',
    as: 'zjson',
    input: createReadStream(path),
  });
  expect(data).toHaveLength(100);
});

test('two files with different types', async () => {
  const file1 = getPath('background_checks.csv');
  const file2 = getPath('prs.json');
  const data = await zq({
    query: 'count()',
    as: 'js',
    file: [file1, file2],
  });
  expect(data).toEqual([16226]);
});

test('two files with different types as readable stream', async () => {
  const file1 = getPath('background_checks.csv');
  const file2 = getPath('prs.json');
  const data = await zq({
    query: 'count()',
    as: 'js',
    file: [file1, file2],
  });
  expect(data).toEqual([16226]);
});
