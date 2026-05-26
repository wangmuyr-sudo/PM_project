/**
 * Project Store
 * 项目状态管理，使用 Zustand + localStorage 持久化
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Project,
  InputSource,
  ProductUnderstanding,
  FeatureTree,
  FeatureNode,
  ProductPage,
  ProductFlow,
  WireframePage,
  PlatformType,
} from "../types";

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 项目 Store 状态
 */
interface ProjectStore {
  /** 所有项目 */
  projects: Project[];
  /** 当前项目 ID */
  currentProjectId: string | null;

  // 项目管理
  createProject: (input: {
    name: string;
    platform: PlatformType;
    industry: string;
    description: string;
  }) => Project;
  updateProject: (projectId: string, patch: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setCurrentProject: (projectId: string | null) => void;
  getProject: (projectId: string) => Project | undefined;

  // 输入源管理
  addInputSource: (
    projectId: string,
    source: Omit<InputSource, "id">
  ) => InputSource;
  removeInputSource: (projectId: string, sourceId: string) => void;

  // 产品理解
  setProductUnderstanding: (
    projectId: string,
    data: ProductUnderstanding
  ) => void;

  // 功能结构图
  setFeatureTree: (projectId: string, data: FeatureTree) => void;
  updateFeatureNode: (
    projectId: string,
    nodeId: string,
    patch: Partial<FeatureNode>
  ) => void;
  addFeatureNode: (
    projectId: string,
    parentNodeId: string | null,
    node: Omit<FeatureNode, "id">
  ) => FeatureNode;
  removeFeatureNode: (projectId: string, nodeId: string) => void;
  answerQuestion: (
    projectId: string,
    nodeId: string,
    questionId: string,
    answer: string
  ) => void;

  // 页面清单
  setPageList: (projectId: string, pages: ProductPage[]) => void;
  updatePage: (
    projectId: string,
    pageId: string,
    patch: Partial<ProductPage>
  ) => void;

  // 流程
  setFlows: (projectId: string, flows: ProductFlow[]) => void;

  // 线框图
  setWireframes: (projectId: string, wireframes: WireframePage[]) => void;

  // PRD
  setPRD: (projectId: string, prd: string) => void;

  // 研发说明
  setDevHandoff: (projectId: string, handoff: string) => void;

  // 导出
  exportProjectJSON: (projectId: string) => string | null;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      // ========== 项目管理 ==========

      createProject: (input) => {
        const newProject: Project = {
          id: generateId(),
          name: input.name,
          platform: input.platform,
          industry: input.industry,
          description: input.description,
          inputSources: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: newProject.id,
        }));

