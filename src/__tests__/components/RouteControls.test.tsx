import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RouteControls from "@/components/RouteControls";
import type { ActivityLog, UserSession } from "@/components/RouteActivityContext";

const mockHandleAction = vi.fn();
const mockHandleAttempt = vi.fn();
const mockHandleDelete = vi.fn();
const mockHandleToggleFlash = vi.fn();

type MockContextValue = {
  routeId: string;
  user: UserSession | null;
  routeGrade: string;
  optimisticActivity: ActivityLog[];
  isPending: boolean;
  personalNote: string;
  setPersonalNote: ReturnType<typeof vi.fn>;
  isSavingNote: boolean;
  handleSaveNote: ReturnType<typeof vi.fn>;
  handleAction: ReturnType<typeof vi.fn>;
  handleAttempt: ReturnType<typeof vi.fn>;
  handleUpdate: ReturnType<typeof vi.fn>;
  handleDelete: ReturnType<typeof vi.fn>;
  handleToggleFlash: ReturnType<typeof vi.fn>;
  handleProposeGrade: ReturnType<typeof vi.fn>;
  shareActivity: boolean;
};

const defaultContextValue: MockContextValue = {
  routeId: "test-route-id",
  user: { id: "user-1", email: "test@example.com", name: "Test User", image: null },
  routeGrade: "V4",
  optimisticActivity: [],
  isPending: false,
  personalNote: "",
  setPersonalNote: vi.fn(),
  isSavingNote: false,
  handleSaveNote: vi.fn(),
  handleAction: mockHandleAction,
  handleAttempt: mockHandleAttempt,
  handleUpdate: vi.fn(),
  handleDelete: mockHandleDelete,
  handleToggleFlash: mockHandleToggleFlash,
  handleProposeGrade: vi.fn(),
  shareActivity: true,
};

vi.mock("@/components/RouteActivityContext", () => ({
  useRouteActivityContext: () => defaultContextValue,
}));

describe("RouteControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultContextValue.optimisticActivity = [];
    defaultContextValue.isPending = false;
    defaultContextValue.user = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      image: null,
    };
  });

  describe("Initial State", () => {
    it("should render Log Send button when no sends exist", () => {
      render(<RouteControls />);
      expect(screen.getByRole("button", { name: /log send/i })).toBeInTheDocument();
    });

    it("should render Log Flash button when no flash exists", () => {
      render(<RouteControls />);
      expect(screen.getByRole("button", { name: /log flash/i })).toBeInTheDocument();
    });

    it("should render Log Attempt button when no attempts exist", () => {
      render(<RouteControls />);
      expect(screen.getByRole("button", { name: /log attempt/i })).toBeInTheDocument();
    });
  });

  describe("Send Actions", () => {
    it("should call handleAction with SEND when Log Send is clicked", async () => {
      const user = userEvent.setup();
      render(<RouteControls />);

      await user.click(screen.getByRole("button", { name: /log send/i }));
      expect(mockHandleAction).toHaveBeenCalledWith("SEND", "");
    });

    it("should show send count when sends exist", () => {
      defaultContextValue.optimisticActivity = [
        {
          id: "send-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "SEND",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("Send")).toBeInTheDocument();
    });

    it("should show increment/decrement buttons when sends exist", () => {
      defaultContextValue.optimisticActivity = [
        {
          id: "send-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "SEND",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      const buttons = screen.getAllByRole("button");
      const minusButtonExists = buttons.some((btn) => btn.querySelector("svg.lucide-minus"));
      const plusButtonExists = buttons.some((btn) => btn.querySelector("svg.lucide-plus"));
      expect(minusButtonExists || plusButtonExists).toBe(true);
    });
  });

  describe("Flash Actions", () => {
    it("should call handleToggleFlash with false when Log Flash is clicked", async () => {
      const user = userEvent.setup();
      render(<RouteControls />);

      await user.click(screen.getByRole("button", { name: /log flash/i }));
      expect(mockHandleToggleFlash).toHaveBeenCalledWith(false);
    });

    it("should show Flashed! when user has a flash", () => {
      defaultContextValue.optimisticActivity = [
        {
          id: "flash-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "FLASH",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      expect(screen.getByText("Flashed!")).toBeInTheDocument();
    });

    it("should call handleToggleFlash with true when Flashed button is clicked", async () => {
      const user = userEvent.setup();
      defaultContextValue.optimisticActivity = [
        {
          id: "flash-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "FLASH",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      await user.click(screen.getByRole("button", { name: /flashed/i }));
      expect(mockHandleToggleFlash).toHaveBeenCalledWith(true);
    });
  });

  describe("Attempt Actions", () => {
    it("should call handleAttempt when Log Attempt is clicked", async () => {
      const user = userEvent.setup();
      render(<RouteControls />);

      await user.click(screen.getByRole("button", { name: /log attempt/i }));
      expect(mockHandleAttempt).toHaveBeenCalled();
    });

    it("should show attempt count when attempts exist", () => {
      defaultContextValue.optimisticActivity = [
        {
          id: "attempt-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "ATTEMPT",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
        {
          id: "attempt-2",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "ATTEMPT",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("Attempt")).toBeInTheDocument();
    });
  });

  describe("Disabled States", () => {
    it("should disable buttons when no user is logged in", () => {
      defaultContextValue.user = null;
      render(<RouteControls />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it("should disable buttons when isPending is true", () => {
      defaultContextValue.isPending = true;
      render(<RouteControls />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe("Activity Filtering", () => {
    it("should only count activities from current user", () => {
      defaultContextValue.optimisticActivity = [
        {
          id: "send-1",
          user_id: "user-1",
          user_name: "Test User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "SEND",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
        {
          id: "send-2",
          user_id: "other-user",
          user_name: "Other User",
          user_image: null,
          route_id: "test-route-id",
          action_type: "SEND",
          content: null,
          metadata: null,
          created_at: new Date(),
        },
      ];

      render(<RouteControls />);
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });
});
