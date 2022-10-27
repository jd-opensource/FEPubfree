create table `group`
(
    id             int(11)      not null auto_increment comment '自增 id',
    name           varchar(128) not null comment '空间名称',
    description    varchar(255)          default null comment '空间描述说明',
    owner_id       int(11)      not null comment '空间拥有者 id',
    create_user_id int(11)      not null comment '空间创建者 id',
    is_del         tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at     datetime     not null default current_timestamp comment '记录创建时间',
    updated_at     datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '空间表';

create table `group_member`
(
    id         int(11)    not null auto_increment comment '自增id',
    group_id   int(11)    not null comment '空间 id',
    user_id    int(11)    not null comment '用户 id',
    role       int(8)     not null comment '角色',
    is_del     tinyint(2) not null default 0 comment '是否逻辑删除',
    created_at datetime   not null default current_timestamp comment '记录创建时间',
    updated_at datetime   not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_group_id (group_id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '空间成员表';

create table `project`
(
    id             int(11)      not null auto_increment comment '自增id',
    name           varchar(128) not null comment '项目英文名',
    zh_name        varchar(128) not null comment '项目中文名',
    description    varchar(255)          default null comment '项目描述',
    owner_id       int(11)      not null comment '项目拥有者id',
    group_id       int(11)               default null comment '项目关联的空间id',
    create_user_id int(11)      not null comment '创建人id',
    is_del         tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at     datetime     not null default current_timestamp comment '记录创建时间',
    updated_at     datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_name (name)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '项目基本信息表';

create table `project_domain`
(
    id             int(11)      not null auto_increment comment '自增 id',
    project_id     int(11)      not null comment '项目 id',
    project_env_id int(11)      not null comment '工作区 id',
    host           varchar(255) not null comment '目标域名',
    is_del         tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at     datetime     not null default current_timestamp comment '记录创建时间',
    updated_at     datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_project_id (project_id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '项目CNAME域名配置信息';

create table `project_env`
(
    id             int(11)      not null auto_increment comment '自增id',
    project_id     int(11)      not null comment '项目 id',
    name           varchar(128) not null comment '环境名称',
    env_type       tinyint(2)   not null comment '环境类型，test、beta、gray、prod',
    create_user_id int(11)      not null comment '创建者 id',
    is_del         tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at     datetime     not null default current_timestamp comment '记录创建时间',
    updated_at     datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_project_id (project_id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '项目环境表';

create table `project_env_deploy`
(
    id             int(11)      not null auto_increment comment '自增id',
    project_id     int(11)      not null comment '项目 id（冗余）',
    project_env_id int(11)      not null comment '环境',
    remark         varchar(255)          default null comment '备注',
    target_type    tinyint(2)   not null comment '地址类型',
    target         varchar(512) not null comment '目标地址',
    create_user_id int(11)      not null comment '创建者 id',
    action_user_id int(11)      not null comment '操作者 id',
    is_active      tinyint(2)            default 0 comment '是否生效',
    is_del         tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at     datetime     not null default current_timestamp comment '记录创建时间',
    updated_at     datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_project_id (project_id),
    index idx_project_env_id (project_env_id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '部署记录表';

create table `project_member`
(
    id         int(11)    not null auto_increment comment '自增 id',
    project_id int(11)    not null comment '项目 id',
    user_id    int(11)    not null comment '用户 id',
    role       tinyint(2) not null comment '角色',
    is_del     tinyint(2) not null default 0 comment '是否逻辑删除',
    created_at datetime   not null default current_timestamp comment '记录创建时间',
    updated_at datetime   not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_project_id (project_id),
    index idx_user_id (user_id)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '项目成员信息';

create table `user`
(
    id         int(11)      not null auto_increment comment '自增id',
    name       varchar(64)  not null comment '用户名',
    password   varchar(128) not null comment '密码',
    is_del     tinyint(2)   not null default 0 comment '是否逻辑删除',
    created_at datetime     not null default current_timestamp comment '记录创建时间',
    updated_at datetime     not null default current_timestamp on update current_timestamp comment '记录更新时间',
    primary key id (id),
    index idx_name (name)
) engine InnoDB
  default charset utf8mb4
  collate utf8mb4_unicode_ci comment '用户表';