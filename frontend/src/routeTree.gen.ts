/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as GameImport } from './routes/game'
import { Route as IndexImport } from './routes/index'
import { Route as AdminAdminImport } from './routes/admin/_admin'
import { Route as AdminAdminIndexImport } from './routes/admin/_admin/index'
import { Route as AdminAdminPathsImport } from './routes/admin/_admin/paths'

// Create Virtual Routes

const AdminImport = createFileRoute('/admin')()

// Create/Update Routes

const AdminRoute = AdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const GameRoute = GameImport.update({
  id: '/game',
  path: '/game',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminAdminRoute = AdminAdminImport.update({
  id: '/_admin',
  getParentRoute: () => AdminRoute,
} as any)

const AdminAdminIndexRoute = AdminAdminIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminPathsRoute = AdminAdminPathsImport.update({
  id: '/paths',
  path: '/paths',
  getParentRoute: () => AdminAdminRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/game': {
      id: '/game'
      path: '/game'
      fullPath: '/game'
      preLoaderRoute: typeof GameImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/admin/_admin': {
      id: '/admin/_admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminAdminImport
      parentRoute: typeof AdminRoute
    }
    '/admin/_admin/paths': {
      id: '/admin/_admin/paths'
      path: '/paths'
      fullPath: '/admin/paths'
      preLoaderRoute: typeof AdminAdminPathsImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/': {
      id: '/admin/_admin/'
      path: '/'
      fullPath: '/admin/'
      preLoaderRoute: typeof AdminAdminIndexImport
      parentRoute: typeof AdminAdminImport
    }
  }
}

// Create and export the route tree

interface AdminAdminRouteChildren {
  AdminAdminPathsRoute: typeof AdminAdminPathsRoute
  AdminAdminIndexRoute: typeof AdminAdminIndexRoute
}

const AdminAdminRouteChildren: AdminAdminRouteChildren = {
  AdminAdminPathsRoute: AdminAdminPathsRoute,
  AdminAdminIndexRoute: AdminAdminIndexRoute,
}

const AdminAdminRouteWithChildren = AdminAdminRoute._addFileChildren(
  AdminAdminRouteChildren,
)

interface AdminRouteChildren {
  AdminAdminRoute: typeof AdminAdminRouteWithChildren
}

const AdminRouteChildren: AdminRouteChildren = {
  AdminAdminRoute: AdminAdminRouteWithChildren,
}

const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/game': typeof GameRoute
  '/admin': typeof AdminAdminRouteWithChildren
  '/admin/paths': typeof AdminAdminPathsRoute
  '/admin/': typeof AdminAdminIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/game': typeof GameRoute
  '/admin': typeof AdminAdminIndexRoute
  '/admin/paths': typeof AdminAdminPathsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/game': typeof GameRoute
  '/admin': typeof AdminRouteWithChildren
  '/admin/_admin': typeof AdminAdminRouteWithChildren
  '/admin/_admin/paths': typeof AdminAdminPathsRoute
  '/admin/_admin/': typeof AdminAdminIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/game' | '/admin' | '/admin/paths' | '/admin/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/game' | '/admin' | '/admin/paths'
  id:
    | '__root__'
    | '/'
    | '/game'
    | '/admin'
    | '/admin/_admin'
    | '/admin/_admin/paths'
    | '/admin/_admin/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  GameRoute: typeof GameRoute
  AdminRoute: typeof AdminRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  GameRoute: GameRoute,
  AdminRoute: AdminRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/game",
        "/admin"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/game": {
      "filePath": "game.tsx"
    },
    "/admin": {
      "filePath": "admin",
      "children": [
        "/admin/_admin"
      ]
    },
    "/admin/_admin": {
      "filePath": "admin/_admin.tsx",
      "parent": "/admin",
      "children": [
        "/admin/_admin/paths",
        "/admin/_admin/"
      ]
    },
    "/admin/_admin/paths": {
      "filePath": "admin/_admin/paths.tsx",
      "parent": "/admin/_admin"
    },
    "/admin/_admin/": {
      "filePath": "admin/_admin/index.tsx",
      "parent": "/admin/_admin"
    }
  }
}
ROUTE_MANIFEST_END */
