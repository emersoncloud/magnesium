import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteBrowser from "@/components/RouteBrowser";
import type { BrowserRoute } from "@/app/actions";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/constants/walls", () => ({
  WALLS: [
    { id: "zone-1", name: "Zone 1" },
    { id: "zone-2", name: "Zone 2" },
    { id: "zone-3", name: "Zone 3" },
  ],
  GRADES: ["VB", "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "V10"],
}));

const createMockRoute = (overrides: Partial<BrowserRoute> = {}): BrowserRoute => ({
  id: "route-1",
  wall_id: "zone-1",
  grade: "V4",
  color: "Blue",
  setter_name: "Test Setter",
  set_date: "2024-01-15",
  attributes: [],
  difficulty_label: null,
  style: "Dynamic",
  hold_type: "Crimps",
  avg_rating: 4.2,
  comment_count: 5,
  user_status: null,
  ...overrides,
});

describe("RouteBrowser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render routes in a table", () => {
      const routes = [
        createMockRoute({ id: "r1", grade: "V4" }),
        createMockRoute({ id: "r2", grade: "V6" }),
      ];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("V4")).toBeInTheDocument();
      expect(screen.getByText("V6")).toBeInTheDocument();
    });

    it("should display route count", () => {
      const routes = [
        createMockRoute({ id: "r1" }),
        createMockRoute({ id: "r2" }),
        createMockRoute({ id: "r3" }),
      ];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("3 routes found")).toBeInTheDocument();
    });

    it("should display route properties correctly", () => {
      const routes = [
        createMockRoute({
          color: "Red",
          setter_name: "John",
          style: "Overhang",
          hold_type: "Jugs",
        }),
      ];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("Red")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Overhang")).toBeInTheDocument();
      expect(screen.getByText("Jugs")).toBeInTheDocument();
    });

    it("should display wall name from WALLS constant", () => {
      const routes = [createMockRoute({ wall_id: "zone-2" })];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("Zone 2")).toBeInTheDocument();
    });

    it("should show empty message when no routes match filters", () => {
      render(<RouteBrowser routes={[]} />);

      expect(screen.getByText("No routes found matching filters.")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should navigate to route detail on row click", async () => {
      const user = userEvent.setup();
      const routes = [createMockRoute({ id: "route-123" })];

      render(<RouteBrowser routes={routes} />);

      const row = screen.getByRole("row", { name: /V4/i });
      await user.click(row);

      expect(mockPush).toHaveBeenCalledWith("/route/route-123");
    });

    it("should call onSelect callback instead of navigating when provided", async () => {
      const user = userEvent.setup();
      const onSelectMock = vi.fn();
      const routes = [createMockRoute({ id: "route-123" })];

      render(<RouteBrowser routes={routes} onSelect={onSelectMock} />);

      const row = screen.getByRole("row", { name: /V4/i });
      await user.click(row);

      expect(onSelectMock).toHaveBeenCalledWith(routes[0]);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Status Icons", () => {
    it("should show check icon for SEND status", () => {
      const routes = [createMockRoute({ user_status: "SEND" })];

      render(<RouteBrowser routes={routes} />);

      const greenIcon = document.querySelector(".bg-green-100");
      expect(greenIcon).toBeInTheDocument();
    });

    it("should show flash icon for FLASH status", () => {
      const routes = [createMockRoute({ user_status: "FLASH" })];

      render(<RouteBrowser routes={routes} />);

      const yellowIcon = document.querySelector(".bg-yellow-100");
      expect(yellowIcon).toBeInTheDocument();
    });

    it("should show no status icon for unattempted routes", () => {
      const routes = [createMockRoute({ user_status: null })];

      render(<RouteBrowser routes={routes} />);

      const greenIcon = document.querySelector(".bg-green-100");
      const yellowIcon = document.querySelector(".bg-yellow-100");
      expect(greenIcon).not.toBeInTheDocument();
      expect(yellowIcon).not.toBeInTheDocument();
    });
  });

  describe("Ratings", () => {
    it("should display rating when avg_rating > 0", () => {
      const routes = [createMockRoute({ avg_rating: 4.5 })];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("4.5")).toBeInTheDocument();
    });

    it("should display dash when avg_rating is 0", () => {
      const routes = [createMockRoute({ avg_rating: 0 })];

      render(<RouteBrowser routes={routes} />);

      const cells = screen.getAllByRole("cell");
      const ratingCell = cells.find((cell) => cell.textContent === "-");
      expect(ratingCell).toBeInTheDocument();
    });
  });

  describe("Comments", () => {
    it("should display comment count", () => {
      const routes = [createMockRoute({ comment_count: 10 })];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("Filtering", () => {
    it("should exclude routes by excludeRouteIds", () => {
      const routes = [
        createMockRoute({ id: "route-1", grade: "V4" }),
        createMockRoute({ id: "route-2", grade: "V5" }),
        createMockRoute({ id: "route-3", grade: "V6" }),
      ];
      const excludeIds = new Set(["route-2"]);

      render(<RouteBrowser routes={routes} excludeRouteIds={excludeIds} />);

      expect(screen.getByText("V4")).toBeInTheDocument();
      expect(screen.queryByText("V5")).not.toBeInTheDocument();
      expect(screen.getByText("V6")).toBeInTheDocument();
      expect(screen.getByText("2 routes found")).toBeInTheDocument();
    });
  });

  describe("Sorting Headers", () => {
    it("should render sortable column headers", () => {
      const routes = [createMockRoute()];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("Grade")).toBeInTheDocument();
      expect(screen.getByText("Color")).toBeInTheDocument();
      expect(screen.getByText("Wall")).toBeInTheDocument();
      expect(screen.getByText("Style")).toBeInTheDocument();
      expect(screen.getByText("Holds")).toBeInTheDocument();
      expect(screen.getByText("Rating")).toBeInTheDocument();
      expect(screen.getByText("Comments")).toBeInTheDocument();
      expect(screen.getByText("Setter")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
    });

    it("should update URL params when clicking sort header", async () => {
      const user = userEvent.setup();
      const routes = [createMockRoute()];

      render(<RouteBrowser routes={routes} />);

      const gradeHeader = screen.getByText("Grade");
      await user.click(gradeHeader);

      expect(mockReplace).toHaveBeenCalled();
    });
  });

  describe("Filter Controls", () => {
    it("should render filter section with Filters header", () => {
      const routes = [createMockRoute()];

      render(<RouteBrowser routes={routes} />);

      expect(screen.getByText("Filters")).toBeInTheDocument();
    });
  });
});
