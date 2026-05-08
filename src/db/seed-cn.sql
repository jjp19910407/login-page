-- ============================================================
-- 国内 AI 产品种子数据
-- 执行前确保 regions / categories / tools 表已存在
-- ============================================================

-- ---- 1. Region ----
INSERT INTO regions (name, slug, sort_order) VALUES
  ('国内', 'cn', 1)
ON CONFLICT (slug) DO NOTHING;

-- ---- 2. Categories（依赖 region_id，用子查询取 id）----
INSERT INTO categories (region_id, name, slug, type, icon, sort_order)
SELECT r.id, v.name, v.slug, v.type::category_type, v.icon, v.sort_order
FROM regions r,
(VALUES
  ('AI 对话',     'chat',             'chat',             '💬', 1),
  ('图像生成',    'image-generation', 'image_generation', '🎨', 2),
  ('音乐生成',    'music-generation', 'music_generation', '🎵', 3),
  ('AI 编程',     'ai-coding',        'ai_coding',        '💻', 4),
  ('API 中转',    'relay-station',    'relay_station',    '🔗', 5),
  ('效率工具',    'ai-tools',         'ai_tools',         '🛠', 6)
) AS v(name, slug, type, icon, sort_order)
WHERE r.slug = 'cn'
ON CONFLICT (region_id, slug) DO NOTHING;

-- ---- 3. Tools ----
-- 用 CTE 把 category_id 查出来，避免硬编码 id

WITH cat AS (
  SELECT c.id, c.slug
  FROM categories c
  JOIN regions r ON r.id = c.region_id
  WHERE r.slug = 'cn'
)

