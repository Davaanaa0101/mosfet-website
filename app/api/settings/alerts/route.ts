import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@/lib/auth";

import { connectDB } from "@/lib/mongodb";
import AlertSettings from "@/models/AlertSettings";

const DEFAULT_SETTINGS = {
  highTemperatureEnabled: true,
  highTemperature: 30,

  lowTemperatureEnabled: true,
  lowTemperature: 0,

  highHumidityEnabled: true,
  highHumidity: 80,

  lowHumidityEnabled: true,
  lowHumidity: 20,

  highCurrentEnabled: true,
  highCurrent: 10,

  lowRssiEnabled: true,
  lowRssi: -80,

  deviceOfflineEnabled: true,
  deviceOfflineSeconds: 30,
};

// =====================================================
// GET
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
    // DATABASE
    // =================================================

    await connectDB();

    let settings =
      await AlertSettings.findOne().lean();

    // =================================================
    // CREATE DEFAULT SETTINGS
    // =================================================

    if (!settings) {
      const created =
        await AlertSettings.create(
          DEFAULT_SETTINGS
        );

      settings =
        created.toObject();
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(
      "[alert-settings] GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load alert settings",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// PUT
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
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await request.json();

    // =================================================
    // BUILD UPDATES
    // =================================================

    const updates = {
      highTemperatureEnabled:
        Boolean(
          body.highTemperatureEnabled
        ),

      highTemperature:
        Number(
          body.highTemperature
        ),

      lowTemperatureEnabled:
        Boolean(
          body.lowTemperatureEnabled
        ),

      lowTemperature:
        Number(
          body.lowTemperature
        ),

      highHumidityEnabled:
        Boolean(
          body.highHumidityEnabled
        ),

      highHumidity:
        Number(
          body.highHumidity
        ),

      lowHumidityEnabled:
        Boolean(
          body.lowHumidityEnabled
        ),

      lowHumidity:
        Number(
          body.lowHumidity
        ),

      highCurrentEnabled:
        Boolean(
          body.highCurrentEnabled
        ),

      highCurrent:
        Number(
          body.highCurrent
        ),

      lowRssiEnabled:
        Boolean(
          body.lowRssiEnabled
        ),

      lowRssi:
        Number(
          body.lowRssi
        ),

      deviceOfflineEnabled:
        Boolean(
          body.deviceOfflineEnabled
        ),

      deviceOfflineSeconds:
        Number(
          body.deviceOfflineSeconds
        ),
    };

    // =================================================
    // VALIDATE NUMBERS
    // =================================================

    const numericValues = [
      updates.highTemperature,
      updates.lowTemperature,
      updates.highHumidity,
      updates.lowHumidity,
      updates.highCurrent,
      updates.lowRssi,
      updates.deviceOfflineSeconds,
    ];

    if (
      numericValues.some(
        (value) =>
          !Number.isFinite(
            value
          )
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "All threshold values must be valid numbers",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // VALIDATE OFFLINE TIME
    // =================================================

    if (
      updates.deviceOfflineSeconds <
      5
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device offline timeout must be at least 5 seconds",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // UPDATE
    // =================================================

    const settings =
      await AlertSettings.findOneAndUpdate(
        {},
        {
          $set: updates,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).lean();

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Alert settings saved",

      data: settings,
    });
  } catch (error) {
    console.error(
      "[alert-settings] PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to save alert settings",
      },
      {
        status: 500,
      }
    );
  }
}