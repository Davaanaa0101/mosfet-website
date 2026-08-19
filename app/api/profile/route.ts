import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

// =====================================================
// GET PROFILE
// =====================================================

export async function GET(
  request: NextRequest
) {
  try {
    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    // ---------------------------------------------------
    // NOT LOGGED IN
    // ---------------------------------------------------

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ---------------------------------------------------
    // BETTER AUTH USER
    // ---------------------------------------------------

    const user =
      session.user as typeof session.user & {
        phone?: string;
        company?: string;
        avatar?: string;
        role?: string;
      };

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({
      success: true,

      data: {
        id:
          user.id,

        name:
          user.name || "",

        email:
          user.email || "",

        phone:
          user.phone || "",

        company:
          user.company || "",

        avatar:
          user.avatar ||
          user.image ||
          "",

        role:
          user.role ||
          "user",

        emailVerified:
          user.emailVerified,

        createdAt:
          user.createdAt,
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
    // SESSION
    // ---------------------------------------------------

    const session =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ---------------------------------------------------
    // BODY
    // ---------------------------------------------------

    const body =
      await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const company =
      typeof body.company === "string"
        ? body.company.trim()
        : "";

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

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
    // UPDATE BETTER AUTH USER
    // ---------------------------------------------------

    const updated =
      await auth.api.updateUser({
        headers: request.headers,

        body: {
          name,
        },
      });

    if (!updated) {
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

    // ---------------------------------------------------
    // GET UPDATED SESSION
    // ---------------------------------------------------

    const updatedSession =
      await auth.api.getSession({
        headers: request.headers,
      });

    const user =
      updatedSession?.user as
        | (typeof session.user & {
            phone?: string;
            company?: string;
            avatar?: string;
            role?: string;
          })
        | undefined;

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Profile updated successfully",

      data: {
        id:
          user?.id ||
          session.user.id,

        name:
          user?.name ||
          name,

        email:
          user?.email ||
          session.user.email,

        phone,

        company,

        avatar:
          user?.image ||
          "",

        role:
          user?.role ||
          "user",

        emailVerified:
          user?.emailVerified ??
          session.user.emailVerified,

        createdAt:
          user?.createdAt ||
          session.user.createdAt,
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