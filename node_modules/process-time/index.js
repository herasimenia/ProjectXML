const processUpTime = () => {

  const seconds = process.uptime();
  if (seconds < 60)
    return seconds.toFixed(2) + 's';

  if (seconds < (60 * 60))
    return parseInt(seconds / 60) + ':' + parseInt(seconds % 60) + 'm';

  return parseInt((seconds / 60) / 60) + ':' + parseInt((seconds % (60 * 60)) / 60) + 'h';
};

process.on('exit', () => {
  console.log('\u001b[33m Process exited. Took: ' + processUpTime() + '\u001b[0m\n');
});