        return newProject;
      },

      updateProject: (projectId, patch) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, ...patch, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
          currentProjectId:
            state.currentProjectId === projectId ? null : state.currentProjectId,
        }));
      },

      setCurrentProject: (projectId) => {
        set({ currentProjectId: projectId });
      },

      getProject: (projectId) => {
        return get().projects.find((p) => p.id === projectId);
      },

      // ========== 输入源管理 ==========

      addInputSource: (projectId, source) => {
        const newSource: InputSource = {
          id: generateId(),
          ...source,
        };

        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  inputSources: [...p.inputSources, newSource],
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));

        return newSource;
      },

      removeInputSource: (projectId, sourceId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  inputSources: p.inputSources.filter((s) => s.id !== sourceId),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 产品理解 ==========

      setProductUnderstanding: (projectId, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  productUnderstanding: data,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 功能结构图 ==========

      setFeatureTree: (projectId, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  featureTree: data,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateFeatureNode: (projectId, nodeId, patch) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId || !p.featureTree) return p;

            const updateNodes = (nodes: FeatureNode[]): FeatureNode[] => {
              return nodes.map((node) => {
                if (node.id === nodeId) {
                  return { ...node, ...patch };
                }
                if (node.children) {
                  return {
                    ...node,
                    children: updateNodes(node.children),
                  };
                }
                return node;
              });
            };

            return {
              ...p,
              featureTree: {
                ...p.featureTree,
                nodes: updateNodes(p.featureTree.nodes),
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addFeatureNode: (projectId, parentNodeId, nodeInput) => {
        const newNode: FeatureNode = {
          id: generateId(),
          ...nodeInput,
        };

        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId || !p.featureTree) return p;

            if (parentNodeId === null) {
              // 添加到根节点
              return {
                ...p,
                featureTree: {
                  ...p.featureTree,
                  nodes: [...p.featureTree.nodes, newNode],
                },
                updatedAt: new Date().toISOString(),
              };
            }

            // 添加到指定父节点下
            const addToParent = (nodes: FeatureNode[]): FeatureNode[] => {
              return nodes.map((node) => {
                if (node.id === parentNodeId) {
                  return {
                    ...node,
                    children: [...(node.children || []), newNode],
                  };
                }
                if (node.children) {
                  return {
                    ...node,
                    children: addToParent(node.children),
                  };
                }
                return node;
              });
            };

            return {
              ...p,
              featureTree: {
                ...p.featureTree,
                nodes: addToParent(p.featureTree.nodes),
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));

        return newNode;
      },

      removeFeatureNode: (projectId, nodeId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId || !p.featureTree) return p;

            const removeNode = (nodes: FeatureNode[]): FeatureNode[] => {
              return nodes
                .filter((node) => node.id !== nodeId)
                .map((node) => {
                  if (node.children) {
                    return {
                      ...node,
                      children: removeNode(node.children),
                    };
                  }
                  return node;
                });
            };

            return {
              ...p,
              featureTree: {
                ...p.featureTree,
                nodes: removeNode(p.featureTree.nodes),
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      answerQuestion: (projectId, nodeId, questionId, answer) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId || !p.featureTree) return p;

            const updateNodes = (nodes: FeatureNode[]): FeatureNode[] => {
              return nodes.map((node) => {
                if (node.id === nodeId && node.questions) {
                  return {
                    ...node,
                    questions: node.questions.map((q) =>
                      q.id === questionId ? { ...q, answer } : q
                    ),
                  };
                }
                if (node.children) {
                  return {
                    ...node,
                    children: updateNodes(node.children),
                  };
                }
                return node;
              });
            };

            return {
              ...p,
              featureTree: {
                ...p.featureTree,
                nodes: updateNodes(p.featureTree.nodes),
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      // ========== 页面清单 ==========

      setPageList: (projectId, pages) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  pageList: pages,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updatePage: (projectId, pageId, patch) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId && p.pageList
              ? {
                  ...p,
                  pageList: p.pageList.map((page) =>
                    page.id === pageId ? { ...page, ...patch } : page
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 流程 ==========

      setFlows: (projectId, flows) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  flows,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 线框图 ==========

      setWireframes: (projectId, wireframes) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  wireframes,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== PRD ==========

      setPRD: (projectId, prd) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  prd,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 研发说明 ==========

      setDevHandoff: (projectId, handoff) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  devHandoff: handoff,
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      // ========== 导出 ==========

      exportProjectJSON: (projectId) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) return null;
        return JSON.stringify(project, null, 2);
      },
    }),
    {
      name: "ai-product-delivery-projects",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
      }),
    }
  )
);

/**
 * 根据 projectId 获取项目
 */
export function useProjectById(projectId: string): Project | undefined {
  const projects = useProjectStore((state) => state.projects);
  return projects.find((p) => p.id === projectId);
}

/**
 * 获取当前项目
 */
export function useCurrentProject(): Project | undefined {
  const { projects, currentProjectId } = useProjectStore();
  return projects.find((p) => p.id === currentProjectId);
}

/**
 * 获取项目列表
 */
export function useProjects(): Project[] {
  return useProjectStore((state) => state.projects);
}
