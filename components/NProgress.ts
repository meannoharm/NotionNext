import NProgress from 'nprogress';

export function initNProgress() {
  NProgress.configure({ showSpinner: false });
}

export const progressStart = NProgress.start;
export const progressDone = NProgress.done;
