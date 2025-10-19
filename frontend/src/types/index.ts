// Core Types for Tab Nexus Application

export interface Collection {
  id: string;
  title: string;
  isExpanded: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  description?: string;
  collectionId: string;
  sortOrder: number;
  type: 'link' | 'note';
  noteContent?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastVisited?: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  createdAt: Date;
}

export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'gray';

export type ViewMode = 'grid' | 'list' | 'condensed' | 'grid-condensed';

export type SortType = 'manual' | 'title' | 'url' | 'createdAt' | 'lastVisited';

export type SortDirection = 'asc' | 'desc';

export interface AppState {
  collections: Collection[];
  tabs: Tab[];
  tags: Tag[];
  viewMode: ViewMode;
  sortType: SortType;
  sortDirection: SortDirection;
  activeFilters: {
    tags: string[];
    searchQuery: string;
  };
  theme: 'light' | 'dark' | 'system';
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
