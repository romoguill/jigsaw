import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_admin/detail-test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <svg width="447" height="447" viewBox="844 -10 447 447">
      <path
        d="M 854 0 L 1281 0 C 1283 54 1280 127 1281 171 S 1365 161 1366 171 S 1369 242 1366 256 S 1286 215 1281 256 S 1301 374 1281 427 C 1242 369 1159 419 1110 427 S 1103 352 1110 342 S 1032 332 1025 342 S 1058 416 1025 427 S 913 458 854 427 C 882 373 840 302 854 256 S 770 268 769 256 S 758 167 769 171 S 864 211 854 171 S 859 54 854 0 Z"
        fill="white"
      />
    </svg>
  );
}
