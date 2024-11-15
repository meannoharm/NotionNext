/**
 * 异步文件加载时的占位符
 * @returns
 */
const Loading = () => {
  return (
    <div
      id="loading-container"
      className="fixed left-0 top-0 -z-10 flex h-screen w-screen items-center justify-center"
    >
      <div id="loading-wrapper">
        <div className="loading">
          {' '}
          <i className="fas fa-spinner animate-spin text-3xl " />
        </div>
      </div>
    </div>
  );
};
export default Loading;
