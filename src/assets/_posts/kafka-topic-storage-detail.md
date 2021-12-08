---
title: kafka-topic-storage-detail
categories:
  - kafka
  - notes
tags:
  - kafka
date: 2018-11-06 16:34:00
---

### Topic & Partition

kafka中的Message以topic为分类去组织的，每个topic又可以分为不同的partition去存储：

![img](http://kafka.apache.org/20/images/log_anatomy.png)

我们引用官方的Introduction中的一节，看官方是怎么解释的：

Each partition is an ordered, immutable sequence of records that is continually appended to—a structured commit log. The records in the partitions are each assigned a sequential id number called the *offset* that uniquely identifies each record within the partition.

每个分区都是一个**有序的，不可变的记录序列**，不断附加到结构化的提交日志中。分区中的记录每个都分配了一个称为偏移的顺序ID号，它唯一地标识分区中的每个记录。

The Kafka cluster durably persists all published records—whether or not they have been consumed—using a configurable retention period. For example, if the retention policy is set to two days, then for the two days after a record is published, it is available for consumption, after which it will be discarded to free up space. Kafka's performance is effectively constant with respect to data size so storing data for a long time is not a problem.

Kafka集群使用**可配置的保留期（configurable retention period）**，来持久保存所有已发布的记录，无论是否已**消费（consume）**。

例如，如果保留策略设置为两天，则在发布记录后的两天内，它都是可供消费（consume）的，之后将被**丢弃（discarded）**以释放空间。Kafka的性能在数据大小方面实际上是恒定的，因此长时间存储数据不是问题。

In fact, the only metadata retained on a per-consumer basis is the offset or position of that consumer in the log. This offset is controlled by the consumer: normally a consumer will advance its offset linearly as it reads records, but, in fact, since the position is controlled by the consumer it can consume records in any order it likes. For example a consumer can reset to an older offset to reprocess data from the past or skip ahead to the most recent record and start consuming from "now".

实际上，基于每个消费者保留的唯一元数据是该消费者在日志中的**偏移或位置（offset/position）**。

这种偏移由消费者控制：通常消费者在读取记录时会线性地提高其偏移量，但事实上，由于该位置由消费者控制，因此它可以按照自己喜欢的任何顺序消费记录。

例如，消费者可以重置为较旧的偏移量来重新处理过去的数据，或者跳到最近的记录并从“现在”开始消费。

This combination of features means that Kafka consumers are very cheap—they can come and go without much impact on the cluster or on other consumers. For example, you can use our command line tools to "tail" the contents of any topic without changing what is consumed by any existing consumers.

这些功能组合意味着Kafka消费者是**“成本较低的”**：他们可以来来往往对集群或其他消费者没有太大影响。

例如，您可以使用我们的命令行工具“tail”任何主题的内容，而无需更改任何现有使用者所消耗的内容。

The partitions in the log serve several purposes. First, they allow the log to scale beyond a size that will fit on a single server. Each individual partition must fit on the servers that host it, but a topic may have many partitions so it can handle an arbitrary amount of data. Second they act as the unit of parallelism—more on that in a bit.

日志中的分区有多种用途：

首先，它们允许日志扩展到超出适合单个服务器的大小。每个单独的分区必须适合托管它的服务器，但主题可能有许多分区，因此它可以处理任意数量的数据。

其次，它们充当了并行性的单位，更多是因为这个原因！

### Partition

上面从大方向上介绍了Message的存储是如何work的，我们再来关注一下存储的细节

Partition中的每条Message由offset来表示它在这个partition中的偏移量，这个offset不是该Message在partition数据文件中的实际存储位置，而是逻辑上一个值，它唯一确定了partition中的一条Message。因此，可以认为offset是partition中Message的id。partition中的每条Message包含了以下三个属性：

- offset

- MessageSize

- data

其中offset为long型，MessageSize为int32，表示data有多大，data为message的具体内容。它的格式和Kafka通讯协议中介绍的MessageSet格式是一致。

Partition的数据文件则包含了若干条上述格式的Message，按offset由小到大排列在一起。它的实现类为FileMessageSet，类图如下：

![FileMessageSet](https://image.youyinnn.top/20181107151441.png)

它的主要方法如下：

- append: 把给定的ByteBufferMessageSet中的Message写入到这个数据文件中。
- searchFor: 从指定的startingPosition开始搜索找到第一个Message其offset是大于或者等于指定的offset，并返回其在文件中的位置Position。它的实现方式是从startingPosition开始读取12个字节，分别是当前MessageSet的offset和size。如果当前offset小于指定的offset，那么将position向后移动LogOverHead+MessageSize（其中LogOverHead为offset+messagesize，为12个字节）。
- read：准确名字应该是slice，它截取其中一部分返回一个新的FileMessageSet。它不保证截取的位置数据的完整性。
- sizeInBytes: 表示这个FileMessageSet占有了多少字节的空间。
- truncateTo: 把这个文件截断，这个方法不保证截断位置的Message的完整性。
- readInto: 从指定的相对位置开始把文件的内容读取到对应的ByteBuffer中。


我们来思考一下，如果一个partition只有一个数据文件会怎么样？

> - 新数据是添加在文件末尾（调用FileMessageSet的append方法），不论文件数据文件有多大，这个操作永远都是O(1)的。
>
> - 查找某个offset的Message（调用FileMessageSet的searchFor方法）是顺序查找的。因此，如果数据文件很大的话，查找的效率就低。

那Kafka是如何解决查找效率的的问题呢？有两大法宝：1) 分段 2) 索引。

