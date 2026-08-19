import {
  NextRequest,
  NextResponse,
} from "next/server";

import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import Device from "@/models/Device";
import DeviceLog from "@/models/DeviceLog";
import Alert, {
  AlertType,
} from "@/models/Alert";
import AlertSettings from "@/models/AlertSettings";

// =====================================================
// ALERT TYPES
// =====================================================

const ALERT_TYPES = [
  "DEVICE_OFFLINE",
  "HIGH_TEMPERATURE",
  "LOW_TEMPERATURE",
  "HIGH_HUMIDITY",
  "LOW_HUMIDITY",
  "HIGH_CURRENT",
  "LOW_RSSI",
] as const;

// =====================================================
// TYPES
// =====================================================

interface IncomingSensor {
  slot: number;
  type: string;
  value?: number | null;
}

interface SensorConfig {
  slot: number;
  type: string;
  name?: string;
  unit?: string;
}

// =====================================================
// ALERT TYPE CHECK
// =====================================================

function isAlertType(
  value: string
): value is AlertType {
  return ALERT_TYPES.includes(
    value as AlertType
  );
}

// =====================================================
// API KEY COMPARISON
// =====================================================

function safeEqual(
  a: string,
  b: string
): boolean {
  const aBuffer =
    Buffer.from(a);

  const bBuffer =
    Buffer.from(b);

  if (
    aBuffer.length !==
    bBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}

// =====================================================
// POST TELEMETRY
// =====================================================

export async function POST(
  req: NextRequest
) {
  try {
    // =================================================
    // DEVICE API KEY AUTHENTICATION
    // =================================================

    const authorization =
      req.headers.get(
        "authorization"
      );

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device API key is required",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid authorization format",
        },
        {
          status: 401,
        }
      );
    }

    const apiKey =
      authorization
        .slice(7)
        .trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device API key is required",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // READ BODY
    // =================================================

    const body =
      await req.json();

    const {
      deviceId,
      name,
      type,
      location,
      macAddress,
      firmware,
      ipAddress,
      wifiSSID,

      temperature,
      humidity,
      voltage,
      current,
      power,
      energy,

      rssi,
      freeHeap,
      uptime,

      sensors,
    } = body;

    // =================================================
    // VALIDATE DEVICE ID
    // =================================================

    if (
      !deviceId ||
      typeof deviceId !==
        "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceId is required",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedDeviceId =
      deviceId.trim();

    if (
      !normalizedDeviceId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "deviceId cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // DATABASE
    // =================================================

    await connectDB();

    // =================================================
    // FIND DEVICE
    //
    // IMPORTANT:
    // Devices must already exist and have an API key.
    // =================================================

    const device =
      await Device.findOne({
        deviceId:
          normalizedDeviceId,
      });

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Device not found. Register the device first.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // VERIFY DEVICE API KEY
    // =================================================

    if (
      !device.apiKey ||
      !safeEqual(
        apiKey,
        device.apiKey
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid device API key",
        },
        {
          status: 401,
        }
      );
    }

    // =================================================
    // LOAD ALERT SETTINGS
    //
    // Settings are stored in MongoDB.
    // If no settings exist yet, use safe defaults.
    // =================================================

    const alertSettings =
      await AlertSettings.findOne()
        .lean();

    const settings = {
      highTemperatureEnabled:
        alertSettings?.highTemperatureEnabled ??
        true,

      highTemperature:
        typeof alertSettings?.highTemperature ===
        "number"
          ? alertSettings.highTemperature
          : 30,

      lowTemperatureEnabled:
        alertSettings?.lowTemperatureEnabled ??
        true,

      lowTemperature:
        typeof alertSettings?.lowTemperature ===
        "number"
          ? alertSettings.lowTemperature
          : 0,

      highHumidityEnabled:
        alertSettings?.highHumidityEnabled ??
        true,

      highHumidity:
        typeof alertSettings?.highHumidity ===
        "number"
          ? alertSettings.highHumidity
          : 80,

      lowHumidityEnabled:
        alertSettings?.lowHumidityEnabled ??
        true,

      lowHumidity:
        typeof alertSettings?.lowHumidity ===
        "number"
          ? alertSettings.lowHumidity
          : 20,

      highCurrentEnabled:
        alertSettings?.highCurrentEnabled ??
        true,

      highCurrent:
        typeof alertSettings?.highCurrent ===
        "number"
          ? alertSettings.highCurrent
          : 10,

      lowRssiEnabled:
        alertSettings?.lowRssiEnabled ??
        true,

      lowRssi:
        typeof alertSettings?.lowRssi ===
        "number"
          ? alertSettings.lowRssi
          : -80,

      deviceOfflineEnabled:
        alertSettings?.deviceOfflineEnabled ??
        true,

      deviceOfflineSeconds:
        typeof alertSettings?.deviceOfflineSeconds ===
        "number"
          ? alertSettings.deviceOfflineSeconds
          : 30,
    };

    // =================================================
    // DEVICE TYPES
    // =================================================

    const deviceTypes = [
      "esp32",
      "plc",
      "modbus",
      "camera",
    ] as const;

    type DeviceType =
      (typeof deviceTypes)[number];

    const normalizedType: DeviceType =
      typeof type ===
        "string" &&
      deviceTypes.includes(
        type
          .trim()
          .toLowerCase() as DeviceType
      )
        ? (type
            .trim()
            .toLowerCase() as DeviceType)
        : "esp32";

    // =================================================
    // UPDATE DEVICE
    // =================================================

    device.status =
      "online";

    device.lastSeen =
      new Date();

    if (
      typeof name ===
        "string" &&
      name.trim()
    ) {
      device.name =
        name.trim();
    }

    device.type =
      normalizedType;

    if (
      typeof location ===
        "string" &&
      location.trim()
    ) {
      device.location =
        location.trim();
    }

    if (
      typeof macAddress ===
        "string" &&
      macAddress.trim()
    ) {
      device.macAddress =
        macAddress.trim();
    }

    if (
      typeof firmware ===
        "string" &&
      firmware.trim()
    ) {
      device.firmware =
        firmware.trim();
    }

    if (
      typeof ipAddress ===
        "string" &&
      ipAddress.trim()
    ) {
      device.ipAddress =
        ipAddress.trim();
    }

    await device.save();

    // =================================================
    // GUARANTEED DEVICE REFERENCE
    // =================================================

    const currentDevice =
      device;

    // =================================================
    // NORMALIZE SENSOR ARRAY
    // =================================================

    const normalizedSensors: IncomingSensor[] =
      Array.isArray(sensors)
        ? sensors
            .filter(
              (sensor) =>
                sensor &&
                typeof sensor.slot ===
                  "number" &&
                typeof sensor.type ===
                  "string"
            )
            .map(
              (sensor) => ({
                slot:
                  sensor.slot,

                type:
                  sensor.type,

                value:
                  typeof sensor.value ===
                  "number"
                    ? sensor.value
                    : null,
              })
            )
        : [];

    // =================================================
    // SAVE TELEMETRY
    // =================================================

    const telemetry =
      await DeviceLog.create({
        deviceId:
          normalizedDeviceId,

        temperature:
          typeof temperature ===
          "number"
            ? temperature
            : undefined,

        humidity:
          typeof humidity ===
          "number"
            ? humidity
            : undefined,

        voltage:
          typeof voltage ===
          "number"
            ? voltage
            : undefined,

        current:
          typeof current ===
          "number"
            ? current
            : undefined,

        power:
          typeof power ===
          "number"
            ? power
            : undefined,

        energy:
          typeof energy ===
          "number"
            ? energy
            : undefined,

        wifiSSID:
          typeof wifiSSID ===
          "string"
            ? wifiSSID
            : undefined,

        ipAddress:
          typeof ipAddress ===
          "string"
            ? ipAddress
            : undefined,

        rssi:
          typeof rssi ===
          "number"
            ? rssi
            : undefined,

        freeHeap:
          typeof freeHeap ===
          "number"
            ? freeHeap
            : undefined,

        uptime:
          typeof uptime ===
          "number"
            ? uptime
            : undefined,

        sensors:
          normalizedSensors,
      });

    // =================================================
    // SENSOR CONFIGURATION
    // =================================================

    const configuredSensors: SensorConfig[] =
      Array.isArray(
        (currentDevice as any)
          .sensors
      )
        ? (currentDevice as any)
            .sensors
        : [];

    // =================================================
    // SENSOR NAME
    // =================================================

    function getSensorName(
      slot: number
    ): string {
      const configured =
        configuredSensors.find(
          (sensor) =>
            sensor.slot ===
            slot
        );

      if (
        configured?.name
      ) {
        return configured.name;
      }

      return `Sensor #${slot}`;
    }

    // =================================================
    // CREATE ALERT
    // =================================================

    async function activateAlert(
      options: {
        type: AlertType;

        title: string;

        message: string;

        severity:
          | "critical"
          | "warning"
          | "info";

        slot?: number;

        sensorType?: string;

        sensorName?: string;

        value?: number;

        threshold?: number;

        unit?: string;
      }
    ) {
      if (
        !isAlertType(
          options.type
        )
      ) {
        return;
      }

      const query: Record<
        string,
        unknown
      > = {
        deviceId:
          normalizedDeviceId,

        type:
          options.type,

        status:
          "active",
      };

      // Sensor alerts are unique per slot.
      if (
        typeof options.slot ===
        "number"
      ) {
        query.slot =
          options.slot;
      }

      const existing =
        await Alert.findOne(
          query
        );

      // Do not create duplicate
      // active alerts every 10 seconds.
      if (existing) {
        return;
      }

      await Alert.create({
        deviceId:
          normalizedDeviceId,

        deviceName:
          currentDevice.name ||
          normalizedDeviceId,

        type:
          options.type,

        title:
          options.title,

        message:
          options.message,

        severity:
          options.severity,

        slot:
          options.slot,

        sensorType:
          options.sensorType,

        sensorName:
          options.sensorName,

        value:
          typeof options.value ===
          "number"
            ? options.value
            : null,

        threshold:
          typeof options.threshold ===
          "number"
            ? options.threshold
            : null,

        unit:
          options.unit ||
          "",

        status:
          "active",

        triggeredAt:
          new Date(),
      });

      console.log(
        `[alerts] Created ${options.type} for ${normalizedDeviceId}`
      );
    }

    // =================================================
    // RESOLVE ALERT
    // =================================================

    async function resolveAlert(
      alertType: AlertType,
      slot?: number
    ) {
      const query: Record<
        string,
        unknown
      > = {
        deviceId:
          normalizedDeviceId,

        type:
          alertType,

        status:
          "active",
      };

      if (
        typeof slot ===
        "number"
      ) {
        query.slot =
          slot;
      }

      const activeAlert =
        await Alert.findOne(
          query
        );

      if (!activeAlert) {
        return;
      }

      activeAlert.status =
        "resolved";

      activeAlert.resolvedAt =
        new Date();

      await activeAlert.save();

      console.log(
        `[alerts] Resolved ${alertType} for ${normalizedDeviceId}`
      );
    }

    // =================================================
    // CHECK ALL SENSOR VALUES
    // =================================================

    for (
      const sensor of normalizedSensors
    ) {
      // Ignore missing values.
      if (
        sensor.value ===
          null ||
        sensor.value ===
          undefined ||
        !Number.isFinite(
          sensor.value
        )
      ) {
        continue;
      }

      const value =
        sensor.value;

      const sensorName =
        getSensorName(
          sensor.slot
        );

      const sensorType =
        sensor.type.toUpperCase();

      // =================================================
      // TEMPERATURE
      // =================================================

      if (
        sensorType ===
          "TEMPERATURE" ||
        sensorType ===
          "DHT_TEMPERATURE"
      ) {
        // HIGH TEMPERATURE

        if (
          !settings.highTemperatureEnabled
        ) {
          await resolveAlert(
            "HIGH_TEMPERATURE",
            sensor.slot
          );
        } else if (
          value >
          settings.highTemperature
        ) {
          await activateAlert({
            type:
              "HIGH_TEMPERATURE",

            title:
              "High Temperature",

            message:
              `${sensorName} temperature is ${value.toFixed(
                2
              )} °C`,

            severity:
              "critical",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              settings.highTemperature,

            unit:
              "°C",
          });
        } else {
          await resolveAlert(
            "HIGH_TEMPERATURE",
            sensor.slot
          );
        }

        // LOW TEMPERATURE

        if (
          !settings.lowTemperatureEnabled
        ) {
          await resolveAlert(
            "LOW_TEMPERATURE",
            sensor.slot
          );
        } else if (
          value <
          settings.lowTemperature
        ) {
          await activateAlert({
            type:
              "LOW_TEMPERATURE",

            title:
              "Low Temperature",

            message:
              `${sensorName} temperature is ${value.toFixed(
                2
              )} °C`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              settings.lowTemperature,

            unit:
              "°C",
          });
        } else {
          await resolveAlert(
            "LOW_TEMPERATURE",
            sensor.slot
          );
        }
      }

      // =================================================
      // HUMIDITY
      // =================================================

      if (
        sensorType ===
        "DHT_HUMIDITY"
      ) {
        // HIGH HUMIDITY

        if (
          !settings.highHumidityEnabled
        ) {
          await resolveAlert(
            "HIGH_HUMIDITY",
            sensor.slot
          );
        } else if (
          value >
          settings.highHumidity
        ) {
          await activateAlert({
            type:
              "HIGH_HUMIDITY",

            title:
              "High Humidity",

            message:
              `${sensorName} humidity is ${value.toFixed(
                2
              )}%`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              settings.highHumidity,

            unit:
              "%",
          });
        } else {
          await resolveAlert(
            "HIGH_HUMIDITY",
            sensor.slot
          );
        }

        // LOW HUMIDITY

        if (
          !settings.lowHumidityEnabled
        ) {
          await resolveAlert(
            "LOW_HUMIDITY",
            sensor.slot
          );
        } else if (
          value <
          settings.lowHumidity
        ) {
          await activateAlert({
            type:
              "LOW_HUMIDITY",

            title:
              "Low Humidity",

            message:
              `${sensorName} humidity is ${value.toFixed(
                2
              )}%`,

            severity:
              "warning",

            slot:
              sensor.slot,

            sensorType:
              sensor.type,

            sensorName,

            value,

            threshold:
              settings.lowHumidity,

            unit:
              "%",
          });
        } else {
          await resolveAlert(
            "LOW_HUMIDITY",
            sensor.slot
          );
        }
      }
    }

    // =================================================
    // CURRENT ALERT
    // =================================================

    if (
      typeof current ===
        "number" &&
      Number.isFinite(
        current
      )
    ) {
      if (
        !settings.highCurrentEnabled
      ) {
        await resolveAlert(
          "HIGH_CURRENT"
        );
      } else if (
        Math.abs(current) >
        settings.highCurrent
      ) {
        await activateAlert({
          type:
            "HIGH_CURRENT",

          title:
            "High Current",

          message:
            `Device current is ${current.toFixed(
              2
            )} A`,

          severity:
            "critical",

          value:
            current,

          threshold:
            settings.highCurrent,

          unit:
            "A",
        });
      } else {
        await resolveAlert(
          "HIGH_CURRENT"
        );
      }
    }

    // =================================================
    // RSSI ALERT
    // =================================================

    if (
      typeof rssi ===
        "number" &&
      Number.isFinite(
        rssi
      )
    ) {
      if (
        !settings.lowRssiEnabled
      ) {
        await resolveAlert(
          "LOW_RSSI"
        );
      } else if (
        rssi <
        settings.lowRssi
      ) {
        await activateAlert({
          type:
            "LOW_RSSI",

          title:
            "Weak Wi-Fi Signal",

          message:
            `Wi-Fi signal is ${rssi} dBm`,

          severity:
            "warning",

          value:
            rssi,

          threshold:
            settings.lowRssi,

          unit:
            "dBm",
        });
      } else {
        await resolveAlert(
          "LOW_RSSI"
        );
      }
    }

    // =================================================
    // RESPONSE
    // =================================================

    return NextResponse.json({
      success:
        true,

      message:
        "Telemetry received",

      deviceId:
        normalizedDeviceId,

      sensorCount:
        normalizedSensors.length,

      timestamp:
        new Date().toISOString(),

      telemetryId:
        String(
          telemetry._id
        ),
    });
  } catch (error) {
    console.error(
      "[telemetry] Error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
          ? error.message
          : String(error),
      },
      {
        status: 500,
      }
    );
  }
}