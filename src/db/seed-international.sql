-- ============================================================
-- 国外 AI 产品种子数据（region: international, id=2）
-- ============================================================

-- ---- Categories（international region_id=2）----
INSERT INTO categories (region_id, name, slug, type, icon, sort_order)
VALUES
  (2, 'Chat 聊天',  'chat',             'chat',             '💬', 1),
  (2, '图像生成',   'image-generation', 'image_generation', '🎨', 2),
  (2, '音乐生成',   'music-generation', 'music_generation', '🎵', 3),
  (2, 'AI 编程',    'ai-coding',        'ai_coding',        '💻', 4),
  (2, '视频生成',   'video-generation', 'other',            '🎬', 5),
  (2, '语音合成',   'voice-synthesis',  'other',            '🎙', 6),
  (2, 'AI 搜索',    'ai-search',        'ai_tools',         '🔍', 7),
  (2, '效率工具',   'ai-tools',         'ai_tools',         '🛠', 8)
ON CONFLICT (region_id, slug) DO NOTHING;

-- ---- Tools ----
WITH cat AS (
  SELECT c.id, c.slug
  FROM categories c
  WHERE c.region_id = 2
)
INSERT INTO tools (category_id, name, slug, description, url, pricing_info, company, tags, is_featured, sort_order)
SELECT c.id, v.name, v.slug, v.description, v.url, v.pricing_info, v.company, v.tags, v.is_featured, v.sort_order
FROM cat c
JOIN (VALUES

  -- ===== Chat 聊天 =====
  ('chat', 'ChatGPT',    'chatgpt-intl',    'OpenAI 出品的对话式 AI，支持 GPT-4o 多模态能力',                  'https://chatgpt.com',              'Plus $20/月，Pro $200/月',                    'OpenAI',      ARRAY['对话','GPT-4','多模态'],       true,  1),
  ('chat', 'Claude',     'claude-intl',     'Anthropic 出品，以安全性和长上下文著称，支持 200K token',          'https://claude.ai',                'Pro $20/月，Max $100/月，Max $200/月',         'Anthropic',   ARRAY['对话','长上下文','安全'],      true,  2),
  ('chat', 'Gemini',     'gemini-intl',     'Google 出品的多模态 AI，深度集成 Google 生态',                    'https://gemini.google.com',        'AI Pro $19.99/月，AI Ultra $249.99/月',        'Google',      ARRAY['对话','多模态','Google'],      true,  3),
  ('chat', 'Perplexity', 'perplexity-intl', '专注 AI 搜索与问答，实时联网，提供来源引用',                      'https://www.perplexity.ai',        'Pro $20/月',                                  'Perplexity',  ARRAY['搜索','问答','联网'],          true,  4),
  ('chat', 'Grok',       'grok-intl',       'xAI 出品，集成 X 平台实时数据，支持图像生成',                     'https://grok.com',                 NULL,                                          'xAI',         ARRAY['对话','实时','X平台'],         false, 5),
  ('chat', 'Meta AI',    'meta-ai-intl',    'Meta 出品，基于 Llama 模型，集成 WhatsApp/Instagram',             'https://www.meta.ai',              NULL,                                          'Meta',        ARRAY['对话','Llama','免费'],         false, 6),

  -- ===== 图像生成 =====
  ('image-generation', 'Midjourney',       'midjourney-intl',       '顶级 AI 图像生成工具，以艺术风格和高质量著称',                    'https://www.midjourney.com',       'Basic $10/月，Standard $30/月，Pro $60/月，Mega $120/月', 'Midjourney',    ARRAY['绘画','艺术','图像'],          true,  1),
  ('image-generation', 'DALL-E 3',         'dalle3-intl',           'OpenAI 出品的图像生成模型，支持精准文字渲染',                     'https://openai.com/dall-e-3',      'API 按量：标准 $0.04/张，HD $0.08/张',        'OpenAI',        ARRAY['绘画','图像','API'],           false, 2),
  ('image-generation', 'Stable Diffusion', 'stable-diffusion-intl', '开源图像生成模型，可本地部署，生态丰富',                          'https://stability.ai',             'API 按 credit 计费',                          'Stability AI',  ARRAY['开源','绘画','本地部署'],      false, 3),
  ('image-generation', 'Adobe Firefly',    'adobe-firefly-intl',    'Adobe 出品，商业安全的 AI 图像生成，深度集成 PS/AI',              'https://firefly.adobe.com',        NULL,                                          'Adobe',         ARRAY['绘画','商业','Adobe'],         false, 4),
  ('image-generation', 'Ideogram',         'ideogram-intl',         '擅长文字排版的 AI 图像生成工具',                                  'https://ideogram.ai',              NULL,                                          'Ideogram',      ARRAY['绘画','文字','排版'],          false, 5),
  ('image-generation', 'Leonardo AI',      'leonardo-ai-intl',      '面向游戏与创意的 AI 图像生成平台',                                'https://leonardo.ai',              NULL,                                          'Leonardo AI',   ARRAY['绘画','游戏','创意'],          false, 6),

  -- ===== 音乐生成 =====
  ('music-generation', 'Suno AI',  'suno-ai-intl',  '最流行的 AI 音乐生成工具，支持完整歌曲创作含人声',              'https://suno.com',                 'Pro $8/月，Premier $24/月',                   'Suno AI',     ARRAY['音乐','人声','生成'],          true,  1),
  ('music-generation', 'Udio',     'udio-intl',     '高质量 AI 音乐生成，支持多种风格与人声合成',                    'https://www.udio.com',             'Standard $9.99/月，Pro $29.99/月',             'Udio',        ARRAY['音乐','人声','生成'],          true,  2),
  ('music-generation', 'Mubert',   'mubert-intl',   '专注背景音乐生成，适合视频创作者与开发者',                      'https://mubert.com',               NULL,                                          'Mubert',      ARRAY['音乐','背景','API'],           false, 3),

  -- ===== AI 编程 =====
  ('ai-coding', 'GitHub Copilot', 'github-copilot-intl', 'GitHub 出品的 AI 编程助手，深度集成 VS Code 等主流 IDE',    'https://github.com/features/copilot', 'Pro $10/月，Pro+ $39/月，Business $19/用户/月', 'GitHub',     ARRAY['编程','IDE','代码补全'],       true,  1),
  ('ai-coding', 'Cursor',         'cursor-intl',         '基于 AI 的代码编辑器，支持多文件上下文理解与代码生成',       'https://cursor.com',               'Pro $20/月，Business $40/用户/月，Ultra $200/月', 'Anysphere',  ARRAY['编程','编辑器','代码生成'],    true,  2),
  ('ai-coding', 'Windsurf',       'windsurf-intl',       'Codeium 出品的 AI 编程 IDE，支持 Cascade 智能代理',          'https://windsurf.com',             NULL,                                          'Codeium',    ARRAY['编程','编辑器','AI代理'],      false, 3),
  ('ai-coding', 'Copilot in VS Code', 'copilot-vscode-intl', 'VS Code 内置 GitHub Copilot，支持代码补全与聊天',        'https://code.visualstudio.com',    NULL,                                          'Microsoft',  ARRAY['编程','VSCode','代码补全'],    false, 4),
  ('ai-coding', 'Replit AI',      'replit-ai-intl',      '在线 IDE 集成 AI，支持多语言开发与一键部署',                 'https://replit.com',               NULL,                                          'Replit',     ARRAY['编程','在线IDE','部署'],       false, 5),

  -- ===== 视频生成 =====
  ('video-generation', 'Runway ML',  'runway-ml-intl',  '专业 AI 视频生成与编辑平台，支持 Gen-3 视频生成',            'https://runwayml.com',             'Standard $12/月，Pro $28/月，Unlimited $76/月', 'Runway',     ARRAY['视频','生成','编辑'],          true,  1),
  ('video-generation', 'Sora',       'sora-intl',       'OpenAI 出品的文生视频模型，支持高质量长视频生成',             'https://sora.com',                 NULL,                                          'OpenAI',     ARRAY['视频','生成','文生视频'],      true,  2),
  ('video-generation', 'Pika Labs',  'pika-labs-intl',  '简单易用的 AI 视频生成工具，支持图生视频',                    'https://pika.art',                 NULL,                                          'Pika Labs',  ARRAY['视频','生成','图生视频'],      false, 3),
  ('video-generation', 'Luma Dream Machine', 'luma-dream-machine-intl', '高质量 AI 视频生成，支持物理真实感渲染',       'https://lumalabs.ai/dream-machine', NULL,                                         'Luma AI',    ARRAY['视频','生成','3D'],            false, 4),
  ('video-generation', 'Kling AI',   'kling-ai-intl',   '快手出品，支持高质量视频生成，已进入国际市场',                'https://klingai.com',              NULL,                                          '快手',       ARRAY['视频','生成','国际版'],        false, 5),

  -- ===== 语音合成 =====
  ('voice-synthesis', 'ElevenLabs',  'elevenlabs-intl',  '顶级 AI 语音合成平台，支持声音克隆与多语言',                 'https://elevenlabs.io',            'Starter $5/月，Creator $22/月，Pro $99/月',   'ElevenLabs', ARRAY['语音','克隆','合成'],          true,  1),
  ('voice-synthesis', 'OpenAI TTS',  'openai-tts-intl',  'OpenAI 文字转语音 API，支持 6 种音色',                       'https://platform.openai.com/docs/guides/text-to-speech', 'API 按量：$15/百万字符', 'OpenAI', ARRAY['语音','API','合成'],           false, 2),
  ('voice-synthesis', 'Murf AI',     'murf-ai-intl',     '专业 AI 配音工具，支持 120+ 种语音与多语言',                 'https://murf.ai',                  NULL,                                          'Murf AI',    ARRAY['语音','配音','多语言'],        false, 3),

  -- ===== AI 搜索 =====
  ('ai-search', 'Perplexity AI', 'perplexity-ai-search-intl', '实时联网 AI 搜索引擎，提供带来源引用的精准答案',         'https://www.perplexity.ai',        'Pro $20/月',                                  'Perplexity', ARRAY['搜索','联网','问答'],          true,  1),
  ('ai-search', 'You.com',       'you-com-intl',              'AI 搜索引擎，支持多模型切换与代码执行',                   'https://you.com',                  NULL,                                          'You.com',    ARRAY['搜索','多模型'],               false, 2),
  ('ai-search', 'Bing AI',       'bing-ai-intl',              'Microsoft 必应集成 GPT-4，支持联网搜索与图像生成',        'https://www.bing.com/chat',        NULL,                                          'Microsoft',  ARRAY['搜索','联网','GPT-4'],         false, 3),

  -- ===== 效率工具 =====
  ('ai-tools', 'Notion AI',   'notion-ai-intl',   'Notion 内置 AI 写作助手，支持文档生成、总结与翻译',              'https://www.notion.com',           'Plus $12/成员/月，Business $18/成员/月',       'Notion',     ARRAY['文档','写作','协作'],          true,  1),
  ('ai-tools', 'Grammarly',   'grammarly-intl',   '英文写作 AI 助手，支持语法纠错、风格优化与改写',                 'https://www.grammarly.com',        'Pro $12/月（年付），团队 $15/成员/月',         'Grammarly',  ARRAY['写作','英文','语法'],          false, 2),
  ('ai-tools', 'Canva AI',    'canva-ai-intl',    'Canva 集成 AI 设计工具，支持文生图、背景移除与魔法编辑',         'https://www.canva.com',            NULL,                                          'Canva',      ARRAY['设计','图像','创意'],          false, 3),
  ('ai-tools', 'Otter.ai',    'otter-ai-intl',    'AI 会议转录工具，支持实时字幕与会议摘要',                        'https://otter.ai',                 NULL,                                          'Otter.ai',   ARRAY['会议','转录','摘要'],          false, 4),
  ('ai-tools', 'Jasper AI',   'jasper-ai-intl',   '面向营销团队的 AI 内容创作平台',                                 'https://www.jasper.ai',            NULL,                                          'Jasper',     ARRAY['营销','写作','内容'],          false, 5)

) AS v(cat_slug, name, slug, description, url, pricing_info, company, tags, is_featured, sort_order)
ON c.slug = v.cat_slug
ON CONFLICT (slug) DO UPDATE SET
  description  = EXCLUDED.description,
  pricing_info = EXCLUDED.pricing_info,
  company      = EXCLUDED.company,
  tags         = EXCLUDED.tags,
  is_featured  = EXCLUDED.is_featured,
  updated_at   = now();
