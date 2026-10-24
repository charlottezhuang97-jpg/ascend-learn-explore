# MindIE AI 学伴 · 步骤 1–7 完整内容稿

适用：1030 学习详情页 IDE 视角。依据 2026-10-22 已确认的工作流评审及用户后续指定的 HiDevLab 环境获取方案。

## 横向步骤树

1 环境准备 → 2 下载模型权重 → 3 获取 MindIE 镜像 → 4 启动容器 → 5 模型推理配置 → 6 启动 MindIE 服务 → 7 推理交互。

顶部采用浅蓝描边、圆角、按宽度换行的横向标签；当前查看步骤高亮。点击只定位内容，不执行、不授权、不把浏览算作完成。

## 共用规则

- 7 个主步骤、28 个产品子任务，包含新增的 3 个 HiDevLab 子任务。
- 目标说明 → 用户选择 → 明确授权 → 用户回复气泡 → 命令或操作预览 → 终端记录与结果卡 → 检查通过后收起 → 用户继续下一步。
- 所有申请、创建、开机、命令与回显均为交互演示；没有连接 HiDevLab、真实主机、执行器、调试器或实时 AI。
- 本文中的命令和路径是手册教学示例，不是对用户环境的实际适配结论。A3 是新增产品方案，原手册 A2 镜像模板与 A3 的兼容性未验证。
- 用户实际点击后才生成同意气泡；参数变化重授权；失败保持展开，不自动重试、删容器、清文件、杀进程、扩权或停服务。
- 真实执行、用户提供、手册示例和演示数据必须分别标明。手动粘贴不自动判通过。

## 1 环境准备

**目标 / AI 开场**：先获取 HiDevLab 实验环境，再确认目标主机的 NPU 和 Docker 可查询。

**执行位置**：先在 HiDevLab 环境控制台操作，再切换到选定实验主机终端。

**子任务**：申请 HiDevLab 100 卡时 A3 算力 → 创建 CANN 环境 → 环境开机 → 选择实验主机 → 查询 NPU → 查询 Docker。

### 前置准备

- 按本次方案申请 100 卡时 A3 算力；实际额度、资格、资源和计费以平台为准。
- 创建 CANN 环境，确认配套版本、镜像与资源，再单独确认开机。
- 真实资源未接入；本页的申请、创建、开机都仅为演示。

### AI 学伴协助内容

- 在用户分别确认后展示申请、创建、开机的模拟记录。
- 只读检查阶段展示 npu-smi info 与 docker ps，并解释两项回显。

### 用户选择与授权

- 申请 A3 / 100 卡时、创建 CANN、开机分别确认，不默认代替用户接受平台条款。
- 选择目标主机；仅授权两条只读查询，不包括安装驱动、升级固件、重启或启停 Docker。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```text
申请目标：A3 算力
申请额度：100 卡时
用途：MindIE 文本生成学习实验

使用本次演示的 A3 算力额度
创建 CANN 开发环境
真实 CANN 版本、镜像、区域及可用资源需在平台选择

启动刚创建的 CANN 实验环境
真实开机前需核对资源与计费规则
仅模拟开机，不连接控制台

主机只读检查：
npu-smi info
docker ps
```

### 结果卡片与预期回显

- HiDevLab：申请额度、环境创建状态、开机状态，均须标明来源。
- NPU：设备列表、Health；工具版本只在真实回显提供时展示。
- Docker：查询成功、表头及容器列表；只有空表头不算失败。

以下为演示回显示例，不是执行证据：

```text
NPU ID  Health
4       OK

CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES
# Docker 空表头也是正常查询结果。
```

### 异常与恢复

- 命令不存在、权限不足、Docker 不可连接或 NPU Health 异常时保留展开，停止推进。
- 管理员处理安装、固件、驱动等问题后，再由用户重新授权检查。

**完成条件**：环境获取流程已确认，NPU 和 Docker 检查均通过；演示通过不代表真实主机可用。

