const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'ngrok.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.android-arm64.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'ngrok.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.android-arm-eabi.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'ngrok.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'ngrok.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'ngrok.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'ngrok.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./ngrok.darwin-universal.node')
      } else {
        nativeBinding = require('@ngrok/ngrok-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'ngrok.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.darwin-x64.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'ngrok.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.darwin-arm64.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'ngrok.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./ngrok.freebsd-x64.node')
      } else {
        nativeBinding = require('@ngrok/ngrok-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'ngrok.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./ngrok.linux-x64-musl.node')
            } else {
              nativeBinding = require('@ngrok/ngrok-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'ngrok.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./ngrok.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@ngrok/ngrok-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'ngrok.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./ngrok.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@ngrok/ngrok-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'ngrok.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./ngrok.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@ngrok/ngrok-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'ngrok.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./ngrok.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@ngrok/ngrok-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { loggingCallback, NgrokSessionBuilder, NgrokSession, UpdateRequest, NgrokHttpTunnel, NgrokTcpTunnel, NgrokTlsTunnel, NgrokLabeledTunnel, NgrokHttpTunnelBuilder, NgrokTcpTunnelBuilder, NgrokTlsTunnelBuilder, NgrokLabeledTunnelBuilder } = nativeBinding

module.exports.loggingCallback = loggingCallback
module.exports.NgrokSessionBuilder = NgrokSessionBuilder
module.exports.NgrokSession = NgrokSession
module.exports.UpdateRequest = UpdateRequest
module.exports.NgrokHttpTunnel = NgrokHttpTunnel
module.exports.NgrokTcpTunnel = NgrokTcpTunnel
module.exports.NgrokTlsTunnel = NgrokTlsTunnel
module.exports.NgrokLabeledTunnel = NgrokLabeledTunnel
module.exports.NgrokHttpTunnelBuilder = NgrokHttpTunnelBuilder
module.exports.NgrokTcpTunnelBuilder = NgrokTcpTunnelBuilder
module.exports.NgrokTlsTunnelBuilder = NgrokTlsTunnelBuilder
module.exports.NgrokLabeledTunnelBuilder = NgrokLabeledTunnelBuilder
//
// javascript trailer
//

const net = require('net');
const fs = require('fs');
const os = require('os');

// wrap listen with the bind code for passing to net.Server.listen()
NgrokHttpTunnelBuilder.prototype._listen = NgrokHttpTunnelBuilder.prototype.listen;
NgrokTcpTunnelBuilder.prototype._listen = NgrokTcpTunnelBuilder.prototype.listen;
NgrokTlsTunnelBuilder.prototype._listen = NgrokTlsTunnelBuilder.prototype.listen;
NgrokLabeledTunnelBuilder.prototype._listen = NgrokLabeledTunnelBuilder.prototype.listen;

NgrokHttpTunnelBuilder.prototype.listen = ngrokBind;
NgrokTcpTunnelBuilder.prototype.listen = ngrokBind;
NgrokTlsTunnelBuilder.prototype.listen = ngrokBind;
NgrokLabeledTunnelBuilder.prototype.listen = ngrokBind;

// Begin listening for new connections on this tunnel,
// and bind to a local socket so this tunnel can be 
// passed into net.Server.listen().
async function ngrokBind(bind) {
  const tunnel = await this._listen();
  if (bind !== false) {
    const socket = await randomTcpSocket();
    defineTunnelHandle(tunnel, socket);
  }
  return tunnel;
}

// add a 'handle' getter to the tunnel so it can be
// passed into net.Server.listen().
function defineTunnelHandle(tunnel, socket) {
  // NodeJS net.Server asks passed-in object for 'handle',
  // Return the native TCP object so the pre-existing socket is used.
  Object.defineProperty( tunnel, 'handle', {
    get: function() {
      // turn on forwarding now that it has been requested
      tunnel.forwardTcp('localhost:' + socket.address().port);
      return socket._handle;
    }
  });
}

// generate a net.Server listening to a random port
async function randomTcpSocket() {
  return await asyncListen(new net.Server(), {host:'localhost', port:0});
}

// NodeJS has not promisified 'net': https://github.com/nodejs/node/issues/21482
function asyncListen(server, options) {
  return new Promise((resolve, reject) => {
    const socket = server.listen(options);
    socket.once('listening', () => {
      resolve(socket);
    })
    .once('error', (err) => {
      reject(err);
    });
  });
}

// Make a session using NGROK_AUTHTOKEN from the environment,
// and then return a listening HTTP tunnel.
async function defaultTunnel(bind) {
  // set up a default session and tunnel
  var builder = new NgrokSessionBuilder();
  builder.authtokenFromEnv();
  var session = await builder.connect();
  var tunnel = await session.httpEndpoint().listen(bind);
  tunnel.session = session; // surface to caller
  return tunnel;
}

// Get a listenable ngrok tunnel, suitable for passing to net.Server.listen().
async function listenable() {
  return await defaultTunnel();
}

// Bind a server to a ngrok tunnel, optionally passing in a pre-existing tunnel
async function ngrokListen(server, tunnel) {
  if (!tunnel) {
    // turn off automatic bind
    tunnel = await defaultTunnel(false);
  }

  // attempt pipe socket
  try {
    socket = await ngrokLinkPipe(tunnel, server);
  } catch (err) {
    console.debug("Using TCP socket. " + err);
    // fallback to tcp socket
    socket = await ngrokLinkTcp(tunnel, server);
  }
  registerCleanup(tunnel, socket);

  server.tunnel = tunnel; // surface to caller
  socket.tunnel = tunnel; // surface to caller
  // return the newly created net.Server, which will be different in the express case
  return socket;
}

async function ngrokLinkTcp(tunnel, server) {
  // random local port
  const socket = await asyncListen(server, {host:'localhost', port:0});
  // forward to socket
  tunnel.forwardTcp('localhost:' + socket.address().port);
  return socket;
}

async function ngrokLinkPipe(tunnel, server) {
  var proposed = "tun-" + tunnel.id() + ".sock";
  if (platform == 'win32') {
    proposed = '\\\\.\\pipe\\' + proposed;
  }
  var filename;
  try {
    fs.accessSync(process.cwd(), fs.constants.W_OK);
    filename = proposed;
  } catch (err) {
    console.debug("Cannot write to: " + process.cwd());
    // try tmp. allow any exception to propagate
    fs.accessSync(os.tmpdir(), fs.constants.W_OK);
    filename = os.tmpdir() + proposed;
  }

  if (!filename) {
    throw new Error("no writeable directory found");
  }

  // begin listening
  const socket = await asyncListen(server, {path: filename});
  // tighten permissions
  try {
    if (platform != 'win32') {
      fs.chmodSync(filename, fs.constants.S_IRWXU);
    }
  } catch (err) {
    console.debug("Cannot change permissions of file: " + filename);
  }
  // forward tunnel
  tunnel.forwardPipe(filename);
  socket.path = filename; // surface to caller

  return socket;
}

function registerCleanup(tunnel, socket) {
  process.on('SIGINT', function() {
    if (process.listenerCount('SIGINT') > 1) {
      // user has registered a handler, abort this one
      return;
    }
    // close tunnel
    if (tunnel) {
      tunnel.close().then(()=>{
        console.debug('ngrok closed tunnel: ' + tunnel.id());
      });
    }
    // close webserver's socket
    if (socket) {
      socket.close(function () {
        console.debug('ngrok closed socket');
      });
    }
    // unregister any logging callback
    loggingCallback();
  });
}

function consoleLog(level) {
  loggingCallback((level, target, message) => {
    console.log(`${level} ${target} - ${message}`);
  }, level);
}

module.exports.listenable = listenable;
module.exports.listen = ngrokListen;
module.exports.consoleLog = consoleLog;
