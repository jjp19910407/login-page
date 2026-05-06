import { db } from "./index"
import { regions, categories } from "./schema"

async function seed() {
  console.log("开始写入初始数据...")

  // 插入大分类
  const [domestic, international] = await db
    .insert(regions)
    .values([
      { name: "国内", slug: "domestic", sortOrder: 1 },
      { name: "国外", slug: "international", sortOrder: 2 },
    ])
    .returning()

  console.log("大分类写入完成")

  const categoryDefs = [
    { name: "图片生成", slug: "image-generation", type: "image_generation" as const, sortOrder: 1 },
    { name: "音乐生成", slug: "music-generation", type: "music_generation" as const, sortOrder: 2 },
    { name: "AI 编程", slug: "ai-coding", type: "ai_coding" as const, sortOrder: 3 },
    { name: "Chat 聊天", slug: "chat", type: "chat" as const, sortOrder: 4 },
    { name: "中转站", slug: "relay-station", type: "relay_station" as const, sortOrder: 5 },
    { name: "AI 工具", slug: "ai-tools", type: "ai_tools" as const, sortOrder: 6 },
    { name: "其他", slug: "other", type: "other" as const, sortOrder: 7 },
  ]

  // 国内分类
  await db.insert(categories).values(
    categoryDefs.map((c) => ({ ...c, regionId: domestic.id }))
  )

  // 国外分类
  await db.insert(categories).values(
    categoryDefs.map((c) => ({ ...c, regionId: international.id }))
  )

  console.log("子分类写入完成")
  console.log("初始数据写入完成！")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