**内容依据**：HiDevLab A3 / 100 卡时 / CANN / 开机为用户新增方案；两条查询来自手册 §2.2。原手册 A2 模板对 A3 的兼容性未验证。

## 2 下载模型权重

**目标 / AI 开场**：准备 Qwen2-7B 权重，使其位于已确认的服务器目录，供后续只读挂载。

**执行位置**：模型仓网页、本地文件和选定主机目录；不同位置始终分开说明。

**子任务**：选择准备方式 → 本地下载权重 → 上传服务器 → 检查权重文件。

### 前置准备

- 模型仓：Qwen/Qwen2-7B；原手册示例目录 /home/lgy/Qwen2-7B/。
- 先确认所选模型版本、来源、空间与网络影响；不把历史截图当作当前文件清单。

### AI 学伴协助内容

- 服务器已有：检查选定目录，跳过下载和上传。
- 本地已有：引导用户确认源目录与目标目录，在外部上传后再检查。
- 尚未下载：引导网页下载、本地保存、上传服务器，再检查；本演示不下载或上传文件。

### 用户选择与授权

- 选择“服务器已有 / 本地已有 / 需要下载”。
- 确认模型版本、下载位置、上传目标及已有文件的处理，不默认覆盖。
- 账号或凭据仅在外部安全界面输入，不粘贴到对话。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
ls -lh '/home/lgy/Qwen2-7B/'
```

### 结果卡片与预期回显

- 模型标识、选定目录、文件清单与缺失项。
- 手册示例包括 config.json、generation_config.json、模型索引、4 个 safetensors 分片及 tokenizer 相关文件。
- 只做存在检查时标“存在检查”；未比对可信清单或哈希，不称完整性已证明。

以下为演示回显示例，不是执行证据：

```text
[手册文件截图对应的清单]
config.json
generation_config.json
model.safetensors.index.json
model-00001-of-00004.safetensors
model-00002-of-00004.safetensors
model-00003-of-00004.safetensors
model-00004-of-00004.safetensors
tokenizer.json / tokenizer_config.json
merges.txt / vocab.json
示例目录：/home/lgy/Qwen2-7B/
仅做存在检查，未核验可信哈希。
```

### 异常与恢复

- 缺分片、索引或 tokenizer 文件时，补齐同一模型版本再重查。
- 上传冲突或空间不足由用户处理，不自动覆盖、删除旧文件或换模型。

**完成条件**：所选服务器目录可访问，当前版本所需文件存在；下载、上传与检查的证据来源清楚。

**内容依据**：网页下载后上传来自手册；ls -lh 为产品补充检查。原文未提供下载 / 上传命令，不编造脚本。

## 3 获取 MindIE 镜像

**目标 / AI 开场**：核对设备与架构，取得匹配的 MindIE 镜像；已有镜像优先复用。

**执行位置**：仓库网页 / 安全认证终端，以及目标主机 Docker 终端。

**子任务**：选择设备和镜像 → 确认仓库权限 → 用户完成安全登录 → 拉取或复用镜像。

### 前置准备

- 确认实际硬件、系统架构、镜像版本和磁盘空间。
- 手册镜像 2.0.RC1-800I-A2 为历史实验示例，不是最新版本推荐，也不能直接认定适配 A3。

### AI 学伴协助内容

- 已有本地镜像：核对镜像记录，不强制重新拉取。
- 需要拉取：在用户确认权限和安全登录后，展示最终镜像标识与拉取命令。

### 用户选择与授权

- 确认硬件型号、架构及完整镜像标识。
- 选择已有权限、去申请或复用本地镜像；审核中停留等待，不假装批准。
- 用户在安全界面登录；再次确认网络和磁盘影响后才授权拉取。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
docker pull swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
docker images
```

### 结果卡片与预期回显

- 权限与认证状态、缓存复用或拉取进度。
- 镜像 ID、Repository、Tag、架构及实际大小；未获得的字段不补造。

以下为演示回显示例，不是执行证据：

```text
IMAGE ID: demo-image-id
TAG: swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts
架构：aarch64（用户选择，模拟核对）
```

### 异常与恢复

