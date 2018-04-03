/* eslint-env jest, browser */

// mocking
jest.mock('request');
jest.mock('feedparser');
import requestMock from 'request';
import fpMock from 'feedparser';

import { crawlFeed } from '../job'

describe('crawlFeed', () => {
  beforeEach(() => {
    fpMock.mockClear();
  });

  it('assert request calls', () => {
    const req = { on: jest.fn() };
    req.on.mockReturnValue(req);
    requestMock.mockReturnValue(req);

    const url = `some.url/${Math.random()}`;
    crawlFeed(url);

    expect(requestMock).toHaveBeenCalledTimes(1);
    expect(requestMock).toHaveBeenCalledWith(url);

    expect(req.on.mock.calls).toMatchSnapshot();
  });

  it('assert error handler', () => {
    const req = { on: jest.fn() };
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);

    const callback = jest.fn();
    const url = `some.url/${Math.random()}`;
    crawlFeed(url, callback);

    const forcedError = new Error('forcing');
    const handler = req.on.mock.calls.filter(call => call[0] === 'error')[0][1];
    handler(forcedError);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(forcedError);
  });

  it('assert response handler', () => {
    const fp = { on: jest.fn() };
    const req = { on: jest.fn(), pipe: jest.fn() };
    fp.on.mockReturnThis();
    req.on.mockReturnThis();
    requestMock.mockReturnValue(req);
    fpMock.mockImplementation(() => fp);

    const callback = jest.fn();
    const url = `some.url/${Math.random()}`;
    crawlFeed(url, callback);

    const handler = req.on.mock.calls.filter(call => call[0] === 'response')[0][1];
    handler.bind(req)();

    expect(req.pipe).toHaveBeenCalledTimes(1);
    expect(req.pipe).toHaveBeenCalledWith(fp);

    expect(fp.on.mock.calls).toMatchSnapshot();
  });
});
