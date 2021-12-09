## Electron

### Mac下的打包app无法执行命令行的问题

原因是：https://github.com/electron/electron/issues/7688#issuecomment-255339146

>  **[PinkyJie](https://github.com/PinkyJie)** commented [on 21 Oct 2016](https://github.com/electron/electron/issues/7688#issuecomment-255339146) 
>
> I found the reason finally, but I still didn't figure out how to fix it.
>
> The root cause is the environment variable of $PATH is wrong inside the packaged app. I run the command `process.env.PATH` on devtool, it shows `/usr/bin:/bin:/usr/sbin:/sbin`, which does not contain my `node/npm` path on my machine.
>
> So here comes the question: where does this `process.env.PATH` come from inside the packaged app? Is there a method to change it?

修复：https://github.com/sindresorhus/fix-path