#### 数据文件的分段
Kafka解决查询效率的手段之一是将数据文件分段，比如有100条Message，它们的offset是从0到99。

假设将数据文件分成5段，第一段为0-19，第二段为20-39，以此类推，每段放在一个单独的数据文件里面，数据文件以该段中最小的offset命名。这样在查找指定offset的Message的时候，用二分查找就可以定位到该Message在哪个段中。

#### 为数据文件建索引
数据文件分段使得可以在一个较小的数据文件中查找对应offset的Message了，但是这依然需要顺序扫描才能找到对应offset的Message。

为了进一步提高查找的效率，Kafka为每个分段后的数据文件建立了索引文件，文件名与数据文件的名字是一样的，只是文件扩展名为.index。

索引文件中包含若干个索引条目，每个条目表示数据文件中一条Message的索引。索引包含两个部分（均为4个字节的数字），分别为相对offset和position。

相对offset：因为数据文件分段以后，每个数据文件的起始offset不为0，相对offset表示这条Message相对于其所属数据文件中最小的offset的大小。

举例，分段后的一个数据文件的offset是从20开始，那么offset为25的Message在index文件中的相对offset就是25-20 = 5。存储相对offset可以减小索引文件占用的空间。

position，表示该条Message在数据文件中的绝对位置。只要打开文件并移动文件指针到这个position就可以读取对应的Message了。

index文件中并没有为数据文件中的每条Message建立索引，而是采用了稀疏存储的方式，每隔一定字节的数据建立一条索引。这样避免了索引文件占用过多的空间，从而可以将索引文件保留在内存中。但缺点是没有建立索引的Message也不能一次定位到其在数据文件的位置，从而需要做一次顺序扫描，但是这次顺序扫描的范围就很小了。

在Kafka中，索引文件的实现类为OffsetIndex，它的类图如下：

![offsetindex](https://image.youyinnn.top/20181107151802.png)

主要的方法有：

- append方法，添加一对offset和position到index文件中，这里的offset将会被转成相对的offset。
- lookup, 用二分查找的方式去查找小于或等于给定offset的最大的那个offset

### 小结

我们以几张图来总结一下Message是如何在Kafka中存储的，以及如何查找指定offset的Message的。

Message是按照topic来组织，每个topic可以分成多个的partition，比如：有5个partition的名为为page_visits的topic的目录结构为：

![topic_partition](https://image.youyinnn.top/20181107151829.png)

partition是分段的，每个段叫LogSegment，包括了一个数据文件和一个索引文件，下图是某个partition目录下的文件：

![LogSegment](https://image.youyinnn.top/20181107151557.png)

可以看到，这个partition有4个LogSegment。

借用博主[@lizhitao](http://blog.csdn.net/lizhitao/)博客上的一张图来展示是如何查找Message的。

![search](https://image.youyinnn.top/20181107151736.png)

比如要查找绝对offset为7的Message：

首先是用二分查找确定它是在哪个LogSegment中，自然是在第一个Segment中。
打开这个Segment的index文件，也是用二分查找找到offset小于或者等于指定offset的索引条目中最大的那个offset。自然offset为6的那个索引是我们要找的，通过索引文件我们知道offset为6的Message在数据文件中的位置为9807。
打开数据文件，从位置为9807的那个地方开始顺序扫描直到找到offset为7的那条Message。

**这套机制是建立在offset是有序的**。索引文件被映射到内存中，所以查找的速度还是很快的。

一句话，**Kafka的Message存储采用了分区(partition)，分段(LogSegment)和稀疏索引这几个手段来达到了高效性。**

> 参考自：
>
> http://kafka.apache.org/intro
>
> https://blog.csdn.net/jewes/article/details/42970799

