---
title: Tess login on Jenkins
categories:
  - eBay
tags:
  - tess
date: 2018-11-16 14:10:08
---



### Tess login on Jenkins

#### Use tess with Rheos tess-base agent

Assume that you are at "Job Configure" panel now.

##### Configure Agent

In order to use tess **effectively and legally**, we should check **"Restrict where this project can be run"** on **"Job Notifications"** and select `tess-builder-numsg`, this is a image for tess-user that build from ***Rheos team***, it prepared every thing we need for tess.

The configuration of this agent is at Jenkins: **[Manage Jenkins(系统管理)] -> [Configure System(系统设置)]->[Cloud(云)]->[Kubernetes]->[images]** , named **"tess-builder-numsg"**

##### Configure "Parameterized Build(参数化构建过程)"

###### For production cluster login

We will need four parameters: `tess_username`,` tess_cluster`, `tess_pin`, `tess_yubikey_token_twice`

>  **Notice:** 
>
> 1. If your want to use two **YubiKey Token**, you have to configure a **Multi-line String Parameter**, to catch two **YubiKey Token** on a **single parameter(`tess_yubikey_token_twice`)**. It will prevent **"auto enter"** to trigger the build action while we use YubiKey to input access token.
> 2. From the usage above, the Jenkins parameter `tess_yubikey_token_twice` will separated to two parameters by line-separator.

###### For non-production cluster login

We can use `--password` option of tess to login tess to non-production cluster, so we just need three parameters: `tess_username`,` tess_cluster`, `corp_passord`

##### Configure Build Execute Shell

###### For production cluster

``` shell
# cd to the diractory where tess login script is
./tess-login.sh ${tess_username}  ${tess_cluster}  ${tess_pin} ${tess_yubikey_token_twice}
# your work with tess
```

###### For non-production cluster

``` shell
# cd to the diractory where tess login script is
./tess-login.sh ${tess_username} ${corp_password} ${tess_cluster}
# your work with tess
```

##### For production cluster

###### tess-login.sh

Reference: [tess-login.sh](https://github.corp.ebay.com/jiaweizhang/NuMessage/blob/promethuesAndGrafanaConfig/numsg-deploy/metrics-deploy/spec/prod/tess-login.sh)

``` shell
#!/bin/bash

# exit when error & trace
set -e
set -x

tess_username=$1
tess_cluster=$2
tess_pin=$3

# ${tess_yubikey_token_twice} will separated to $4 and $5 by line-separator
tess_yubikey_token_1=$4
tess_yubikey_token_2=$5

echo "token 1: $tess_yubikey_token_1"
echo "token 2: $tess_yubikey_token_2"

# combine $tess_pin and $tess_yubikey_token_1
expect tess-login-by-expect.sh $tess_username $tess_cluster $tess_pin$tess_yubikey_token_1 $tess_yubikey_token_2
```

###### tess-login-by-expect.sh

Reference: [tess-login-by-expect.sh](https://github.corp.ebay.com/jiaweizhang/NuMessage/blob/promethuesAndGrafanaConfig/numsg-deploy/metrics-deploy/spec/prod/tess-login-by-expect.sh)

You can also find it [below](2.-Prepare-expect-on-your-image).

##### For non-production cluster

###### tess-login.sh

Reference: [tess-login.sh](https://github.corp.ebay.com/jiaweizhang/NuMessage/blob/promethuesAndGrafanaConfig/numsg-deploy/metrics-deploy/spec/qa/tess-login.sh)

``` shell
#!/bin/bash

username=$1
corp_password=$2
server=$3

expect tess-login-by-expect.sh $server $username $corp_password
```

###### tess-login-by-expect.sh

Reference: [tess-login-by-expect.sh](https://github.corp.ebay.com/jiaweizhang/NuMessage/blob/promethuesAndGrafanaConfig/numsg-deploy/metrics-deploy/spec/qa/tess-login-by-expect.sh)

#### If you want to build our own agent for tess

Please make sure the agent environment contains the following two requirements for using tess **effectively and legally**.

##### 1. Prepare the appropriate version of Tess client on your image

To log in to the tess, you should at least use the version `release-0.29.x`, and I **strongly recommend** you should always use the **latest release version of tess**. From now it's `release-0.33.5`.

here are the details: 

> **Logging in to Production cluster is not the same as logging in to Non-Production Cluster**
>
> If we want to log in the production cluster like **21/22/23**, there are two verification:
>
> 1. **eBay Account verification:** check that you have a valid account.
> 2. **Production Cluster Access permission verification:** check that you have the permission to access the production cluster
>
> each verification require an **YubiKey Token**, though it's the way they did after version `release-0.29.x`, before this version, the old version of tess client use just one **YubiKey Token**, so it's invalid for access the production cluster at present.

###### How to upgrade tess client

Perhaps we can't download the latest version of tess client on the http://tess.io, we can still upgrade the latest version by tess client itself !

``` bash
$ tess version list
```

then you can get the latest version's number, and **don't use `crul`or`wget`to download the tess client, the url that provide is unreachable on linux system.**

``` bash
$ tess install release-0.33.5
```

and your should add tess to `$PATH ` for good.

##### 2. Prepare `expect` on your image

We are trying to use shell script to handle all of our work on Jenkins. Perhaps there are some **interactive** client and they might blocked our building process and waiting user to input some command, such as tess login process:

``` bash
$ tess login -c 21 --username=numessage
Username: numessage
****** Current Cluster Context 21 ******
Cluster Name: 21
Cluster URL: https://api.system.svc.21.tess.io
** You can use '--cluster' switch to a different cluster
** You can use 'tess clusters' to list all available Tess clusters.
** You can use 'tess version list' to list all available tess client versions.
Pin + YubiKeyToken: 
```

there is not options on tess client  to let us passing the parameter of `Pin + YubiKeyToken` ask interaction, besides, it require the second `YubiKey Token`. 

To handle this situation, we can use `expect` to passing the parameter by just wrapping the interactive shell on a script named `tess-login-by-expect.sh`:

 ``` bash
#!/usr/bin/expect
  
set username [lindex $argv 0]
set cluster [lindex $argv 1]
set pin_token1 [lindex $argv 2]
set token2 [lindex $argv 3]

spawn tess login -c $cluster --username=$username

expect {
    "Pin + YubiKeyToken:" {
        send "$pin_token1\n"
        exp_continue
    }
    "YubiKeyToken:" {
        send "$token2\n"
        exp_continue
    }
    "successfully authenticated" {
        send eof
    }
}
expect eof
 ```

it will expect two interaction then send our token automatically and expect tess client return "successfully authenticated".

Then you could run it on your shell script:

``` bash
expect tess-login-by-expect.sh $tess_username $tess_cluster $tess_pin$tess_yubikey_token_1 $tess_yubikey_token_2
```

#### Installation

Need install `tcl` and `expect`

e.g on CentOS:

``` bash
$ sudo yum install -y tcl expect
```