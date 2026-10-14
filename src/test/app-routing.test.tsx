import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  it("registers file-based routes under the root", () => {
    expect(routeTree.children).toBeDefined();
    expect(routeTree.children && Object.keys(routeTree.children).length).toBeGreaterThan(0);
  });

  it("provides a not-found component", () => {
    expect(routeTree.options.notFoundComponent).toBeDefined();
  });
});
