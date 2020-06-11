## :star: MySQL

### MySQL用户管理

``` sql
// 查看所有用户
use mysql;
select * from user;

// 查看用户权限
how grants;
show grants for root;

// 授予用户权限
grant select on base.table to hi;
grant all on base.* to 'hi'@'localhost';
// 移除用户权限
revoke select on base.table from hi;
// 刷新权限
flush privileges;

// 创建用户
create user hi identified by 'passowrd';
// 删除用户
drop user hi;

// 改密码
set password for hi = Password('new password');
// 改自己密码
set password = Password('new password');
```

https://www.cnblogs.com/gavin110-lgy/p/5773981.html
https://www.cnblogs.com/clsn/p/8047028.html



### MySQL自己更新自己


https://www.cnblogs.com/jeffen/p/7016547.html

mysql不允许在同一次执行中自己更新自己 所以要套一次层中间查询 欺骗mysql以为不是同一张表



### MySQL系统体系架构

![](https://image.youyinnn.top/20200611194657.png)

根据图里我们可以发现，MySQL系统最核心的“存储引擎”是以插件的形式为系统提供服务的，这种架构提供了与存储引擎实现无关的一系列标准服务支持，让引擎的实现能够解放出来。

**需要注意的是，存储引擎是基于表的，而不是数据库**

### MySQL各引擎介绍

#### InnoDB

MySQL5.5.8以后的默认引擎，支持事物、行锁设计、外键、全文索引、非锁定读（默认读操作不会产生锁）

使用多版本并发控制（MVCC）来支持高并发性，并实现了4中标准的隔离级别，能避免幻读；还提供了许多其他的特性来支持高性能高并发；每张表按照主键顺序进行存放；

#### MyISAM

不支持事物、表锁设计，支持全文索引；

缓冲池不缓存数据，只缓存索引；

#### NDB

集群存储引擎，特点是数据都放在内存中，而非索引数据存在磁盘上，因此性能很快，但是连接操作时性能很差，因为该操作是在数据库完成的，而不是又引擎完成的；

#### Memory

数据都在内存中，数据库如果重启或者崩溃就会丢失所有数据，适合用于存储临时数据；默认使用哈希索引，而不是B+树索引；

但是只支持表锁，所以并发性能差，不支持全部数据类型；

#### Archive

只支持Insert和Select操作，特点是会对数据进行压缩，压缩比高，适合存储归档数据、日志信息等；

虽然支持行锁，但是不支持事物；