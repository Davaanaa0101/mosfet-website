import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// =====================================================
// GET PROFILE
// =====================================================

export async function GET(
  _request: NextRequest
) {
  try {
    // ---------------------------------------------------
    // GET BETTER AUTH SESSION
    // ---------------------------------------------------

    const session =
      await auth.api.getSession({
        headers:
          _request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ---------------------------------------------------
    // DATABASE
    // ---------------------------------------------------

    await connectDB();

    // ---------------------------------------------------
    // FIND APPLICATION USER
    // ---------------------------------------------------

    const user =
      await User.findOne({
        email:
          session.user.email,
      }).lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User profile not found",
        },
        {
          status: 404,
        }
      );
    }

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({
      success: true,

      data: {
        name:
          user.name || "",

        email:
          user.email || "",

        role:
          user.role || "customer",

        phone:
          user.phone || "",

        company:
          user.company || "",

        avatar:
          user.avatar || "",
      },
    });
  } catch (error) {
    console.error(
      "[profile] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load profile",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export async function PUT(
  request: NextRequest
) {
  try {
    // ---------------------------------------------------
    // GET BETTER AUTH SESSION
    // ---------------------------------------------------

    const session =
      await auth.api.getSession({
        headers:
          request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ---------------------------------------------------
    // DATABASE
    // ---------------------------------------------------

    await connectDB();

    // ---------------------------------------------------
    // READ BODY
    // ---------------------------------------------------

    const body =
      await request.json();

    // ---------------------------------------------------
    // VALIDATE NAME
    // ---------------------------------------------------

    const name =
      typeof body.name ===
      "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Name cannot exceed 100 characters",
        },
        {
          status: 400,
        }
      );
    }

    // ---------------------------------------------------
    // FIND USER
    // ---------------------------------------------------

    const user =
      await User.findOne({
        email:
          session.user.email,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User profile not found",
        },
        {
          status: 404,
        }
      );
    }

    // ---------------------------------------------------
    // UPDATE
    // ---------------------------------------------------

    user.name =
      name;

    await user.save();

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Profile updated successfully",

      data: {
        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        phone:
          user.phone || "",

        company:
          user.company || "",

        avatar:
          user.avatar || "",
      },
    });
  } catch (error) {
    console.error(
      "[profile] PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}