- 权限不足、认证失败、中断、空间不足、架构不匹配时不推进。
- 由用户处理后重新确认，不为完成流程静默换镜像。

**完成条件**：选定镜像已存在于目标主机，并核对设备 / 架构；真实适配需真实证据。

**内容依据**：镜像标识和 docker pull 形式来自手册；镜像检查与状态门槛为评审补充。

## 4 启动容器

**目标 / AI 开场**：把已选 NPU、驱动和只读模型权重提供给指定推理容器。

**执行位置**：目标主机终端；不要把 docker run 当作容器内命令。

**子任务**：核对镜像、设备和目录 → 确认容器参数与权限 → 创建/复用并检查容器。

### 前置准备

- 核对主机设备节点、本地镜像和步骤 2 的权重目录。
- 统一容器名：本演示使用 qwen，避免原文 qwentry6 与后文 qwen 不一致。

### AI 学伴协助内容

- 生成最终 docker run 预览，引用已确认的镜像、设备与权重目录。
- 用户授权后模拟创建并核对；复用分支只查看现有容器状态和挂载。

### 用户选择与授权

- 容器名、NPU 编号、镜像、主机权重目录与 /home/weights 只读挂载。
- privileged 高权限和 host 主机网络分别确认，不能用“下一步”代替授权。
- 同名容器选择复用、换名或取消，不默认删除或重建。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
ll /dev/ | grep davinci
docker images
docker run -it -d --net=host --shm-size=1g \
  --name qwen --privileged=true \
  -w /home \
  --device=/dev/davinci4 \
  --device=/dev/davinci_manager \
  --device=/dev/hisi_hdc \
  --device=/dev/devmm_svm \
  -v /usr/local/Ascend/driver:/usr/local/Ascend/driver:ro \
  -v /usr/local/dcmi:/usr/local/dcmi:ro \
  -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi:ro \
  -v /usr/local/sbin/:/usr/local/sbin:ro \
  -v /home/lgy/Qwen2-7B/:/home/weights:ro \
  swr.cn-south-1.myhuaweicloud.com/ascendhub/mindie:2.0.RC1-800I-A2-py311-openeuler24.03-lts bash
```

### 结果卡片与预期回显

- 容器 ID、名称、运行状态、镜像及设备。
- 主机目录 → 容器 /home/weights/ 映射及 ro；仅返回容器 ID 不等于持续运行正常。

以下为演示回显示例，不是执行证据：

```text
CONTAINER ID: demo-container-id
NAME: qwen
STATE: running（模拟）
DEVICE: /dev/davinci4
MOUNT: /home/lgy/Qwen2-7B/ → /home/weights（只读）
```

### 异常与恢复

- 设备或路径不存在时回到参数确认，未修正前不启动。
- 名称冲突时查看 / 复用或改名，不自动清理旧容器。
- ll 可能只是 Shell 别名；不可用时先确认等价查询，不误报无设备。

**完成条件**：指定容器运行中，名称、镜像、设备及挂载可核对。

**内容依据**：docker run 模板来自手册，容器名作一致性修正；复用检查为产品补充。

## 5 模型推理配置

**目标 / AI 开场**：进入指定容器、初始化环境，再确认配置差异与静态检查；此步还不是服务启动。

**执行位置**：docker exec 在主机执行；5 条 source、config.json 操作在同一容器会话中。

**子任务**：进入指定容器 → 初始化五个环境脚本 → 预览配置字段差异 → 确认备份、合并和静态检查。

### 前置准备

- 容器名沿用步骤 4；权重路径使用容器内 /home/weights/。
- 配置目标：/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json。

### AI 学伴协助内容

- 5A：进入容器，按顺序加载 CANN、ATB、ATB Models、MindIE LLM 与 Service 五个脚本。
- 5B：先读取完整配置，展示原值 → 新值，单独确认后备份并局部合并，不覆盖其他字段。
- 检查 JSON、容器内权重路径、可见设备和卡数；演示不读取或写入真实配置。

### 用户选择与授权

- 初始化与配置合并两次授权；source 的会话必须延续到服务启动。
- httpsEnabled=false 仅用于经确认的隔离实验，不在其他网络中静默关闭 HTTPS。
- npuDeviceIds 与实际容器映射核对，不从主机 davinci4 自动推导 [[0]]。
- modelName=qwen2-7b、modelWeightPath=/home/weights/、worldSize=1；trustRemoteCode=false 不自动放开。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
docker exec -it qwen /bin/bash

# 以下命令在容器内执行
source /usr/local/Ascend/ascend-toolkit/set_env.sh
source /usr/local/Ascend/nnal/atb/set_env.sh
source /usr/local/Ascend/atb-models/set_env.sh
source /usr/local/Ascend/mindie/latest/mindie-llm/set_env.sh
source /usr/local/Ascend/mindie/latest/mindie-service/set_env.sh

# 配置字段合并片段，不可覆盖完整文件
{
  "ServerConfig": {
    "httpsEnabled": false
  },
  "BackendConfig": {
    "npuDeviceIds": [
      [
        0
      ]
    ],
    "ModelDeployConfig": {
      "ModelConfig": [
        {
          "modelName": "qwen2-7b",
          "modelWeightPath": "/home/weights/",
          "worldSize": 1,
          "trustRemoteCode": false
        }
      ]
    }
  }
}
```

