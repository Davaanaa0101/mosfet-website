import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";

export async function PATCH(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Alert ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const alert =
      await Alert.findByIdAndUpdate(
        id,
        {
          status: "resolved",
          resolvedAt:
            new Date(),
        },
        {
          new: true,
        }
      ).lean();

    if (!alert) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Alert not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    console.error(
      "[alerts] PATCH error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to resolve alert",
      },
      {
        status: 500,
      }
    );
  }
}