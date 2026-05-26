/**
 * Skill Loader
 * 用于读取 Skill 文本内容
 */

import fs from "fs";
import path from "path";

/**
 * Skill 配置
 */
export interface SkillConfig {
  name: string;
  path: string;
}

/**
 * 已注册的 Skills
 */
export const SKILLS: Record<string, SkillConfig> = {
  "product-delivery": {
    name: "Product Delivery Skill",
    path: "product-delivery/SKILL.md",
  },
};

/**
 * 加载 Skill 内容
 * @param skillId Skill 标识
 * @returns Skill 文本内容
 */
export function loadSkill(skillId: string): string {
  const skill = SKILLS[skillId];
  if (!skill) {
    throw new Error(`Skill not found: ${skillId}`);
  }

  const skillPath = path.join(process.cwd(), "src/lib/skills", skill.path);

  try {
    const content = fs.readFileSync(skillPath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to load skill: ${skillId}. ${error}`);
  }
}

/**
 * 检查 Skill 是否存在
 */
export function hasSkill(skillId: string): boolean {
  return skillId in SKILLS;
}

/**
 * 获取所有 Skill 列表
 */
export function listSkills(): Array<{ id: string; name: string }> {
  return Object.entries(SKILLS).map(([id, config]) => ({
    id,
    name: config.name,
  }));
}