INSERT INTO tools (category_id, name, slug, description, url, pricing_info, company, tags, is_featured, sort_order)
SELECT c.id, v.name, v.slug, v.description, v.url, v.pricing_info, v.company, v.tags, v.is_featured, v.sort_order
FROM cat c
JOIN (VALUES

  -- ===== AI 对话 =====
  ('chat', '文心一言',   'wenxin-yiyan',   '百度出品的大语言模型，支持中文对话、文案创作、图片生成',          'https://yiyan.baidu.com',          '连续包月 ¥49.9/月，非连续 ¥59.9/月',  '百度',     ARRAY['中文','对话','百度'],         true,  1),
  ('chat', '通义千问',   'tongyi-qianwen', '阿里巴巴大模型，支持长文本、多模态，API 按量计费',               'https://tongyi.aliyun.com',        'API: Turbo ¥0.3/百万Token，Max ¥40/百万Token', '阿里巴巴', ARRAY['中文','对话','多模态'],        true,  2),
  ('chat', '讯飞星火',   'xunfei-xinghuo', '科大讯飞大模型，擅长中文理解与语音交互',                        'https://xinghuo.xfyun.cn',         '月会员 ¥39/月，年会员 ¥299～¥399/年', '科大讯飞', ARRAY['中文','语音','对话'],          false, 3),
  ('chat', '智谱清言',   'zhipu-qingyan',  '智谱AI旗下对话产品，基于GLM系列模型',                          'https://chatglm.cn',               '¥19/月起',                            '智谱AI',   ARRAY['中文','GLM','对话'],           false, 4),
  ('chat', 'Kimi',       'kimi',           '月之暗面出品，支持超长上下文，擅长文档阅读与分析',               'https://kimi.moonshot.cn',         '基础版 ¥49/月，专业版 ¥99/月',        '月之暗面', ARRAY['长文本','中文','文档'],        true,  5),
  ('chat', '豆包',       'doubao',         '字节跳动出品的AI助手，集成搜索、写作、图像等能力',               'https://www.doubao.com',           '标准版 ¥68/月，旗舰版 ¥500/月',       '字节跳动', ARRAY['中文','对话','多模态'],        true,  6),
  ('chat', '混元助手',   'hunyuan',        '腾讯混元大模型，支持多轮对话与内容创作',                        'https://hunyuan.tencent.com',      NULL,                                  '腾讯',     ARRAY['中文','对话','腾讯'],          false, 7),
  ('chat', '海螺AI',     'hailuo-ai',      'MiniMax出品，支持多模态对话与内容生成',                         'https://hailuoai.com',             NULL,                                  'MiniMax',  ARRAY['中文','多模态','对话'],        false, 8),
  ('chat', '天工AI',     'tiangong-ai',    '昆仑万维出品，集成AI搜索与对话能力',                            'https://www.tiangong.cn',          NULL,                                  '昆仑万维', ARRAY['中文','搜索','对话'],          false, 9),
  ('chat', '元宝',       'yuanbao',        '腾讯出品的AI助手，支持深度搜索与文档分析',                      'https://yuanbao.tencent.com',      NULL,                                  '腾讯',     ARRAY['中文','搜索','腾讯'],          false, 10),
  ('chat', '跃问',       'yuewen',         '阶跃星辰出品，支持多模态理解与长文本处理',                      'https://yuewen.cn',                NULL,                                  '阶跃星辰', ARRAY['中文','多模态','对话'],        false, 11),

  -- ===== 图像生成 =====
  ('image-generation', '文心一格',   'wenxin-yige',    '百度AI图像创作平台，支持中文提示词生成高质量图片',          'https://yige.baidu.com',           NULL,                                  '百度',     ARRAY['绘画','中文','图像'],          false, 1),
  ('image-generation', '通义万象',   'tongyi-wanxiang','阿里巴巴多模态生成模型，支持图像与视频生成',               'https://tongyi.aliyun.com/wanxiang',NULL,                                 '阿里巴巴', ARRAY['绘画','视频','多模态'],        false, 2),
  ('image-generation', '即梦AI',     'jimeng-ai',      '字节跳动出品，支持AI图像与视频生成，集成剪映生态',          'https://jimeng.jianying.com',      '基础 ¥30/月，标准 ¥68/月，高级 ¥99/月','字节跳动', ARRAY['绘画','视频','图像'],          true,  3),
  ('image-generation', '可灵AI',     'kling-ai',       '快手出品的AI视频与图像生成平台，支持高质量视频生成',        'https://klingai.kuaishou.com',     '黄金会员 ¥66/月，黑金会员 ¥999/月',  '快手',     ARRAY['视频','图像','生成'],          true,  4),
  ('image-generation', '海螺图像',   'hailuo-image',   'MiniMax出品的AI图像生成工具',                            'https://hailuoai.com/image',       NULL,                                  'MiniMax',  ARRAY['图像','生成'],                 false, 5),
  ('image-generation', 'LiblibAI',   'liblib-ai',      '国内最大的Stable Diffusion模型分享与生成平台',            'https://www.liblib.art',           NULL,                                  'LiblibAI', ARRAY['SD','模型','绘画'],            false, 6),

  -- ===== 音乐生成 =====
  ('music-generation', '天工音乐',   'tiangong-music', '昆仑万维出品的AI音乐生成平台，支持中文歌词创作',           'https://music.tiangong.cn',        NULL,                                  '昆仑万维', ARRAY['音乐','中文','生成'],          false, 1),
  ('music-generation', '网易天音',   'tianyin-163',    '网易出品的AI音乐创作平台，可生成完整歌曲',                 'https://tianyin.music.163.com',    NULL,                                  '网易',     ARRAY['音乐','中文','生成'],          false, 2),
  ('music-generation', '海绵音乐',   'haimian-music',  '字节跳动出品的AI音乐生成工具',                           'https://www.haimian.com',          NULL,                                  '字节跳动', ARRAY['音乐','生成'],                 false, 3),

  -- ===== AI 编程 =====
  ('ai-coding', '通义灵码',   'tongyi-lingma',  '阿里巴巴出品的AI编程助手，支持主流IDE插件',                 'https://lingma.aliyun.com',        '个人专业版 ¥66/月，企业版按需',       '阿里巴巴', ARRAY['编程','IDE','代码补全'],       true,  1),
  ('ai-coding', '文心快码',   'comate',         '百度出品的AI编程助手Comate，支持多语言代码生成',            'https://comate.baidu.com',         NULL,                                  '百度',     ARRAY['编程','IDE','代码补全'],       false, 2),
  ('ai-coding', '讯飞iFlyCode','iflycode',       '科大讯飞出品的AI编程助手，支持代码生成与解释',              'https://iflycode.xfyun.cn',        NULL,                                  '科大讯飞', ARRAY['编程','IDE','代码补全'],       false, 3),
  ('ai-coding', 'MarsCode',   'marscode',       '字节跳动出品的AI编程助手，核心功能免费',                    'https://www.marscode.cn',          NULL,                                  '字节跳动', ARRAY['编程','IDE','代码补全'],       false, 4),
  ('ai-coding', '腾讯云AI代码助手','tencent-acc','腾讯云出品的AI编程助手，集成腾讯云生态',                   'https://cloud.tencent.com/product/acc',NULL,                               '腾讯',     ARRAY['编程','IDE','腾讯云'],         false, 5),

  -- ===== API 中转 =====
  ('relay-station', '硅基流动',   'siliconflow',    '国内领先的大模型API推理平台，支持DeepSeek等主流模型',       'https://siliconflow.cn',           'DeepSeek-V3 ¥2/百万Token，R1 ¥4/百万Token', '硅基流动', ARRAY['API','推理','DeepSeek'],      true,  1),
  ('relay-station', '火山引擎',   'volcengine-ark', '字节跳动云平台，提供豆包等模型API服务',                    'https://www.volcengine.com/product/ark','按量计费',                        '字节跳动', ARRAY['API','云服务','字节'],         false, 2),
  ('relay-station', '百度千帆',   'baidu-qianfan',  '百度智能云大模型平台，支持文心系列模型API',                'https://qianfan.cloud.baidu.com',  '按量计费',                            '百度',     ARRAY['API','云服务','百度'],         false, 3),
  ('relay-station', '阿里百炼',   'aliyun-bailian', '阿里云大模型应用开发平台，支持通义系列模型',               'https://bailian.aliyun.com',       '按量计费',                            '阿里巴巴', ARRAY['API','云服务','阿里'],         false, 4),
  ('relay-station', '腾讯混元API','tencent-hunyuan-api','腾讯云混元大模型API服务',                            'https://cloud.tencent.com/product/hunyuan','按量计费',                     '腾讯',     ARRAY['API','云服务','腾讯'],         false, 5),

  -- ===== 效率工具 =====
  ('ai-tools', 'WPS AI',      'wps-ai',         '金山办公出品，集成AI写作、PPT生成、表格分析等能力',          'https://ai.wps.cn',                NULL,                                  '金山办公', ARRAY['办公','文档','PPT'],           true,  1),
  ('ai-tools', '飞书AI',      'feishu-ai',       '字节跳动飞书内置AI助手，支持会议纪要、文档创作',            'https://www.feishu.cn/ai',         NULL,                                  '字节跳动', ARRAY['办公','协作','会议'],          false, 2),
  ('ai-tools', '钉钉AI',      'dingtalk-ai',     '阿里巴巴钉钉内置AI助手，支持智能办公场景',                  'https://www.dingtalk.com/ai',      NULL,                                  '阿里巴巴', ARRAY['办公','协作','钉钉'],          false, 3),
  ('ai-tools', '秘塔AI搜索',  'metaso',          '专注AI搜索的工具，无广告、有来源，适合研究场景',            'https://metaso.cn',                NULL,                                  '秘塔科技', ARRAY['搜索','中文','研究'],          true,  4),
  ('ai-tools', '360AI搜索',   '360-ai-search',   '360出品的AI搜索引擎，支持多轮对话式搜索',                   'https://ai.360.com',               NULL,                                  '360',      ARRAY['搜索','中文'],                 false, 5),
  ('ai-tools', '剪映AI',      'jianying-ai',     '字节跳动出品的AI视频剪辑工具，支持一键成片',               'https://www.capcut.cn',            NULL,                                  '字节跳动', ARRAY['视频','剪辑','创作'],          true,  6),
  ('ai-tools', '腾讯智影',    'tencent-zhiying', '腾讯出品的AI视频创作平台，支持数字人与视频生成',            'https://zenvideo.qq.com',          NULL,                                  '腾讯',     ARRAY['视频','数字人','创作'],        false, 7),
  ('ai-tools', '通义听悟',    'tingwu',          '阿里巴巴出品的AI会议助手，支持实时转录与摘要',              'https://tingwu.aliyun.com',        NULL,                                  '阿里巴巴', ARRAY['会议','转录','摘要'],          false, 8),
  ('ai-tools', '讯飞听见',    'iflyrec',         '科大讯飞出品的语音转文字工具，准确率业界领先',              'https://www.iflyrec.com',          NULL,                                  '科大讯飞', ARRAY['语音','转录','字幕'],          false, 9)

) AS v(cat_slug, name, slug, description, url, pricing_info, company, tags, is_featured, sort_order)
ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  description  = EXCLUDED.description,
  pricing_info = EXCLUDED.pricing_info,
  company      = EXCLUDED.company,
  tags         = EXCLUDED.tags,
  is_featured  = EXCLUDED.is_featured,
  updated_at   = now();
