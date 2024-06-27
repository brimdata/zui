export function getHost(hostUrl: string, defaultPort = '9867') {
  const parts = hostUrl.split(':');
  const host = parts[0];
  let port = parts[1];
  port = port ? port : defaultPort;
  return host + ':' + port;
}
