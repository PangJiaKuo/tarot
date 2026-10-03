# Mystic Tarot · 神秘塔罗

纯程序化生成的 3D 塔罗占卜 Web 应用：Vite + React 18 + TypeScript + Three.js（@react-three/fiber / drei / postprocessing）+ GSAP + Zustand。所有视觉与音频均为程序生成，无任何外部图片/音频资源。

## 运行

```bash
npm install
npm run dev      # 开发
npm run build    # 构建（tsc -b && vite build）
npm run preview  # 预览构建产物
```

可选 AI 深度解读：复制 `.env.example` 为 `.env.local` 并填写 OpenAI 兼容接口信息；未配置时自动回退本地规则解读。

## 流程

加载页 → 进入圣殿 → 选择牌阵（单张指引 / 时间之流 / 二选一）→ 输入问题（可选）→ 洗牌 → 抽牌 → 点击卡牌翻转 → 查看解读（逐字显示 + 自动保存历史）→ 再占一次。

## 特性

- 78 张完整塔罗（22 大阿卡纳 + 56 小阿卡纳），每张随机 50% 正逆位
- 星空 / 星云 / 漂浮符文 / 卡牌纹理全部 Canvas 程序生成
- Web Audio 合成音效：环境低鸣、洗牌沙沙、翻牌钟声、抽牌滑音
- 后处理 Bloom + Vignette + Noise，翻牌时 Bloom 脉冲与镜头微震
- 移动端自动降粒子与后处理；支持 prefers-reduced-motion
- 历史记录 localStorage 持久化（最多 50 条），可删除/清空

> 塔罗解读仅供娱乐与自我探索，不构成医疗、投资或法律建议。
