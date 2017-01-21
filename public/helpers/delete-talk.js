import { request } from '../skillsharing_client';
import { talkURL } from './talk-url';
import { reportError } from './report-error';

export const deleteTalk = (title) => {
  request({
    pathname: talkURL(title),
    method: 'DELETE',
  }, reportError);
};
