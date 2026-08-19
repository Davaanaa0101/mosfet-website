import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

// =====================================================
// TYPES
// =====================================================

type ProfileUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date;

  phone?: string;
  company?: string;
  avatar?: string;
  role?: string;
};

// =====================================================
// GET PROFILE
// =====================================================

export async function GET(
  request: NextRequest
) {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

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

    // =================================================
    // USER
    // =================================================

    const user =
      session.user as ProfileUser;

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      data: {
        id: user.id,

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
          user.emailVerified ??
          false,

        createdAt:
          user.createdAt ||
          null,
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
    // =================================================
    // AUTHENTICATION
    // =================================================

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

    // =================================================
    // REQUEST BODY
    // =================================================

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid JSON body",
        },
        {
          status: 400,
        }
      );
    }

    const data =
      body as Record<
        string,
        unknown
      >;

    // =================================================
    // VALUES
    // =================================================

    const name =
      typeof data.name ===
      "string"
        ? data.name.trim()
        : "";

    const phone =
      typeof data.phone ===
      "string"
        ? data.phone.trim()
        : "";

    const company =
      typeof data.company ===
      "string"
        ? data.company.trim()
        : "";

    // =================================================
    // VALIDATION
    // =================================================

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

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Phone number cannot exceed 30 characters",
        },
        {
          status: 400,
        }
      );
    }

    if (company.length > 150) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company name cannot exceed 150 characters",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // UPDATE BETTER AUTH USER
    // =================================================
    //
    // At the moment Better Auth's generated API type
    // only accepts the standard user fields here.
    //
    // Therefore name is updated through Better Auth.
    //
    // Phone/company will be handled separately once
    // their additional-field storage is connected.
    // =================================================

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

    // =================================================
    // GET UPDATED SESSION
    // =================================================

    const updatedSession =
      await auth.api.getSession({
        headers: request.headers,
      });

    if (!updatedSession?.user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Profile updated but session could not be refreshed",
        },
        {
          status: 500,
        }
      );
    }

    const user =
      updatedSession.user as ProfileUser;

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Profile updated successfully",

      data: {
        id:
          user.id,

        name:
          user.name || "",

        email:
          user.email || "",

        phone,

        company,

        avatar:
          user.avatar ||
          user.image ||
          "",

        role:
          user.role ||
          "user",

        emailVerified:
          user.emailVerified ??
          false,

        createdAt:
          user.createdAt ||
          null,
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