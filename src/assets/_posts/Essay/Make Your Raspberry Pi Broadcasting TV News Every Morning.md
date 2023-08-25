---
title: Make Your Raspberry Pi Broadcasting TV News Every Morning
tags:
  - raspberry pi
date: 2020-4-23 22:46:59
---

### Preface

I can't get up early recently, and yesterday I suddenly thought about why can't I use my idle raspberry pi to broadcast TV news every 7:00 a.m and wake me up?

And how am I going to achieve that? There are some factors I should count in:

- a cron to set timing task at 7:00 a.m;
- tools to control the mouse action;
- tools to control the volume and the screen's display (save battery)

### Make the pi connecting to the world

There's a lot of choices for using SSR on Linux os, check [here](https://github.com/shadowsocks), but many of them were banned and deleted their documents.

Luckily, there still some tutorials showing how to implement it on Linux. [reference1](https://medium.com/@molimowang/raspberry-pi-shadowsocks-polipo%E5%AE%9E%E7%8E%B0%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91-eae1b7eeb779),[reference2](https://my.oschina.net/u/1432769/blog/619651?nocache=1527132335477)

#### Installation

Require python >2.7

```bash
sudo apt-get install python-pip python-m2crypto
sudo pip install shadowsocks
```

#### Config File

Create a json file somewhere, which is used for both ssserver(server) and sslocal(client):

```json
{
  "server": "my_server_ip",
  "server_port": 8388,
  "local_address": "127.0.0.1",
  "local_port": 1080,
  "password": "mypassword",
  "timeout": 300,
  "method": "aes-256-cfb",
  "fast_open": false,
  "workers": 1
}
```

1. server: server listening address, set `0.0.0.0` **if your are using your machine as ssserver**
2. server_port: server listening port, should avoided existing port **if your are using your machine as ssserver**
3. local_address: local listening address, should be `127.0.0.1`
4. local_port: local listening port, should avoided existing port
5. password: your **ss password**
6. timeout: connection timeout, second unit
7. method: crypto method, by default is: `aes-256-cfb`, [more info here](https://github.com/clowwindy/shadowsocks/wiki/Encryption)
8. workers: process number

#### Startup ss server

```bash
ssserver -c /etc/shadowsocks.json
```

#### Startup ss client

```bash
sslocal -c /etc/shadowsocks.json
```

#### Openssl Problem

For some update reason, you might get this `error log` while using the commands above:

```bash
Traceback (most recent call last):
File "/usr/local/bin/sslocal", line 9, in
load_entry_point('shadowsocks==2.8.2', 'console_scripts', 'sslocal')()
....
....
....
AttributeError: /usr/local/lib/libcrypto.so.1.1: undefined symbol: EVP_CIPHER_CTX_cleanup
```

This is because:

> **EVP_CIPHER_CTX** was made opaque in OpenSSL 1.1.0. As a result, EVP_CIPHER_CTX_reset() appeared and EVP_CIPHER_CTX_cleanup() disappeared. EVP_CIPHER_CTX_init() remains as an alias for EVP_CIPHER_CTX_reset()

Reference: [here](<[https://floperry.github.io/2019/02/24/2018-06-25-Ubuntu-18.04-%E4%B8%8B%E8%A7%A3%E5%86%B3-shadowsocks-%E6%9C%8D%E5%8A%A1%E6%8A%A5%E9%94%99%E9%97%AE%E9%A2%98/](https://floperry.github.io/2019/02/24/2018-06-25-Ubuntu-18.04-下解决-shadowsocks-服务报错问题/)>)

Find `/site-packages/shadowsocks/crypto/openssl.py` according to your `error log` and edit it: change all `EVP_CIPHER_CTX_cleanup()` into `EVP_CIPHER_CTX_reset()`, there are two places needed to handle.

#### Proxy

Since ss client is using SOCKS5 protocol, we can't use it directly or easily in Linux os as Windows os does, so we have to proxy turn the protocol into HTTP.

##### Polipo

For quick-start, we can use [Polipo](https://wiki.archlinux.org/index.php/Polipo) to achieve that, but it is no longer maintain.

Polipo is a small and fast caching web proxy (a web cache, an HTTP proxy, a proxy server). While Polipo was designed to be used by one person or a small group of people, there is nothing that prevents it from being used by a larger group.

- Installation

  ```bash
  sudo apt-get install polipo
  ```

- config file：

  ```bash
  sudo nano /etc/polipo/config
  ```

  ```bash
  # This file only needs to list configuration variables that deviate
  # from the default values. See /usr/share/doc/polipo/examples/config.sample
  # and "polipo -v" for variables you can tweak and further information.

  logSyslog = falselogFile = /var/log/polipo/polipo.log
  socksParentProxy = "127.0.0.1:1080"
  socksProxyType = socks5
  chunkHighMark = 50331648
  objectHighMark = 16384
  serverMaxSlots = 64
  serverSlots = 16
  serverSlots1 = 32
  proxyAddress = "0.0.0.0"
  proxyPort = 8123
  ```

- restart Polipo：

  ```bash
  /etc/init.d/polipo restart
  ```

- set global http proxy for terminal：

  ```bash
  export http_proxy=”127.0.0.1:8123”
  ```

  for undo it ：

  ```bash
  unset http_proxy
  ```

- check if proxy is success:

  ```bash
  curl google.com
  ```

  there will be a response if success.

##### Privoxy

For stable proxy, please use [Privoxy](https://wiki.archlinux.org/index.php/Privoxy)

[Privoxy](http://www.privoxy.org/) is a filtering proxy for the HTTP protocol, frequently used in combination with [Tor](https://wiki.archlinux.org/index.php/Tor). Privoxy is a web proxy with advanced filtering capabilities for protecting privacy, filtering web page content, managing cookies, controlling access, and removing ads, banners, pop-ups, etc. It supports both stand-alone systems and multi-user networks.

[A tutorials](https://www.cnblogs.com/hongdada/p/10787924.html)

#### Chromium with SwitchyOmega

[Download](https://github.com/FelisCatus/SwitchyOmega/releases) and [extract it](https://stackoverflow.com/questions/23091526/apps-extensions-and-scripts-cannot-be-added-from-this-website), open `developer mode` on `chrome://extensions` and "Load unpacked".

New profile and then:

**Proxy servers**

| Scheme    | Protocol | Server    | Port |
| --------- | -------- | --------- | ---- |
| (default) | SOCKS5 ▼ | 127.0.0.1 | 1080 |

### Implement

As I said before, this task should set as a timing task for displaying tv news every 7:00 a.m.

So firstly, we prepare a script to:

1. open [CGTN TV](https://www.cgtn.com/tv) the chromium with command line
2. mute/unmute the system volume
3. zoom in the video

#### Step 1: tv.sh

```shell
#!/bin/bash
if [ $1 == open ]
then
	amixer set PCM 0%
	chromium-browser https://www.cgtn.com/tv
fi
if [ $1 == play ]
then
	amixer set PCM 100%
	python mouse.py
fi
```

Open `bash /../tv.sh open` and play `bash /../tv.sh play`

#### Step 2: mouse.py

Use python code to control the mouse move and click to click the fullscreen button:

```bash
sudo pip install PyUserInput
```

```python
from pymouse import PyMouse
m = PyMouse()
x,y = 970, 575
m.move(x,y)
m.click(x,y)
```

#### Step 3: cron

```bash
DISPLAY=:0
58 6 * * * bash /home/pi/tv.sh open
00 7 * * * bash /home/pi/tv.sh play
```

Set crontab by using `crontab -e` command, and choose your editor for editing crontab config file, then you can use `crontab -l` to display the config file.

Then restart the cron service `/etc/init.d/cron restart`.

A GUI Package for crontab is recommended: [crontab-gui](https://github.com/alseambusher/crontab-ui)

Please notice that we set env value of `DISPLAY` at line 1 is because if we want to open and gui app with crontab.

#### More

At first, I want to choose BBC News or other foreign News Live websites, but then I realized the quality of the Live stream totally depend on the stability of my SSR source, so I quit using foreign sources and find CGTN.

Now everything are settled, enjoy your morning.
