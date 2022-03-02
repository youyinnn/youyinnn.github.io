## Git

### Github Action

- [GitHub Actions: Concurrency](https://www.youtube.com/watch?v=PZ_A0QiLvz8)



### Git清除未跟踪文件

https://www.myfreax.com/how-to-remove-untracked-files-in-git/

```bash
git checkout . #本地所有修改的。没有的提交的，都返回到原来的状态
git stash #把所有没有提交的修改暂存到stash里面。可用git stash pop回复。

git reset --hard HASH #返回到某个节点，不保留修改，已有的改动会丢失。
git reset --soft HASH #返回到某个节点, 保留修改，已有的改动会保留，在未提交中，git status或git diff可看。

git clean -df #返回到某个节点，（未跟踪文件的删除）
git clean 参数
    -n 不实际删除，只是进行演练，展示将要进行的操作，有哪些文件将要被删除。（可先使用该命令参数，然后再决定是否执行）
    -f 删除文件
    -i 显示将要删除的文件
    -d 递归删除目录及文件（未跟踪的）
    -q 仅显示错误，成功删除的文件不显示


注：
git reset 删除的是已跟踪的文件，将已commit的回退。
git clean 删除的是未跟踪的文件
```



### Git 强制覆盖还原所有修改

``` bash
git pull 强制覆盖本地的代码方式，下面是正确的方法：

git fetch --all
然后，你有两个选择：

git reset --hard origin/master
或者如果你在其他分支上：

git reset --hard origin/<branch_name>

作者：吃货程序员
链接：https://www.jianshu.com/p/5fa5eae638cf
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