### 结果卡片与预期回显

- 5 个脚本的执行状态与容器上下文；无 stdout 不自动判失败。
- 备份位置、字段差异、JSON / 路径 / 参数静态检查结果，缺少证据标未获得。

以下为演示回显示例，不是执行证据：

```text
位置：容器 qwen（模拟）
5/5 环境脚本示例退出码：0
source 无 stdout 是正常情况。
后续服务继续使用同一容器会话。

示例备份记录：config.json.bak-document
配置片段 JSON 可解析
modelWeightPath = /home/weights/
worldSize = 1
trustRemoteCode = false
仅模拟字段合并，原文件其他字段保持未操作。
真实完整配置、设备与路径未读取。
```

### 异常与恢复

- 脚本缺失、权重不可读、JSON 不合法、设备或卡数冲突时停止写入并给出建议。
- 新会话需重新初始化；应用失败保留原文件，回滚也需解释目标与影响。

**完成条件**：环境初始化完成，配置差异已确认并通过静态检查；不能提前写“模型服务部署成功”。

**内容依据**：命令与字段值来自手册；中文引号、注释和尾逗号已整理为合法 JSON 合并片段，不是完整配置。

## 6 启动 MindIE 服务

**目标 / AI 开场**：按确认计划后台启动 MindIE，以本次启动证据判定状态，然后停止日志观察。

**执行位置**：步骤 5 初始化后的同一容器会话，mindie-service 目录。

**子任务**：确认端口与日志计划 → 后台启动服务 → 核对新日志、进程和端口 → 停止日志观察。

### 前置准备

- 确认监听地址 / 端口、选定 NPU 与内存影响、日志位置及已有服务。
- 原文 > output.log 会覆盖日志；演示默认新日志，已有日志需选择新文件、追加或单独确认覆盖。

### AI 学伴协助内容

- 先展示启动计划，再模拟后台启动。
- 区分“命令已提交 / 启动中 / 日志符合”；只读取本次新日志，不拿旧日志冒充成功。
- 核对本次进程、端口与 Daemon start success! 标记；不假设未提供的健康检查接口。

### 用户选择与授权

- 对本次启动、资源占用、网络和日志策略明确授权。
- 重复启动、停止旧服务、终止进程都不包含在默认授权里。
- 由用户点击“停止日志观察”，只退出 tail；停止服务需另行授权。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
cd /usr/local/Ascend/mindie/latest/mindie-service
if test -e 'output-1030.log'; then
  printf "%s\n" "日志已存在，请选择新文件名；未启动服务"
