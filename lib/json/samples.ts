export interface SampleJson {
  id: string;
  name: string;
  description: string;
  data: any;
}

export const SAMPLE_JSONS: SampleJson[] = [
  {
    id: "users",
    name: "Users & Profiles",
    description: "Hierarchical user directory with nested addresses and profiles",
    data: {
      users: [
        {
          id: 1,
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          active: true,
          role: "admin",
          profile: {
            name: "John",
            slug: "john-doe",
            bio: "Full-stack software engineer & open source enthusiast",
            avatarUrl: "https://avatar.vercel.sh/john",
            preferences: {
              theme: "dark",
              notifications: true,
              newsletter: false,
            },
          },
          tags: ["developer", "reviewer", "lead"],
          stats: {
            repos: 42,
            followers: 1280,
            contributions: 3491,
          },
        },
        {
          id: 2,
          name: "David Smith",
          username: "davids",
          email: "david@example.com",
          active: false,
          role: "editor",
          profile: {
            name: "David",
            slug: "david-smith",
            bio: "Technical writer and API documentation specialist",
            avatarUrl: "https://avatar.vercel.sh/david",
            preferences: {
              theme: "system",
              notifications: false,
              newsletter: true,
            },
          },
          tags: ["docs", "content"],
          stats: {
            repos: 12,
            followers: 340,
            contributions: 520,
          },
        },
        {
          id: 3,
          name: "Elena Rostova",
          username: "elena_r",
          email: "elena@example.com",
          active: true,
          role: "maintainer",
          profile: {
            name: "Elena",
            slug: "elena-rostova",
            bio: "Distributed systems and cloud architecture architect",
            avatarUrl: "https://avatar.vercel.sh/elena",
            preferences: {
              theme: "dark",
              notifications: true,
              newsletter: true,
            },
          },
          tags: ["cloud", "k8s", "rust"],
          stats: {
            repos: 87,
            followers: 4920,
            contributions: 8940,
          },
        },
      ],
      meta: {
        total: 3,
        page: 1,
        perPage: 10,
        cached: true,
        timestamp: "2026-11-09T12:00:00Z",
      },
    },
  },
  {
    id: "products",
    name: "Products Catalog (Table-friendly)",
    description: "Array of structured e-commerce items ideal for Table View",
    data: [
      {
        id: "prod-101",
        title: "Mechanical Keyboard Pro",
        category: "Hardware",
        price: 149.99,
        rating: 4.8,
        inStock: true,
        inventory: 35,
        specs: { switches: "Cherry MX Brown", backlit: "RGB", wireless: true },
      },
      {
        id: "prod-102",
        title: "Ultra-Wide 4K Monitor",
        category: "Monitors",
        price: 799.0,
        rating: 4.9,
        inStock: true,
        inventory: 14,
        specs: { size: '34"', refreshRate: "144Hz", panel: "IPS" },
      },
      {
        id: "prod-103",
        title: "Ergonomic Desk Chair",
        category: "Furniture",
        price: 389.5,
        rating: 4.6,
        inStock: false,
        inventory: 0,
        specs: { material: "Mesh", lumbarSupport: true, maxWeightKg: 135 },
      },
      {
        id: "prod-104",
        title: "Noise Cancelling Headphones",
        category: "Audio",
        price: 279.0,
        rating: 4.7,
        inStock: true,
        inventory: 82,
        specs: { batteryHours: 30, bluetooth: "5.3", codec: "LDAC" },
      },
      {
        id: "prod-105",
        title: "Thunderbolt 4 Docking Station",
        category: "Accessories",
        price: 199.99,
        rating: 4.5,
        inStock: true,
        inventory: 23,
        specs: { ports: 11, powerDeliveryWatts: 96, displays: 2 },
      },
    ],
  },
  {
    id: "package",
    name: "Project Configuration",
    description: "Typical package.json with scripts, dependencies, and metadata",
    data: {
      name: "jsoncraft",
      version: "1.0.0",
      description: "Fast, modern JSON utility tool for developers",
      private: true,
      type: "module",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
      },
      dependencies: {
        "@codemirror/lang-json": "^6.0.2",
        next: "^16.0.0",
        react: "^19.0.0",
        "react-resizable-panels": "^4.21.0",
        sonner: "^2.0.0",
        zod: "^4.0.0",
      },
      keywords: ["json", "editor", "viewer", "tree", "table", "formatter"],
      author: {
        name: "Firoz (CodeFiroz)",
        url: "https://github.com/CodeFiroz",
      },
      license: "MIT",
    },
  },
];

export const DEFAULT_JSON_STRING = JSON.stringify(SAMPLE_JSONS[0].data, null, 2);

