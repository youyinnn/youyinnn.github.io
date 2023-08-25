## CloudPlatform

### GCP

#### 挂载磁盘

https://xrp001.github.io/tutorial/2020/05/27/gcp-mount-disk/

#### SSH 连接

1. 首先用 GCP 的 SSH 登陆一下看用户名是什么

2. 然后在本地

   ```bash
   ssh-keygen -t rsa -f ~/.ssh/ins6 -C [user_name_on_gcp_instance]
   ```

3. 然后复制公钥到实例的设置里

   ![image-20220302161152601](../../../img/image-20220302161152601.png)

4. 然后再修改虚拟机上的`/etc/ssh/sshd_config`:

   ```ini
   # 找到这俩
   PermitRootLogin yes
   PubkeyAuthentication yes

   # 还有
   AuthorizedKeysFile	.ssh/authorized_keys
   ```

5. 然后再在这个用户名下的`.ssh/authorized_keys`里把公钥的内容复制过去

6. 然后重启 sshd 服务

   ```bash
   sudo service sshd restart
   ```
