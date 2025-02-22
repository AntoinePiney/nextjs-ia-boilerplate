# Backend Structure

## File System

### Asset Organization

```
public/
├── [asset-type-1]/
│   ├── [subcategory-1]/
│   │   ├── [item1].[ext]
│   │   └── [item2].[ext]
│   └── [subcategory-2]/
└── [project-type]/
    ├── [resource-1]/
    ├── [resource-2]/
    ├── [resource-3]/
    ├── [resource-4]/
    └── [resource-5]/
```

## Data Management

### Base Types

```typescript
interface Asset {
  path: string;
  type: '[asset-type]';
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

interface [MainEntity] {
  id: string;
  title: string;
  description: string;
  slug: string;
  [custom_field]: [type];
  assets: {
    [asset_type]?: Record<string, Asset>;
  };
}
```

## API Routes

### Endpoints

```typescript
// API Routes
/api/[resource] / // Resource list
  api /
  [resource] /
  [id] / // Resource details
  api /
  [type] /
  [action]; // Type actions
```

## Asset Management

### Helpers

```typescript
// utils/assets.ts
export const assetLoader = {
  [assetType1]: async (src: string) => {
    return new Promise((resolve, reject) => {
      // Asset loading logic
    });
  },

  [assetType2]: async (src: string) => {
    return new Promise((resolve, reject) => {
      // Asset loading logic
    });
  },
};
```

### Optimization

- [Optimization technique 1]
- [Optimization technique 2]
- [Optimization technique 3]
- [Optimization technique 4]

## Security

### Asset Protection

- [Security measure 1]
- [Security measure 2]
- [Security measure 3]

### Headers

```typescript
// next.config.js
{
  async headers() {
    return [
      {
        source: '[path-pattern]',
        headers: [
          {
            key: '[header-name]',
            value: '[header-value]'
          }
        ]
      }
    ];
  }
}
```

## Caching

### Strategies

1. Static Assets

   - [Cache policy]
   - [Cache duration]
   - [Cache invalidation]

2. Dynamic Data
   - [Cache strategy]
   - [Update policy]
   - [Cache management]