else
nohup ./bin/mindieservice_daemon > 'output-1030.log' 2>&1 &
tail -f './output-1030.log'
fi
```

### 结果卡片与预期回显

- 本次进程、日志文件、最新日志、启动成功标记或真实错误 / 超时。
- 停止观察记录明确写“后台服务仍运行”；业务推理可用性留到步骤 7。

以下为演示回显示例，不是执行证据：

```text
[本次模拟启动记录]
PID: demo-process
LOG: output-1030.log
Daemon start success!
当前示例进程存在；1025 端口监听
业务请求可用性留到第 7 步验证。
```

### 异常与恢复

- 端口占用、启动超时或日志报错时保持展开，先核对日志、权重、设备和环境。
- 未经新授权不重启、不杀进程、不覆盖旧日志。

**完成条件**：本次服务启动证据符合，用户已停止日志观察；服务未被停止。

**内容依据**：cd / nohup / tail 与成功标记来自手册；新日志防覆盖和追加策略为产品补充。

## 7 推理交互

**目标 / AI 开场**：确认本次提示词和生成参数，只发送一次推理请求，检查响应并展示生成文本。

**执行位置**：实验执行环境的容器终端；127.0.0.1 指执行请求的环境，不是用户浏览器本机。

**子任务**：确认提示词与生成参数 → 发送一次请求 → 展示文本与检查响应。

### 前置准备

- 前一步已取得服务启动证据。
- 默认 prompt=介绍下Qwen2-7B、max_tokens=500、POST /generate；自定义参数更新预览后重新授权。

### AI 学伴协助内容

- 展示最终 curl、JSON 请求体、服务地址和数据去向。
- 授权后只模拟本次请求，展示 HTTP 状态、原始 JSON 和生成文本；不编造耗时或 Token 数。
- IDE 运行出错后，学伴先询问是否分析；用户同意后给出运行快照对比和修复代码。

### 用户选择与授权

- 手册示例或自定义问题、max_tokens、服务地址及目标环境；不要输入敏感内容。
- 只授权一次请求；增加生成量、修改问题或重试必须重新确认。
- 修复代码可复制、置入 IDE 并撤销；置入不自动运行，验证在 IDE 完成。

### 命令 / 操作预览

以下为示例，必须替换为已确认的目标参数；HiDevLab 三个阶段为操作说明，不是 Shell 命令。下载、上传、认证等未提供的命令不编造。

```sh
curl -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -X POST -d '{
  "prompt": "介绍下Qwen2-7B",
  "max_tokens": 500
}' \
  http://127.0.0.1:1025/generate
```

### 结果卡片与预期回显

- 代码对比：请求方法与地址、JSON 内容类型、JSON 对象、当前 prompt、数值 max_tokens。
- 响应对比：HTTP 200、可解析 JSON 和非空 text；不逐字匹配生成文本。
- 实际响应字段类型按接口核对；本地比较器示例约定 text 为非空字符串，不能据此断言真实 API 必为该类型。

以下为演示回显示例，不是执行证据：

```text
HTTP 200
{
  "text": "这是一条模拟生成结果，对应问题：“介绍下Qwen2-7B”。"
}
```

### 异常与恢复

- HTTP 500、请求格式错误、连接失败或空 text 不算成功；修改后在 IDE 再运行。
- 服务端错误需结合实际服务日志排查，改请求代码不能保证修复服务端故障。
- 选中代码可使用“问一问 / 异常定位”；分析必须关联同一文件、同一版本的运行记录。

**完成条件**：请求与当前目标一致，响应符合本示例结构且包含文本；生成内容事实正确性另行判断。

**内容依据**：curl、prompt、500 和 /generate 来自手册；7 项本地比较、错误分析与选区辅助为已确认的产品交互。

## 来源与配套资料

- [已确认的实验工作流评审](mindie-agent-workflow-review.md)：保留原始评审内容与决策，不在本稿中改写原稿。
- [1030 实现说明](../1030-guided-learning.md)：入口、交互状态和验证记录。
- 原始材料：《基于MindIE的文本生成推理实践.docx》§2.2；HiDevLab A3 / 100 卡时 / CANN / 开机来自用户后续补充。

