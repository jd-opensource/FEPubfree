import { isNil } from "lodash";
import * as LRUCache from "lru-cache";
import { reqHostname } from "../util/req-hostname";

export enum EHostType {
  Unknown = 0,
  Default = 1,
  Preview = 2,
  Domain = 3,
}

export interface IHostCacheValue {
  hostType: EHostType;
  deployId?: string;
  projectName?: string;
  envName?: string;
}

/**
 * > 项目访问过程中，具体指向哪个项目是通过域名来区分，因此到达 Client 的请求必须携带域名，针对 ip 请求的情况，则会因解析失败而返回 404 页面。
 *
 * # 假设 pubfree 域名后缀是 *.pubfree.jd.com
 *
 * # 资源访问模式
 *
 * ## 一、正常模式
 *
 * 正常模式下只要项目与环境名称确定，即可映射到对应环境下生效的版本。
 *
 * 我们将正常模式的域名规则定为 {project_name}.{env_name}.pubfree.jd.com
 *
 * 1. 此处 `project_name` 即 `project` 表中的 `name` 字段
 * 2. 此处的 `env_name` 即 `project_env` 表中 `name` 字段
 *
 * ## 二、预览模式
 *
 * 预览模式是指，某个环境的部署还未上线，但是想提前看下内容是否与预期一致，对于预览模式，预览模式与项目无关、与环境无关，
 * 只与所预览的部署版本相关，因此核心字段为 `project_env_deploy` 表中 `id` 字段，我们标识为 `deploy_id`。
 *
 * 我们将预览模式的域名规则定为 {deploy_id}.{project_name}.{env_name}.pubfree.jd.com
 *
 * # SSL 证书问题
 *
 * 针对需要对域名需要添加 SSL 证书的场景，可以发现没有适合的证书能够涵盖上面所有的场景。`泛域名证书`、`通配符多域名证书` ，
 * 都仅支持添加一个泛域名，例如 `*.pubfree.jd.com`，然而我们的场景却是 `*.*.pubfree.jd.com`，甚至是 `*.*.*.pubfree.jd.com`。
 *
 * 以下是在仅购买一个证书的情况下，且让所有的访问都支持 https 的一个解决思路。
 *
 * 我们先调整域名规则，将所有泛域名地方统一成一个，即 `*.pubfree.jd.com`，利用 `-` 来做 `deploy_id`、`project_name`、`env_name` 的区分，
 * 为避免 `project_name` 与 `env_name` 的混淆，得限制 `env_name` 命名时使用中划线 `-`。
 *
 * 1. 正常模式下，域名格式变为 `${project_name}-${env_name}.pubfree.jd.com`，利用正则来进行字段提取
 * 2. 预览模式下，域名格式变为 `${deploy_id}-${project_name}-${env_name}.pubfree.jd.com`，同样利用正则来进行字段提取
 *
 * 综合以上情况，我们便能得到我们想要的 `deploy_id`、`project_name`、`env_name` 信息。
 */
export class HostCache {
  private static instance: HostCache = null;
  cache: LRUCache<string, IHostCacheValue> = null;

  private readonly projectReg = "([-a-zA-Z0-9]{0,62})";
  private readonly envReg = "([a-zA-Z0-9]{0,62})";
  private readonly deployIdReg = "([0-9]{0,62})";
  private readonly domainSuffix: string = ".pubfree.jd.com";
  private readonly domainSplitChar: string = ".";

  private readonly HostNormalRegex: RegExp;
  private readonly HostPreviewRegex: RegExp;

  constructor(options?: { suffix: string; splitChar: string }) {
    this.cache = new LRUCache<string, IHostCacheValue>({
      // count
      max: 1000,
      // ms
      maxAge: 60 * 1000,
      updateAgeOnGet: true,
    });
    if (!isNil(options?.suffix)) {
      this.domainSuffix = options.suffix;
    }
    if (!isNil(options?.splitChar)) {
      this.domainSplitChar = options.splitChar;
    }
    this.HostNormalRegex = new RegExp(`^${this.projectReg}${this.domainSplitChar}${this.envReg}${this.domainSuffix}$`);
    this.HostPreviewRegex = new RegExp(
      `^${this.deployIdReg}${this.domainSplitChar}${this.projectReg}${this.domainSplitChar}${this.envReg}${this.domainSuffix}$`
    );
  }

  public static getInstance(options?: { suffix: string; splitChar: string }) {
    if (isNil(HostCache.instance)) {
      HostCache.instance = new HostCache(options);
    }
    return HostCache.instance;
  }

  public test(host: string): IHostCacheValue {
    const hostname = reqHostname(host);

    let value: IHostCacheValue = null;

    if (this.cache.has(hostname)) {
      return this.cache.get(hostname);
    }

    if (this.HostNormalRegex.test(hostname)) {
      const matchArray = hostname.match(this.HostNormalRegex);
      value = {
        hostType: EHostType.Default,
        projectName: matchArray[1],
        envName: matchArray[2],
      };
    } else if (this.HostPreviewRegex.test(hostname)) {
      const matchArray = hostname.match(this.HostPreviewRegex);
      value = {
        hostType: EHostType.Preview,
        deployId: matchArray[1],
        projectName: matchArray[2],
        envName: matchArray[3],
      };
    } else {
      value = {
        hostType: EHostType.Domain,
      };
    }

    this.cache.set(hostname, value);
    return value;
  }
}
