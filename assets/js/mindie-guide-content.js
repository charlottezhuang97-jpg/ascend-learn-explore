/* Teaching content from docs/auxiliary/mindie-agent-workflow-review.md.
 * Every output below is a labelled fixture, never a real execution result. */
(() => {
  const lab=window.MindIELab;
  const defaults={host:'A',weightsMethod:'download',weightsPath:'/home/lgy/Qwen2-7B/',filesPrepared:false,imageMode:'cached',access:'granted',loginConfirmed:false,architecture:'aarch64',image:lab.image,container:'qwen',device:'4',containerMode:'create',allowPrivileged:false,allowHostNetwork:false,containerDevice:'0',mappingConfirmed:false,allowHttp:false,logPolicy:'new',logFile:'output-1030.log',overwriteLog:false,prompt:'介绍下Qwen2-7B',maxTokens:'500'};
  const steps=[
    {name:'获取并检查实验环境',context:'示例主机',files:[0],tasks:['申请 HiDevLab 100 卡时 A3 算力','创建 CANN 环境','环境开机','选择实验主机','查询 NPU','查询 Docker'],goal:'先获取 HiDevLab 实验环境，再只读查询 NPU 和 Docker。',impact:'HiDevLab 申请、创建、开机分别确认，仅模拟，不申请真实资源或产生费用；检查阶段只包含两条只读命令。',scenarios:[['ok','正常回显'],['docker','Docker 不可连接'],['npu','NPU Health 异常']]},
    {name:'下载模型权重',context:'示例主机文件',files:[1],tasks:['选择准备方式','本地下载权重','上传服务器','检查权重文件'],goal:'按所选分支准备 Qwen2-7B，并检查服务器目录中的示例文件。',impact:'手册是网页下载后上传，未提供下载/上传命令。此处不访问本地文件、不下载或上传；只模拟选定目录的存在检查，不宣称可信哈希完整性验证。',scenarios:[['ok','文件清单齐全'],['missing','缺少模型分片']]},
    {name:'获取 MindIE 镜像',context:'示例主机终端',files:[2],tasks:['选择设备和镜像','确认仓库权限','用户完成安全登录','拉取或复用镜像'],goal:'核对历史实验镜像与所选设备/架构；已有本地镜像可直接复用。',impact:'拉取会占用网络和磁盘；申请权限、登录及凭据输入由用户在外部安全界面完成。不会收集账号或密码。版本沿用手册，不是当前推荐版本。',scenarios:[['ok','正常回显'],['denied','访问被拒绝'],['architecture','架构不匹配']]},
    {name:'启动容器',context:'示例主机终端',files:[3],tasks:['核对镜像、设备和目录','确认容器参数与权限','创建/复用并检查容器'],goal:'把用户确认的设备、驱动和只读权重提供给指定容器。',impact:'创建容器会使用主机网络并赋予高权限（手册实验模板），需分别确认。已有同名容器不自动删除。复用分支只做示例状态与挂载检查。',scenarios:[['ok','正常回显'],['conflict','同名容器冲突'],['device','设备不存在']]},
    {name:'模型推理配置',context:'指定容器会话',files:[4,5],tasks:['进入指定容器','初始化五个环境脚本','预览配置字段差异','确认备份、合并和配置检查'],goal:'先初始化当前容器会话，再单独确认配置片段；保留原文件其他字段。',impact:'初始化与写配置分两次授权。配置示例关闭 HTTPS，须确认仅用于隔离实验；trustRemoteCode 保持 false。主机设备号不自动推导为容器内编号。',scenarios:[['ok','正常回显'],['script','初始化脚本缺失'],['path','容器权重路径不可读']]},
    {name:'启动 MindIE 服务',context:'指定容器会话',files:[6],tasks:['确认端口与日志计划','后台启动服务','核对新日志、进程和端口','停止日志观察'],goal:'区分“后台命令提交”与“启动成功”，不读取旧日志冒充本次成功。',impact:'启动会占用算力、内存并写日志。默认示例新日志；追加保留旧日志；覆盖日志必须另行确认。停止 tail 只停止观察，不停止后台服务。',scenarios:[['ok','启动成功'],['port','端口占用'],['timeout','启动超时']]},
    {name:'推理交互',context:'指定容器终端',files:[7],tasks:['确认提示词与生成参数','发送一次请求','展示文本与检查响应'],goal:'向执行请求所在实验环境的 127.0.0.1:1025/generate 发一次请求。',impact:'仅授权本次提示词和生成量；不自动重试。不要输入敏感信息；参数变更后重新确认。生成文本不是模型规格或知识正确性的证明。',scenarios:[['ok','正常响应'],['http','HTTP 500'],['empty','空 text 响应']]}
  ];
  const syllabus=
[
  {
    "intro": "先获取 HiDevLab 实验环境，再确认目标主机的 NPU 和 Docker 可查询。",
    "location": "先在 HiDevLab 环境控制台操作，再切换到选定实验主机终端。",
    "before": [
      "按本次方案申请 100 卡时 A3 算力；实际额度、资格、资源和计费以平台为准。",
      "创建 CANN 环境，确认配套版本、镜像与资源，再单独确认开机。",
      "真实资源未接入；本页的申请、创建、开机都仅为演示。"
    ],
    "ai": [
      "在用户分别确认后展示申请、创建、开机的模拟记录。",
      "只读检查阶段展示 npu-smi info 与 docker ps，并解释两项回显。"
    ],
    "confirm": [
      "申请 A3 / 100 卡时、创建 CANN、开机分别确认，不默认代替用户接受平台条款。",
      "选择目标主机；仅授权两条只读查询，不包括安装驱动、升级固件、重启或启停 Docker。"
    ],
    "evidence": [
      "HiDevLab：申请额度、环境创建状态、开机状态，均须标明来源。",
      "NPU：设备列表、Health；工具版本只在真实回显提供时展示。",
      "Docker：查询成功、表头及容器列表；只有空表头不算失败。"
    ],
    "failure": [
      "命令不存在、权限不足、Docker 不可连接或 NPU Health 异常时保留展开，停止推进。",
      "管理员处理安装、固件、驱动等问题后，再由用户重新授权检查。"
    ],
    "finish": "环境获取流程已确认，NPU 和 Docker 检查均通过；演示通过不代表真实主机可用。",
    "source": "HiDevLab A3 / 100 卡时 / CANN / 开机为用户新增方案；两条查询来自手册 §2.2。原手册 A2 模板对 A3 的兼容性未验证。"
  },
  {
    "intro": "准备 Qwen2-7B 权重，使其位于已确认的服务器目录，供后续只读挂载。",
    "location": "模型仓网页、本地文件和选定主机目录；不同位置始终分开说明。",
    "before": [
      "模型仓：Qwen/Qwen2-7B；原手册示例目录 /home/lgy/Qwen2-7B/。",
      "先确认所选模型版本、来源、空间与网络影响；不把历史截图当作当前文件清单。"
    ],
    "ai": [
      "服务器已有：检查选定目录，跳过下载和上传。",
      "本地已有：引导用户确认源目录与目标目录，在外部上传后再检查。",
      "尚未下载：引导网页下载、本地保存、上传服务器，再检查；本演示不下载或上传文件。"
    ],
    "confirm": [
      "选择“服务器已有 / 本地已有 / 需要下载”。",
      "确认模型版本、下载位置、上传目标及已有文件的处理，不默认覆盖。",
      "账号或凭据仅在外部安全界面输入，不粘贴到对话。"
    ],
    "evidence": [
      "模型标识、选定目录、文件清单与缺失项。",
      "手册示例包括 config.json、generation_config.json、模型索引、4 个 safetensors 分片及 tokenizer 相关文件。",
      "只做存在检查时标“存在检查”；未比对可信清单或哈希，不称完整性已证明。"
    ],
    "failure": [
      "缺分片、索引或 tokenizer 文件时，补齐同一模型版本再重查。",
      "上传冲突或空间不足由用户处理，不自动覆盖、删除旧文件或换模型。"
    ],
    "finish": "所选服务器目录可访问，当前版本所需文件存在；下载、上传与检查的记录来源清楚。",
    "source": "网页下载后上传来自手册；ls -lh 为产品补充检查。原文未提供下载 / 上传命令，不编造脚本。"
  },
  {
    "intro": "核对设备与架构，取得匹配的 MindIE 镜像；已有镜像优先复用。",
    "location": "仓库网页 / 安全认证终端，以及目标主机 Docker 终端。",
    "before": [
      "确认实际硬件、系统架构、镜像版本和磁盘空间。",
      "手册镜像 2.0.RC1-800I-A2 为历史实验示例，不是最新版本推荐，也不能直接认定适配 A3。"
    ],
    "ai": [
      "已有本地镜像：核对镜像记录，不强制重新拉取。",
      "需要拉取：在用户确认权限和安全登录后，展示最终镜像标识与拉取命令。"
    ],
    "confirm": [
      "确认硬件型号、架构及完整镜像标识。",
      "选择已有权限、去申请或复用本地镜像；审核中停留等待，不假装批准。",
      "用户在安全界面登录；再次确认网络和磁盘影响后才授权拉取。"
    ],
    "evidence": [
      "权限与认证状态、缓存复用或拉取进度。",
      "镜像 ID、Repository、Tag、架构及实际大小；未获得的字段不补造。"
    ],
    "failure": [
      "权限不足、认证失败、中断、空间不足、架构不匹配时不推进。",
      "由用户处理后重新确认，不为完成流程静默换镜像。"
    ],
    "finish": "选定镜像已存在于目标主机，并核对设备 / 架构；是否适配需要在真实环境中检查。",
    "source": "镜像标识和 docker pull 形式来自手册；镜像检查与状态门槛为评审补充。"
  },
  {
    "intro": "把已选 NPU、驱动和只读模型权重提供给指定推理容器。",
    "location": "目标主机终端；不要把 docker run 当作容器内命令。",
    "before": [
      "核对主机设备节点、本地镜像和步骤 2 的权重目录。",
      "统一容器名：本演示使用 qwen，避免原文 qwentry6 与后文 qwen 不一致。"
    ],
    "ai": [
      "生成最终 docker run 预览，引用已确认的镜像、设备与权重目录。",
      "用户授权后模拟创建并核对；复用分支只查看现有容器状态和挂载。"
    ],
    "confirm": [
      "容器名、NPU 编号、镜像、主机权重目录与 /home/weights 只读挂载。",
      "privileged 高权限和 host 主机网络分别确认，不能用“下一步”代替授权。",
      "同名容器选择复用、换名或取消，不默认删除或重建。"
    ],
    "evidence": [
      "容器 ID、名称、运行状态、镜像及设备。",
      "主机目录 → 容器 /home/weights/ 映射及 ro；仅返回容器 ID 不等于持续运行正常。"
    ],
    "failure": [
      "设备或路径不存在时回到参数确认，未修正前不启动。",
      "名称冲突时查看 / 复用或改名，不自动清理旧容器。",
      "ll 可能只是 Shell 别名；不可用时先确认等价查询，不误报无设备。"
    ],
    "finish": "指定容器运行中，名称、镜像、设备及挂载可核对。",
    "source": "docker run 模板来自手册，容器名作一致性修正；复用检查为产品补充。"
  },
  {
    "intro": "进入指定容器、初始化环境，再确认配置差异与配置检查；此步还不是服务启动。",
    "location": "docker exec 在主机执行；5 条 source、config.json 操作在同一容器会话中。",
    "before": [
      "容器名沿用步骤 4；权重路径使用容器内 /home/weights/。",
      "配置目标：/usr/local/Ascend/mindie/latest/mindie-service/conf/config.json。"
    ],
    "ai": [
      "5A：进入容器，按顺序加载 CANN、ATB、ATB Models、MindIE LLM 与 Service 五个脚本。",
      "5B：先读取完整配置，展示原值 → 新值，单独确认后备份并局部合并，不覆盖其他字段。",
      "检查 JSON、容器内权重路径、可见设备和卡数；演示不读取或写入真实配置。"
    ],
    "confirm": [
      "初始化与配置合并两次授权；source 的会话必须延续到服务启动。",
      "httpsEnabled=false 仅用于经确认的隔离实验，不在其他网络中静默关闭 HTTPS。",
      "npuDeviceIds 与实际容器映射核对，不从主机 davinci4 自动推导 [[0]]。",
      "modelName=qwen2-7b、modelWeightPath=/home/weights/、worldSize=1；trustRemoteCode=false 不自动放开。"
    ],
    "evidence": [
      "5 个脚本的执行状态与容器上下文；无 stdout 不自动判失败。",
      "备份位置、字段差异、JSON / 路径 / 参数配置检查结果，未查到的结果标为“未获得”。"
    ],
    "failure": [
      "脚本缺失、权重不可读、JSON 不合法、设备或卡数冲突时停止写入并给出建议。",
      "新会话需重新初始化；应用失败保留原文件，回滚也需解释目标与影响。"
    ],
    "finish": "环境初始化完成，配置差异已确认并通过配置检查；不能提前写“模型服务部署成功”。",
    "source": "命令与字段值来自手册；中文引号、注释和尾逗号已整理为合法 JSON 合并片段，不是完整配置。"
  },
  {
    "intro": "按确认计划后台启动 MindIE，根据本次启动结果判断是否成功，然后停止日志观察。",
    "location": "步骤 5 初始化后的同一容器会话，mindie-service 目录。",
    "before": [
      "确认监听地址 / 端口、选定 NPU 与内存影响、日志位置及已有服务。",
      "原文 > output.log 会覆盖日志；演示默认新日志，已有日志需选择新文件、追加或单独确认覆盖。"
    ],
    "ai": [
      "先展示启动计划，再模拟后台启动。",
      "区分“命令已提交 / 启动中 / 日志符合”；只读取本次新日志，不拿旧日志冒充成功。",
      "核对本次进程、端口与 Daemon start success! 标记；不假设未提供的健康检查接口。"
    ],
    "confirm": [
      "对本次启动、资源占用、网络和日志策略明确授权。",
      "重复启动、停止旧服务、终止进程都不包含在默认授权里。",
      "由用户点击“停止日志观察”，只退出 tail；停止服务需另行授权。"
    ],
    "evidence": [
      "本次进程、日志文件、最新日志、启动成功标记或真实错误 / 超时。",
      "停止观察记录明确写“后台服务仍运行”；业务推理可用性留到步骤 7。"
    ],
    "failure": [
      "端口占用、启动超时或日志报错时保持展开，先核对日志、权重、设备和环境。",
      "未经新授权不重启、不杀进程、不覆盖旧日志。"
    ],
    "finish": "服务已启动，日志观察已结束；服务仍在运行。",
    "source": "cd / nohup / tail 与成功标记来自手册；新日志防覆盖和追加策略为产品补充。"
  },
  {
    "intro": "确认本次提示词和生成参数，只发送一次推理请求，检查响应并展示生成文本。",
    "location": "实验执行环境的容器终端；127.0.0.1 指执行请求的环境，不是用户浏览器本机。",
    "before": [
      "前一步已确认服务启动。",
      "默认 prompt=介绍下Qwen2-7B、max_tokens=500、POST /generate；自定义参数更新预览后重新授权。"
    ],
    "ai": [
      "展示最终 curl、JSON 请求体、服务地址和数据去向。",
      "授权后只模拟本次请求，展示 HTTP 状态、原始 JSON 和生成文本；不编造耗时或 Token 数。",
      "IDE 运行出错后，学伴先询问是否分析；用户同意后给出运行快照对比和修复代码。"
    ],
    "confirm": [
      "手册示例或自定义问题、max_tokens、服务地址及目标环境；不要输入敏感内容。",
      "只授权一次请求；增加生成量、修改问题或重试必须重新确认。",
      "修复代码可复制、置入 IDE 并撤销；置入不自动运行，验证在 IDE 完成。"
    ],
    "evidence": [
      "代码对比：请求方法与地址、JSON 内容类型、JSON 对象、当前 prompt、数值 max_tokens。",
      "响应对比：HTTP 200、可解析 JSON 和非空 text；不逐字匹配生成文本。",
      "实际响应字段类型按接口核对；本地比较器示例约定 text 为非空字符串，不能据此断言真实 API 必为该类型。"
    ],
    "failure": [
      "HTTP 500、请求格式错误、连接失败或空 text 不算成功；修改后在 IDE 再运行。",
      "服务端错误需结合实际服务日志排查，改请求代码不能保证修复服务端故障。",
      "选中代码可使用“问一问 / 异常定位”；分析必须关联同一文件、同一版本的运行记录。"
    ],
    "finish": "请求与当前目标一致，响应符合本示例结构且包含文本；生成内容事实正确性另行判断。",
    "source": "curl、prompt、500 和 /generate 来自手册；7 项本地比较、错误分析与选区辅助为已确认的产品交互。"
  }
]
  ;
  const quote=s=>"'"+String(s).replace(/'/g,"'\"'\"'")+"'";
  const acquisition=[
    {key:'request',title:'HiDevLab 环境申请',task:'申请 HiDevLab 100 卡时 A3 算力',plan:'申请目标：A3 算力\n申请额度：100 卡时\n用途：MindIE 文本生成学习实验',result:'100 卡时 A3 算力申请通过（模拟）。\n未向平台提交申请，不表示真实额度到账。',button:'确认申请 100 卡时 A3（演示）'},
    {key:'create',title:'创建 CANN 环境',task:'创建 CANN 环境',plan:'使用本次演示的 A3 算力额度\n创建 CANN 开发环境\n真实 CANN 版本、镜像、区域及可用资源需在平台选择',result:'CANN 环境已创建（模拟），尚未开机。\n未创建真实实例，未验证软件版本。',button:'确认创建 CANN 环境（演示）'},
    {key:'power',title:'环境开机',task:'环境开机',plan:'启动刚创建的 CANN 实验环境\n真实开机前需核对资源与计费规则\n仅模拟开机，不连接控制台',result:'CANN 环境已开机（模拟）。\n可以继续演示 NPU 与 Docker 检查，真实连接与设备仍未验证。',button:'确认环境开机（演示）'}
  ];
  function patch(p){const json=JSON.parse(lab.steps[5].code);json.BackendConfig.npuDeviceIds=[[Number(p.containerDevice)]];return json;}
  function command(s,i){const p=s.config,phase=s.steps[i].phase;
    if(i===0)return acquisition.find(x=>x.key===phase)?.plan||lab.steps[0].code;
    if(i===1)return phase==='download'?'网页下载 Qwen2-7B 权重（演示，未访问 Hugging Face）':phase==='upload'?'上传权重到 '+p.weightsPath+'（演示，未传输文件）':'ls -lh '+quote(p.weightsPath);
    if(i===2)return (p.imageMode==='pull'?'docker pull '+p.image+'\n':'')+'docker images';
    if(i===3){const check='ll /dev/ | grep davinci\ndocker images\n';return p.containerMode==='reuse'?'docker ps --filter '+quote('name=^/'+p.container+'$')+'\ndocker inspect '+p.container:check+lab.steps[3].code.replace('--name qwen','--name '+p.container).replace('/dev/davinci4','/dev/davinci'+p.device).replace('/home/lgy/Qwen2-7B/',p.weightsPath).replace(lab.image,p.image);}
    if(i===4)return phase==='config'?JSON.stringify(patch(p),null,2):lab.steps[4].code.replace('exec -it qwen','exec -it '+p.container);
    if(i===5){const redirect=p.logPolicy==='append'?'>>':'>',run='nohup ./bin/mindieservice_daemon '+redirect+' '+quote(p.logFile)+' 2>&1 &\ntail -f '+quote('./'+p.logFile);return 'cd /usr/local/Ascend/mindie/latest/mindie-service\n'+(p.logPolicy==='new'?'if test -e '+quote(p.logFile)+'; then\n  printf "%s\\n" "日志已存在，请选择新文件名；未启动服务"\nelse\n'+run+'\nfi':run);}
    return 'curl -H "Accept: application/json" \\\n  -H "Content-type: application/json" \\\n  -X POST -d '+quote(JSON.stringify({prompt:p.prompt,max_tokens:Number(p.maxTokens)},null,2))+' \\\n  http://127.0.0.1:1025/generate';
  }
  function validate(p){
    if(!/^\/[\w./-]+\/$/.test(p.weightsPath)||p.weightsPath.split('/').includes('..'))return '权重目录需为以 / 结尾的绝对路径，仅使用字母、数字、下划线、点、横线和 /，不接受 ..。';
    if(!/^[a-z0-9][a-z0-9./:_-]*$/i.test(p.image))return '镜像名称包含不支持的字符。';
    if(!/^[a-zA-Z0-9][\w.-]{0,63}$/.test(p.container))return '容器名需为 1–64 位字母、数字、下划线、点或横线。';
    if(!/^\d{1,2}$/.test(p.device)||!/^\d{1,2}$/.test(p.containerDevice))return '设备编号需为 0–99 的整数；真实映射仍需人工核对。';
    if(!/^[\w.-]+\.log$/.test(p.logFile))return '日志名仅支持字母、数字、下划线、点、横线，并以 .log 结尾。';
    if(!p.prompt.trim()||p.prompt.length>500)return '提示词需为 1–500 字。';
    if(!/^\d+$/.test(p.maxTokens)||Number(p.maxTokens)<1||Number(p.maxTokens)>2048)return '本演示 max_tokens 允许 1–2048 的整数；真实服务上限需另行核对。';
    return '';
  }
  function gate(s,i){const p=s.config;
    if(i>0&&s.steps.slice(0,i).some(x=>x.status!=='success'))return '请先完成前面的依赖步骤。';
    if(i===1&&p.weightsMethod!=='server'&&!p.filesPrepared&&!['download','upload','verify'].includes(s.steps[i].phase))return '请先在外部下载/上传权重，并确认已准备。该确认不会被当成真实服务器验证。';
    if(i===2&&p.imageMode==='pull'&&(p.access!=='granted'||!p.loginConfirmed))return '镜像权限申请或安全登录尚未由用户确认；不演示拉取，也不自动批准权限。';
    if(i===3&&p.containerMode==='create'&&(!p.allowPrivileged||!p.allowHostNetwork))return '创建容器前，请分别确认高权限与主机网络的实验影响。';
    if(i===4&&s.steps[i].phase==='config'&&(!p.mappingConfirmed||!p.allowHttp))return '请确认容器内设备编号，并单独确认本隔离实验中的非 HTTPS 配置。';
    if(i===5&&p.logPolicy==='overwrite'&&!p.overwriteLog)return '覆盖已有日志前需要单独确认；也可改用新日志或追加。';
    return '';
  }
  function fixture(s,i){const p=s.config,scenario=s.steps[i].scenario,phase=s.steps[i].phase;
    const provision=i===0&&acquisition.find(x=>x.key===phase);
    if(provision)return {passed:true,output:provision.result,advice:'',checks:[{name:provision.task,status:'pass',detail:provision.result}]};
    if(i===1&&phase==='download')return {passed:true,output:'下载步骤演示完成。未访问 Hugging Face，也未在本机生成模型文件。',advice:'',checks:[{name:'本地下载权重',status:'pass',detail:'仅演示流程；实际文件需由用户准备。'}]};
    if(i===1&&phase==='upload')return {passed:true,output:'上传步骤演示完成。目标目录：'+p.weightsPath+'。未向服务器传输文件。',advice:'',checks:[{name:'上传服务器',status:'pass',detail:'仅演示流程；实际服务器目录尚未验证。'}]};
    const failures={docker:['Cannot connect to the Docker daemon.','核对 Docker 服务与当前账户权限。只读检查授权不包含安装或启停服务。'],npu:['NPU ID 4   Health: Warning','请由管理员检查设备健康状态，本流程不自动升级固件或重启主机。'],missing:['Missing: model-00004-of-00004.safetensors','补齐选定模型版本要求的分片后重新检查，不以文件存在代替可信哈希校验。'],denied:['denied: requested access to the resource is denied','请在安全界面确认仓库权限和登录，不在对话粘贴凭据。'],architecture:['Image architecture does not match selected host architecture','核对实际架构和镜像元数据，不自动替换镜像版本。'],conflict:['Conflict: container name '+p.container+' is already in use.','换一个容器名，或选择复用并核对已有容器；不会删除旧容器。'],device:['No such file: /dev/davinci'+p.device,'回到参数确认实际设备节点；不要自动扩大设备访问范围。'],script:['source: set_env.sh: No such file or directory','核对镜像组件和脚本路径；新会话需要重新初始化。'],path:['Permission denied or missing: /home/weights/','检查只读挂载及容器内路径，不把主机路径写入容器配置。'],port:['Address already in use: 1025','先确认已有进程及端口占用；本授权不包含终止进程或停止旧服务。'],timeout:['Timed out waiting for new Daemon start success! marker','检查本次新日志、权重、设备和环境，未经新授权不自动重试启动。'],http:['HTTP 500\n{"error":"Internal Server Error（模拟）"}','核对服务端新日志与请求参数；修复代码不能保证解决服务端故障。'],empty:['HTTP 200\n{"text":""}','HTTP 200 仍可能无有效文本。查看实际响应与服务日志，不伪造返回内容。']};
    const relevant=i===0?['docker','npu']:i===1?(phase==='verify'?['missing']:[]):i===2?['denied','architecture']:i===3?['conflict','device']:i===4?(phase==='config'?['path']:['script']):i===5?['port','timeout']:['http','empty'];
    if(relevant.includes(scenario)){const [output,advice]=failures[scenario];return {passed:false,output,advice,checks:[{name:steps[i].tasks.at(-1),status:'fail',detail:advice}]};}
    let output,checks=steps[i].tasks.map(name=>({name,status:'pass',detail:'本项检查已通过（演示），未连接真实主机。'}));
    if(i===0){checks=checks.slice(3);output='NPU ID  Health\n'+p.device+'       OK\n\nCONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES\n# Docker 空表头也是正常查询结果。';}
    if(i===1){output=lab.steps[1].output+'\n示例目录：'+p.weightsPath+'\n仅展示预期文件清单，未查询真实目录或核验可信哈希。';checks[1]={name:steps[i].tasks[1],status:'pass',detail:'下载流程已演示；未真正下载文件。'};checks[2]={name:steps[i].tasks[2],status:'pass',detail:'上传流程已演示；未真正传输文件。'};}
    if(i===2){output='IMAGE ID: demo-image-id\nTAG: '+p.image+'\n架构：'+p.architecture+'（用户选择，模拟核对）';checks[1].detail=checks[2].detail=p.imageMode==='cached'?'复用本地镜像，本分支不申请权限或登录。':'仅用户确认外部权限/安全登录；无凭据进入对话。';}
    if(i===3)output='CONTAINER ID: demo-container-id\nNAME: '+p.container+'\nSTATE: running（模拟）\nDEVICE: /dev/davinci'+p.device+'\nMOUNT: '+p.weightsPath+' → /home/weights（只读）';
    if(i===4){if(phase==='initialize'){output='位置：容器 '+p.container+'（模拟）\n5/5 环境脚本示例退出码：0\nsource 无 stdout 是正常情况。\n后续服务继续使用同一容器会话。';checks=checks.slice(0,2);}else{output='示例备份记录：config.json.bak-'+s.id.slice(0,8)+'\n配置片段 JSON 可解析\nmodelWeightPath = /home/weights/\nworldSize = 1\ntrustRemoteCode = false\n仅模拟字段合并，原文件其他字段保持未操作。\n真实完整配置、设备与路径未读取。';checks=checks.slice(2);}}
    if(i===5){output='[本次模拟启动记录]\nPID: demo-process\nLOG: '+p.logFile+'\nDaemon start success!\n当前示例进程存在；1025 端口监听\n业务请求可用性留到第 7 步验证。';checks=checks.slice(0,3);}
    if(i===6)output='HTTP 200\n'+JSON.stringify({text:'这是一条模拟生成结果，对应问题：“'+p.prompt+'”。'},null,2);
    return {passed:true,output,advice:'',checks};
  }
  window.MindIEGuideContent={defaults,steps,command,validate,gate,fixture,patch,acquisition,syllabus};
})();
