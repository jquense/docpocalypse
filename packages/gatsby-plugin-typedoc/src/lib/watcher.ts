import chokidar from 'chokidar';
import debounce from 'lodash/debounce';

export default function watchFiles(
  files: string | readonly string[],
  cb: () => void,
) {
  const watcher = chokidar.watch(files);
  const updater = debounce(cb, 100);

  watcher
    .on('add', updater)
    .on('change', updater)
    .on('unlink', updater);
}
