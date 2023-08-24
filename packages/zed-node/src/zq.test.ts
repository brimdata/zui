import * as Stream from 'stream';
import { createStream, zq } from './zq';
import { getPath } from '@brimdata/sample-data';
import { createReadStream } from 'fs';

test('zq.stream', async () => {
  const input = Stream.Readable.from('1 2 3', { encoding: 'utf-8' });
  const zq = createStream({ query: '{num: this}', f: 'zson' });
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

  expect(promise).rejects.toThrowError('error parsing Zed');
});

test('zq with a bad zed with file', async () => {
  const path = getPath('prs.json');
  const promise = zq({
    query: 'over this | isNull(*) | head 10',
    as: 'zjson',
    file: path,
  });

  expect(promise).rejects.toThrowError('error parsing Zed');
});

test('head 100 on guns ', async () => {
  const path = getPath('background_checks.csv');
  const data = await zq({
    query: '* | head 100',
    as: 'zjson',
    input: createReadStream(path),
  });
  expect(data).toHaveLength(100);
});
