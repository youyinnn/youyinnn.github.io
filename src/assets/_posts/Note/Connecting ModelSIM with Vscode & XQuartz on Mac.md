---
title: Connecting ModelSIM with Vscode & XQuartz on Mac
tags:
  - nottag
date: 2021-10-5 19:22:5
---

### XQuartz setup

https://www.xquartz.org/

Download & Install

Then you will see this in the ssh config file located at `/private/etc/ssh/ssh_config`:

```
....

# XAuthLocation added by XQuartz (https://www.xquartz.org)
Host *
    XAuthLocation /opt/X11/bin/xauth
```

### VS Code

With the power of [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh), you can add a ssh connection like:

```
Host login.encs.concordia.ca
  HostName login.encs.concordia.ca
  ForwardX11Trusted yes
  User hu_ju
```

And also [Modern VHDL](https://marketplace.visualstudio.com/items?itemName=rjyoung.vscode-modern-vhdl-support) for vhdl support.

### Troubshoot

#### Establish Error

When this shows on the output of `Remote SSH`

```bash
...

[16:44:34.541] Platform: linux
[16:44:34.549] stderr> bash: line 1: syntax error near unexpected token fi
[16:44:34.550] stderr> bash: line 1: fi
[16:44:34.552] > 6b09ed1419cf: running
[16:44:34.553] stderr> function: Command not found.
[16:44:34.553] stderr> Bad : modifier in $ (-).
[16:44:34.553] stderr> fi: Command not found.
[16:44:34.553] stderr> found_glibc: Undefined variable.
[16:44:34.554] stderr> Unmatched ".
[16:44:34.556] stderr> SERVER_PID: Undefined variable.
[16:44:34.558] stderr> =: Command not found.
```

Fix this with:

https://github.com/microsoft/vscode-remote-release/issues/5543

by adding a setting on vscode settings file:

```json
{
  "remote.SSH.useLocalServer": false
}
```

And then select Linux when first connection

#### Can not open ModelSIM UI with vscode

Fefering: https://unix.stackexchange.com/a/12772/495761

Fix it by enable `ForwardX11 yes` in ssh_config:

```
# XAuthLocation added by XQuartz (https://www.xquartz.org)
Host *
    XAuthLocation /opt/X11/bin/xauth
    ForwardX11 yes
```
