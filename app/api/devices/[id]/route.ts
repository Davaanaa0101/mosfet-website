import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";
import Alert from "@/models/Alert";

// =====================================================
// GET DEVICE
//
// Browser/dashboard authentication:
//
// Better Auth session
//        ↓
// session.user.id
//        ↓
// device.userId
//
// Only the owner can access the device.
// =====================================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    // =================================================
    // AUTHENTICATION
    // =================================================

    const session =
      await auth.api.getSession({
        headers:
          request.headers,
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
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // PARAMETER
    // =================================================

    const { id } =
      await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device ID is required",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // FIND DEVICE
    //
    // First try deviceId.
    // IMPORTANT:
    // Ownership is included in the query.
    // =================================================

    let device =
      await Device.findOne({
        deviceId: id,

        userId:
          session.user.id,
      }).lean();

    // =================================================
    // FIND BY MONGODB _ID
    //
    // Ownership is ALSO included here.
    // =================================================

    if (!device) {
      try {
        device =
          await Device.findOne({
            _id: id,

            userId:
              session.user.id,
          }).lean();
      } catch {
        // Invalid MongoDB ObjectId.
      }
    }

    // =================================================
    // NOT FOUND / NOT OWNER
    //
    // We intentionally return the same response.
    //
    // This prevents exposing whether a device belongs
    // to another user.
    // =================================================

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device not found",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      device: {
        ...device,

        _id: String(
          device._id
        ),

        // Never expose the device API key
        // to the browser.
        apiKey:
          undefined,
      },
    });
  } catch (error) {
    console.error(
      "[device] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load device",
      },
      {
        status: 500,
      }
    );
  }
}


// =====================================================
// UPDATE DEVICE DISPLAY DETAILS
// =====================================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";

    if (!name) {
      return NextResponse.json({ success: false, error: "Device name is required" }, { status: 400 });
    }
    if (name.length > 80 || location.length > 100 || identifier.length > 80) {
      return NextResponse.json({ success: false, error: "Name, location, or identifier is too long" }, { status: 400 });
    }

    await connectDB();
    const lookup: Record<string, unknown> = { userId: session.user.id, $or: [{ deviceId: id }] };
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      (lookup.$or as Array<Record<string, unknown>>).push({ _id: id });
    }

    const device = await Device.findOneAndUpdate(
      lookup,
      { $set: { name, location, identifier, nameCustomized: true, locationCustomized: true } },
      { new: true, runValidators: true },
    ).select("-apiKey -provisioningKey").lean();

    if (!device) {
      return NextResponse.json({ success: false, error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, device: { ...device, _id: String(device._id) } });
  } catch (error) {
    console.error("[device] PATCH error:", error);
    return NextResponse.json({ success: false, error: "Failed to update device" }, { status: 500 });
  }
}

// =====================================================
// DELETE DEVICE
//
// Only the authenticated owner can delete a device.
// Telemetry history and alerts for that device are
// removed as part of the same application operation.
// =====================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Device ID is required" },
        { status: 400 }
      );
    }

    // Match either the public deviceId or MongoDB _id,
    // always constraining the query to the current owner.
    const ownershipQuery: Record<string, unknown> = {
      userId: session.user.id,
      $or: [{ deviceId: id }],
    };

    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      (ownershipQuery.$or as Array<Record<string, unknown>>).push({ _id: id });
    }

    const device = await Device.findOne(ownershipQuery).lean();
    if (!device) {
      return NextResponse.json(
        { success: false, error: "Device not found" },
        { status: 404 }
      );
    }

    // Remove dependent records before deleting the device.
    await Promise.all([
      DeviceLog.deleteMany({
        $or: [
          { deviceId: device.deviceId },
          { serialId: device.serialId },
        ],
      }),
      Alert.deleteMany({ deviceId: device.deviceId }),
    ]);

    await Device.deleteOne({
      _id: device._id,
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      message: "Device and its history were deleted successfully",
      deviceId: device.deviceId,
    });
  } catch (error) {
    console.error("[device] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete device" },
      { status: 500 }
    );
  }
}
