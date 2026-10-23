/* Teaching content from docs/auxiliary/mindie-agent-workflow-review.md.
 * Every output below is a labelled fixture, never a real execution result. */
(() => {
  const lab=window.MindIELab;
  const defaults={host:'A',weightsMethod:'server',weightsPath:'/home/lgy/Qwen2-7B/',filesPrepared:false,imageMode:'cached',access:'granted',loginConfirmed:false,architecture:'aarch64',image:lab.image,container:'qwen',device:'4',containerMode:'create',allowPrivileged:false,allowHostNetwork:false,containerDevice:'0',mappingConfirmed:false,allowHttp:false,logPolicy:'new',logFile:'output-1030.log',overwriteLog:false,prompt:'介绍下Qwen2-7B',maxTokens:'500'};
  const steps=[
    {name:'环境准备',context:'示例主机',files:[0],tasks:['选择实验主机','查询 NPU','查询 Docker'],goal:'只读查询 NPU 和 Docker，不安装或启停软件。',impact:'读取选定主机设备和容器列表。本次授权仅包含两条检查。',scenarios:[['ok','正常回显'],['docker','Docker 不可连接'],['npu','NPU Health 异常']]},
    {name:'下载模型权重',context:'示例主机文件',files:[1],tasks:['选择准备方式','本地下载权重','上传服务器','检查权重文件'],goal:'按所选分支准备 Qwen2-7B，并检查服务器目录中的示例文件。',impact:'手册是网页下载后上传，未提供下载/上传命令。此处不访问本地文件、不下载或上传；只模拟选定目录的存在检查，不宣称可信哈希完整性验证。',scenarios:[['ok','文件清单齐全'],['missing','缺少模型分片']]},
    {name:'获取 MindIE 镜像',context:'示例主机终端',files:[2],tasks:['选择设备和镜像','确认仓库权限','用户完成安全登录','拉取或复用镜像'],goal:'核对历史实验镜像与所选设备/架构；已有本地镜像可直接复用。',impact:'拉取会占用网络和磁盘；申请权限、登录及凭据输入由用户在外部安全界面完成。不会收集账号或密码。版本沿用手册，不是当前推荐版本。',scenarios:[['ok','正常回显'],['denied','访问被拒绝'],['architecture','架构不匹配']]},
    {name:'启动容器',context:'示例主机终端',files:[3],tasks:['核对镜像、设备和目录','确认容器参数与权限','创建/复用并检查容器'],goal:'把用户确认的设备、驱动和只读权重提供给指定容器。',impact:'创建容器会使用主机网络并赋予高权限（手册实验模板），需分别确认。已有同名容器不自动删除。复用分支只做示例状态与挂载检查。',scenarios:[['ok','正常回显'],['conflict','同名容器冲突'],['device','设备不存在']]},
    {name:'模型推理配置',context:'指定容器会话',files:[4,5],tasks:['进入指定容器','初始化五个环境脚本','预览配置字段差异','确认备份、合并和静态检查'],goal:'先初始化当前容器会话，再单独确认配置片段；保留原文件其他字段。',impact:'初始化与写配置分两次授权。配置示例关闭 HTTPS，须确认仅用于隔离实验；trustRemoteCode 保持 false。主机设备号不自动推导为容器内编号。',scenarios:[['ok','正常回显'],['script','初始化脚本缺失'],['path','容器权重路径不可读']]},
    {name:'启动 MindIE 服务',context:'指定容器会话',files:[6],tasks:['确认端口与日志计划','后台启动服务','核对新日志、进程和端口','停止日志观察'],goal:'区分“后台命令提交”与“启动证据符合”，不读取旧日志冒充本次成功。',impact:'启动会占用算力、内存并写日志。默认示例新日志；追加保留旧日志；覆盖日志必须另行确认。停止 tail 只停止观察，不停止后台服务。',scenarios:[['ok','启动证据符合'],['port','端口占用'],['timeout','启动超时']]},
    {name:'推理交互',context:'指定容器终端',files:[7],tasks:['确认提示词与生成参数','发送一次请求','展示文本与检查响应'],goal:'向执行请求所在实验环境的 127.0.0.1:1025/generate 发一次请求。',impact:'仅授权本次提示词和生成量；不自动重试。不要输入敏感信息；参数变更后重新确认。生成文本不是模型规格或知识正确性的证明。',scenarios:[['ok','正常响应'],['http','HTTP 500'],['empty','空 text 响应']]}
  ];
  const quote=s=>"'"+String(s).replace(/'/g,"'\"'\"'")+"'";
  function patch(p){const json=JSON.parse(lab.steps[5].code);json.BackendConfig.npuDeviceIds=[[Number(p.containerDevice)]];return json;}
  function command(s,i){const p=s.config,phase=s.steps[i].phase;
    if(i===0)return lab.steps[0].code;
    if(i===1)return 'ls -lh '+quote(p.weightsPath);
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
    if(i===1&&p.weightsMethod!=='server'&&!p.filesPrepared)return '请先在外部下载/上传权重，并确认已准备。该确认不会被当成真实服务器验证。';
    if(i===2&&p.imageMode==='pull'&&(p.access!=='granted'||!p.loginConfirmed))return '镜像权限申请或安全登录尚未由用户确认；不演示拉取，也不自动批准权限。';
    if(i===3&&p.containerMode==='create'&&(!p.allowPrivileged||!p.allowHostNetwork))return '创建容器前，请分别确认高权限与主机网络的实验影响。';
    if(i===4&&s.steps[i].phase==='config'&&(!p.mappingConfirmed||!p.allowHttp))return '请确认容器内设备编号，并单独确认本隔离实验中的非 HTTPS 配置。';
    if(i===5&&p.logPolicy==='overwrite'&&!p.overwriteLog)return '覆盖已有日志前需要单独确认；也可改用新日志或追加。';
    return '';
  }
  function fixture(s,i){const p=s.config,scenario=s.steps[i].scenario,phase=s.steps[i].phase;
    const failures={docker:['Cannot connect to the Docker daemon.','核对 Docker 服务与当前账户权限。只读检查授权不包含安装或启停服务。'],npu:['NPU ID 4   Health: Warning','请由管理员检查设备健康状态，本流程不自动升级固件或重启主机。'],missing:['Missing: model-00004-of-00004.safetensors','补齐选定模型版本要求的分片后重新检查，不以文件存在代替可信哈希校验。'],denied:['denied: requested access to the resource is denied','请在安全界面确认仓库权限和登录，不在对话粘贴凭据。'],architecture:['Image architecture does not match selected host architecture','核对实际架构和镜像元数据，不自动替换镜像版本。'],conflict:['Conflict: container name '+p.container+' is already in use.','换一个容器名，或选择复用并核对已有容器；不会删除旧容器。'],device:['No such file: /dev/davinci'+p.device,'回到参数确认实际设备节点；不要自动扩大设备访问范围。'],script:['source: set_env.sh: No such file or directory','核对镜像组件和脚本路径；新会话需要重新初始化。'],path:['Permission denied or missing: /home/weights/','检查只读挂载及容器内路径，不把主机路径写入容器配置。'],port:['Address already in use: 1025','先确认已有进程及端口占用；本授权不包含终止进程或停止旧服务。'],timeout:['Timed out waiting for new Daemon start success! marker','检查本次新日志、权重、设备和环境，未经新授权不自动重试启动。'],http:['HTTP 500\n{"error":"Internal Server Error（模拟）"}','核对服务端新日志与请求参数；修复代码不能保证解决服务端故障。'],empty:['HTTP 200\n{"text":""}','HTTP 200 仍可能无有效文本。查看实际响应与服务日志，不伪造返回内容。']};
    const relevant=i===0?['docker','npu']:i===1?['missing']:i===2?['denied','architecture']:i===3?['conflict','device']:i===4?(phase==='config'?['path']:['script']):i===5?['port','timeout']:['http','empty'];
    if(relevant.includes(scenario)){const [output,advice]=failures[scenario];return {passed:false,output,advice,checks:[{name:steps[i].tasks.at(-1),status:'fail',detail:advice}]};}
    let output,checks=steps[i].tasks.map(name=>({name,status:'pass',detail:'本分支模拟证据符合预期，未连接真实主机。'}));
    if(i===0)output='NPU ID  Health\n'+p.device+'       OK\n\nCONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES\n# Docker 空表头也是正常查询结果。';
    if(i===1){output=lab.steps[1].output+'\n示例目录：'+p.weightsPath+'\n仅做存在检查，未核验可信哈希。';checks[1]={name:steps[i].tasks[1],status:p.weightsMethod==='download'?'user':'skip',detail:p.weightsMethod==='download'?'用户确认已在外部下载；此页未下载。':'本分支不需要下载。'};checks[2]={name:steps[i].tasks[2],status:p.weightsMethod==='server'?'skip':'user',detail:p.weightsMethod==='server'?'服务器已有，本分支跳过上传。':'用户确认已在外部上传；此页未上传。'};}
    if(i===2){output='IMAGE ID: demo-image-id\nTAG: '+p.image+'\n架构：'+p.architecture+'（用户选择，模拟核对）';checks[1].detail=checks[2].detail=p.imageMode==='cached'?'复用本地镜像，本分支不申请权限或登录。':'仅用户确认外部权限/安全登录；无凭据进入对话。';}
    if(i===3)output='CONTAINER ID: demo-container-id\nNAME: '+p.container+'\nSTATE: running（模拟）\nDEVICE: /dev/davinci'+p.device+'\nMOUNT: '+p.weightsPath+' → /home/weights（只读）';
    if(i===4){if(phase==='initialize'){output='位置：容器 '+p.container+'（模拟）\n5/5 环境脚本示例退出码：0\nsource 无 stdout 是正常情况。\n后续服务继续使用同一容器会话。';checks=checks.slice(0,2);}else{output='示例备份记录：config.json.bak-'+s.id.slice(0,8)+'\n配置片段 JSON 可解析\nmodelWeightPath = /home/weights/\nworldSize = 1\ntrustRemoteCode = false\n仅模拟字段合并，原文件其他字段保持未操作。\n真实完整配置、设备与路径未读取。';checks=checks.slice(2);}}
    if(i===5){output='[本次模拟启动记录]\nPID: demo-process\nLOG: '+p.logFile+'\nDaemon start success!\n当前示例进程存在；1025 端口监听\n业务请求可用性留到第 7 步验证。';checks=checks.slice(0,3);}
    if(i===6)output='HTTP 200\n'+JSON.stringify({text:'这是一条模拟生成结果，对应问题：“'+p.prompt+'”。'},null,2);
    return {passed:true,output,advice:'',checks};
  }
  window.MindIEGuideContent={defaults,steps,command,validate,gate,fixture,patch};
})();
